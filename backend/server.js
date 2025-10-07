import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// Enhanced CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "http://localhost:5501",
      "http://127.0.0.1:5501",
      "http://localhost:8080",
      "http://127.0.0.1:8080",
      "https://rhyniox-ai.vercel.app",
      "https://rhyniox-ai-git-main-yagnarashagan6s-projects.vercel.app",
      "https://rhyniox-ai-yagnarashagan6s-projects.vercel.app",
      "file://",
      "*",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: false,
  })
);

// Additional CORS headers for preflight requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Accept"
  );
  res.header("Access-Control-Max-Age", "86400"); // 24 hours

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    console.log("Handling preflight request from:", req.headers.origin);
    return res.status(200).end();
  }

  console.log(`${req.method} ${req.path} from origin:`, req.headers.origin);
  next();
});

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Add a simple root endpoint for testing
app.get("/", (req, res) => {
  res.json({ message: "Rhyniox AI Backend is running!" });
});

// Add a health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.post("/ask", async (req, res) => {
  try {
    console.log("Received request:", req.body);

    const userText = req.body.text;
    const userName = req.body.userName || "friend";

    if (!userText) {
      return res.status(400).json({ reply: "No text provided" });
    }

    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error("No API key found in environment variables");
      return res
        .status(500)
        .json({ reply: "Server configuration error: API key missing" });
    }

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

      You are talking to ${userName}.

      CRITICAL RESPONSE GUIDELINES:
      1. Keep responses SHORT and CONCISE - maximum 2-3 sentences for simple questions
      2. For factual questions (names, dates, lists, definitions): give direct answers first, then optionally add brief friendly comment
      3. For greetings: Be warm but brief - 1-2 sentences max
      4. For complex topics: Still keep it conversational but focused - 3-4 sentences max
      5. Avoid long explanations unless specifically asked
      6. Use bullet points only when absolutely necessary for clarity
      7. Always maintain the feeling of talking to a supportive friend who cares
      8. Keep responses natural and avoid being too formal or robotic
      9. Use "you" and "I" to make it personal and engaging
      10. Express genuine interest and engagement in the conversation
      11. DO NOT use any markdown formatting like **bold**, *italic*, or any special characters
      12. DO NOT use emojis in your responses
      13. Write in plain text that sounds natural when spoken aloud
      
      Examples:
      - For "tell me top 5 Tamil actors": "Sure! The top 5 Tamil actors are Rajinikanth, Kamal Haasan, Vijay, Suriya, and Dhanush. Who's your favorite?"
      - For "what's the weather": "I'd check a weather app for real-time info, but I'm always here to chat!"
      - For "how are you": "I'm doing great! Thanks for asking. How about you?"

      Remember: You're a voice assistant - keep responses brief, friendly, and in plain text that sounds natural when spoken!
    `;

    console.log("Making request to Groq API...");

    // Call Groq API
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b", // Updated to a supported Groq model
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userText },
          ],
          max_tokens: 150, // Reduced from 1000 to enforce brevity
          temperature: 0.7,
        }),
      }
    );

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API response error:", errorText);
      return res.status(500).json({
        reply: `API Error: ${response.status} - ${response.statusText}`,
      });
    }

    const data = await response.json();
    console.log("API response received");

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

    let reply = data.choices[0].message.content;

    // Clean up the response - remove any remaining markdown or emojis
    reply = reply.replace(/\*\*/g, "").replace(/\*/g, ""); // Remove bold/italic markers
    reply = reply.replace(/[^\w\s.,!?;:'"\-()\s]/g, ""); // Remove emojis and special characters

    console.log("Sending reply back to client");
    res.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ reply: "Sorry, something went wrong on my end." });
  }
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Server accessible from any IP on port ${PORT}`);
  console.log(`🔄 Health check available at http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
