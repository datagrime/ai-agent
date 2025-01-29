import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";
import cors from "cors";

dotenv.config({ path: "../.env" });

console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

const app = express();
app.use(express.json());

const allowedOrigins = [
    "http://localhost:5500",
    "https://ai-agent-frontend-86vq.onrender.com",
    "https://www.alexmay.dev"
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("CORS policy does not allow this origin"));
            }
        },
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    })
);

app.get("/", (req, res) => {
    res.send("Server is running. Use /api/chat to chat with the AI.");
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/chat", async (req, res) => {
    try {
        const userInput = req.body.input.trim();
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
