const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/translate", async (req, res) => {
  try {
    const { inputText, language } = req.body;

    const response = await axios.post(
      "https://glhf.chat/api/openai/v1/chat/completions",
      {
        model: "hf:deepseek-ai/DeepSeek-V3",
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Translate the following text to ${
              language === "en" ? "English" : "Indonesian"
            }:`,
          },
          {
            role: "user",
            content: inputText,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer glhf_ef882617166556f06dc68caa8cd36b75`,
        },
      }
    );

    res.json({ translatedText: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Translation failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
