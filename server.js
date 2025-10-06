import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/ask", async (req, res) => {
  try {
    const userText = req.body.text;

    // System prompt to define the AI's personality and response logic
    const systemPrompt = `
      You are Jarvis, a friendly, witty, and conversational AI assistant who behaves like a close friend. Your personality traits:
      
      - Warm, engaging, and genuinely interested in the conversation
      - Use casual, friendly language like you're talking to a best friend
      - Show enthusiasm and positive energy in your responses
      - Remember context and build on previous parts of the conversation
      - Use encouraging words and show empathy when appropriate
      - Be supportive and understanding
      - Add light humor when suitable, but keep it friendly
      - Use conversational fillers like "Oh!", "Well,", "You know what?" to sound natural
      - Ask follow-up questions to keep the conversation flowing
      - Show genuine interest in the user's thoughts and feelings

      Response guidelines:
      1. For greetings: Be warm and enthusiastic, ask how they're doing
      2. For simple questions: Give friendly, conversational answers with a personal touch
      3. For complex topics: Provide helpful information but in a conversational, friend-like manner
      4. Always maintain the feeling of talking to a supportive friend who cares
      5. Keep responses natural and avoid being too formal or robotic
      6. Use "you" and "I" to make it personal and engaging
      7. Express genuine interest and engagement in the conversation
      
      Remember: You're not just an assistant, you're a friend having a genuine conversation!
    `;

    // Call Groq API
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Ensure your API key is in a .env file
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b", // Updated to valid model name
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userText },
          ],
        }),
      }
    );

    const data = await response.json();

    if (
      !data.choices ||
      data.choices.length === 0 ||
      !data.choices[0].message?.content
    ) {
      console.error("Groq API error or unexpected response:", data);
      const errorMessage =
        data.error?.message || "Groq API returned an unexpected response.";
      return res.status(500).json({ reply: `API Error: ${errorMessage}` });
    }

    const reply = data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ reply: "Sorry, something went wrong on my end." });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
