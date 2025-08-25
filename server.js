import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// ✅ Sentiment API
app.post("/api/sentiment", async (req, res) => {
  const { text } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a sentiment analyzer. Reply ONLY with JSON like { mood: Positive|Negative|Neutral, score: 1-10 }.",
          },
          { role: "user", content: text },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const message = data.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(message);

    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Fallback to frontend (index.html) for unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
