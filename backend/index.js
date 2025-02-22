import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";
import cors from "cors";

dotenv.config(); 

console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

const app = express();
app.use(express.json());

const allowedOrigins = [
    "http://localhost:5500",
    "https://ai-agent-1-vmje.onrender.com",
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
const assistantId = "asst_zGKJgMXKH8WgRNumHrCRTpMS"; // Your custom assistant ID

app.post("/api/chat", async (req, res) => {
    try {
        const userInput = req.body.input.trim();

        // Create a new thread
        const thread = await openai.beta.threads.create();

        // Add message to the thread
        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: userInput,
        });

        // Run the assistant on the thread
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistantId,
        });

        // Wait for the response
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        while (runStatus.status !== "completed") {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before checking again
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        }

        // Retrieve the latest message
        const messages = await openai.beta.threads.messages.list(thread.id);
        const lastMessage = messages.data.find(msg => msg.role === "assistant");

        res.json({ reply: lastMessage ? lastMessage.content[0].text.value : "No response received." });

    } catch (error) {
        console.error("OpenAI API error:", error);
        res.status(500).json({ reply: "Sorry, something went wrong." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
