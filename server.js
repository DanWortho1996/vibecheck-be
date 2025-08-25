import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Load .env

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.post('/api/sentiment', async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "No text provided" });

  if (!process.env.OPENAI_KEY) {
    return res.status(500).json({ error: "OpenAI API key not found" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a sentiment analyzer. Respond with the mood (Positive 😀, Negative 😡, Neutral 😐) and a rating from 1 to 10. Format exactly like this: Mood (X/10)." },
          { role: "user", content: text }
        ],
        max_tokens: 20
      })
    });

    const data = await response.json();

    if (data.error) return res.status(500).json({ error: data.error.message });

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
