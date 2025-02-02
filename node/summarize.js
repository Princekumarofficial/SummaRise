require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getMails } = require("./getMails"); // Importing email function

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function getSummaryList(nSummary = 10) {
    try {
        const mails = await getMails(nSummary); // Fetch emails

        for (const mail of mails) {
            const prompt = `
                What is this mail trying to tell me in less than 50 words 
                without showing order details or transaction details: 
                \nFrom- ${mail.From} 
                \nSubject- ${mail.Subject} 
                \nBody- ${mail.Body}
            `;

            try {
                const response = await model.generateContent(prompt);
                mail.summary = response.response.text(); // Store summary in email object
            } catch (error) {
                console.error("Error generating summary:", error);
                mail.summary = "Could not generate summary.";
            }
        }

        return mails;
    } catch (error) {
        console.error("Error fetching emails:", error);
        return [];
    }
}

module.exports = { getSummaryList };
