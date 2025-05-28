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

app.post("/api/analyze", async (req, res) => {
  const { results } = req.body;

  if (!Array.isArray(results) || results.length < 2) {
    return res
      .status(400)
      .json({ error: "At least two results are required for reflection." });
  }

  const formattedResults = results
    .map((r, idx) => {
      return `Result ${idx + 1}:\nModel: ${r.model}\nTemperature: ${
        r.temperature
      }\nMax Tokens: ${r.max_tokens}\nPresence Penalty: ${
        r.presence_penalty
      }\nFrequency Penalty: ${r.frequency_penalty}\nOutput: ${r.output}\n`;
    })
    .join("\n");

  const reflectionPrompt = `
You are an AI analyst reviewing variations in language model outputs based on different configuration parameters.
Below are multiple outputs generated with different settings.

${formattedResults}

Please write a 2-paragraph reflection explaining:
1. What changed across these outputs.
2. Why those changes likely occurred (based on temperature, penalties, tokens, etc.).
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You analyze variations in AI-generated outputs.",
        },
        { role: "user", content: reflectionPrompt },
      ],
      temperature: 0.7,
    });

    const reflection = completion.choices[0].message.content;
    res.json({ reflection });
  } catch (error) {
    console.error("Reflection generation failed:", error.message);
    res
      .status(500)
      .json({ error: "Failed to generate reflection", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
