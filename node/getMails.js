const fs = require("fs").promises;
const path = require("path");
const { google } = require("googleapis");
// const base64url = require("base64url");
const { Base64 } = require("js-base64");

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
const TOKEN_PATH = path.join(__dirname, "token.json");
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");

// Load credentials from file
async function loadCredentials() {
    try {
        const content = await fs.readFile(CREDENTIALS_PATH, "utf8");
        return JSON.parse(content);
    } catch (error) {
        console.error("Error loading credentials:", error);
        process.exit(1);
    }
}

// Authorize Gmail API
async function authorize() {
    const credentials = await loadCredentials();
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    try {
        const token = await fs.readFile(TOKEN_PATH, "utf8");
        oAuth2Client.setCredentials(JSON.parse(token));
    } catch (error) {
        console.log("No token found, obtaining new token...");
        await getNewToken(oAuth2Client);
    }

    return oAuth2Client;
}

// Obtain new OAuth token
async function getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });
    console.log("Authorize this app by visiting this URL:", authUrl);

    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        readline.question("Enter the code from that page here: ", async (code) => {
            readline.close();
            const { tokens } = await oAuth2Client.getToken(code);
            oAuth2Client.setCredentials(tokens);
            await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
            console.log("Token stored to", TOKEN_PATH);
            resolve();
        });
    });
}

// Fetch unread emails
async function getMails(nMails) {
    const auth = await authorize();
    const gmail = google.gmail({ version: "v1", auth });

    try {
        const res = await gmail.users.messages.list({
            userId: "me",
            labelIds: ["UNREAD"],
            maxResults: nMails,
        });

        const messages = res.data.messages || [];
        if (messages.length === 0) {
            console.log("No new messages.");
            return [];
        }

        const messageList = [];

        for (const message of messages) {
            const msg = await gmail.users.messages.get({
                userId: "me",
                id: message.id,
            });

            const headers = msg.data.payload.headers;
            const subject = headers.find((h) => h.name === "Subject")?.value || "No Subject";
            const date = headers.find((h) => h.name === "Date")?.value || "Unknown Date";
            const from = headers.find((h) => h.name === "From")?.value || "Unknown Sender";

            let body = "No Content";

            try {
                const parts = msg.data.payload.parts || [];
                for (const part of parts) {
                    if (part.mimeType === "text/plain" && part.body.data) {
                        body = Base64.decode(part.body.data);
                        break;
                    }
                }
            } catch (error) {
                console.error("Error decoding email body:", error);
            }

            messageList.push({ From: from, Subject: subject, Body: body, Date: date });

            if (messageList.length >= nMails) break;
        }

        return messageList;
    } catch (error) {
        console.error("An error occurred:", error);
        return [];
    }
}

module.exports = { getMails };
