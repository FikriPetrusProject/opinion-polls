const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API;
const genAI = new GoogleGenerativeAI(apiKey);

//Gemini settings, "gemini-1.5-flash paling cepat"
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// topic = "frontend framework"
// choice = how many choices (default = 4)
const pollTopic = async (topic, choice = 4) => {

    const prompt = `
    Generate exactly ${choice} popular, distinct poll options for the topic: "${topic}".

    Output format: A single line of text with options separated by a semicolon. No numbers. No explanations.

    Example for topic "programming languages": Python; JavaScript; Rust; Go`;

    const result = await model.generateContent(prompt);
    const response = result.response;

    if (!response || !response.text()) {
        throw new Error("Gemini timeout.");
    }
    // Convert raw "Python; JavaScript; ..." into ["Python", "JavaScript", ...]
    const raw = response.text();
    const cleaned = raw
        .split(";")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

    return cleaned;
};




const summarizePoll = async (question, options = []) => {

    const prompt = `
    You are a neutral assistant helping summarize a poll for an app.

    Poll Question:
    "${question}"

    Poll Options:
    ${options.map((opt, i) => `${i + 1}. ${opt}`).join("\n")}

    Write a brief and neutral summary explaining what this poll is about and why it might matter to voters. Do not pick a winner or express opinions. Keep it short and clear.
  `;

    const result = await model.generateContent(prompt);
    const response = result.response;

    if (!response || !response.text()) {
        const err = new Error("Gemini failed to summarize the poll.");
        err.status = 503;
        throw err;
    }

    return response.text();

}

module.exports = { pollTopic, summarizePoll };
