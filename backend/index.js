const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize OpenAI instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST route to generate completions for given combinations
app.post("/api/generate", async (req, res) => {
  const {
    model,
    systemPrompt,
    userPrompt,
    temperature,
    max_tokens,
    presence_penalty,
    frequency_penalty,
    stop,
  } = req.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature,
      max_tokens,
      presence_penalty,
      frequency_penalty,
      ...(stop ? { stop } : {}),
    });

    const output = chatCompletion.choices[0].message.content;

    res.json({ output });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({
      error: "Failed to generate completion",
      details: error?.message || error,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
