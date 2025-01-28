import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";
import cors from "cors";  // ✅ Import CORS

// Load the .env file from the parent directory
dotenv.config({ path: "../.env" });

console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);


const app = express();
app.use(express.json()); // Built-in body parser for JSON in Express

// ✅ Enable CORS for requests from the frontend
app.use(
    cors({
        origin: "http://localhost:5500", // Allow frontend on port 5500
        methods: ["GET", "POST"], // Allow only GET and POST requests
        allowedHeaders: ["Content-Type"], // Allow Content-Type headers
    })
);

// Default homepage route
app.get("/", (req, res) => {
    res.send("Server is running. Use the /api/chat endpoint to chat with the AI.");
});

// OpenAI API Setup
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Chat API endpoint
app.post("/api/chat", async (req, res) => {
    const userInput = req.body.input.trim();

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: userInput },
            ],
        });

        res.json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI API error:", error);
        res.status(500).json({ reply: "Sorry, something went wrong." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
