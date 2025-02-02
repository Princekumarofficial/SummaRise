require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { getSummaryList } = require("./summarize");

const app = express();
app.use(cors());
app.use(express.json());

// API Route: Get Summarized Emails
app.get("/summaries", async (req, res) => {
    try {
        const nMails = parseInt(req.query.count) || 5; // Default to 5 emails
        const summaries = await getSummaryList(nMails);
        res.json(summaries);
    } catch (error) {
        console.error("Error in /summaries route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
