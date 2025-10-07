import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";

dotenv.config();
const app = express();

// --- In-Memory Storage ---
// Using simple in-memory storage. For production, consider a database like Redis or a file-based store.
let conversationHistory = [];
const userRequests = {}; // Stores timestamps of user requests for throttling

// --- Middleware Setup ---
app.use(
  cors({
    origin: "*", // Allow all origins for simplicity, tighten as needed
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// --- Helper Functions ---

/**
 * Strips extra spaces, symbols, and meaningless fillers.
 * @param {string} text - The raw user input.
 * @returns {string} The cleaned text.
 */
const cleanInput = (text) => {
  if (!text) return "";
  // Remove fillers, extra spaces, and non-essential symbols
  return text
    .toLowerCase()
    .replace(/\b(uh|uhm|umm|hmm|er|like|you know|ok)\b/g, "") // Remove common fillers
    .replace(/[^\w\s.,!?'"]/g, "") // Allow basic punctuation
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim();
};

/**
 * Performs input validation.
 * @param {string} text - The user input text.
 * @returns {{isValid: boolean, message: string, cleanedText: string}} Validation result.
 */
const validateInput = (text) => {
  const cleanedText = cleanInput(text);
  const words = cleanedText.split(/\s+/).filter(Boolean);

  // 1. Check for gibberish or repeated short words
  if (/^(\w+)\1{2,}$/.test(cleanedText.replace(/\s/g, ""))) {
    return { isValid: false, message: "Gibberish detected." };
  }

  // 2. Check if the input is too short or lacks meaning
  if (words.length < 3) {
    return { isValid: false, message: "Please speak clearly." };
  }

  // 3. A simple check for meaningful content (e.g., has at least one longer word)
  const hasMeaningfulWord = words.some((word) => word.length > 3);
  if (!hasMeaningfulWord && words.length < 5) {
    return { isValid: false, message: "Please speak clearly." };
  }

  return { isValid: true, message: "Input is valid.", cleanedText };
};

/**
 * Prunes conversation history older than 7 days.
 */
const pruneOldHistory = () => {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  conversationHistory = conversationHistory.filter(
    (entry) => entry.timestamp >= sevenDaysAgo
  );
  console.log("Pruned old conversation history.");
};

// Schedule history pruning to run once a day
setInterval(pruneOldHistory, 24 * 60 * 60 * 1000);

// --- Rate Limiting & Throttling ---

// Rule: Limit to 5 requests per minute per IP in live mode.
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: {
    reply:
      "You have sent too many requests. Please wait a minute before trying again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rule: Prevent spamming within 3 seconds.
const throttleMiddleware = (req, res, next) => {
  const userId = req.ip; // Use IP address as a simple user identifier
  const now = Date.now();
  const lastRequestTime = userRequests[userId] || 0;

  if (now - lastRequestTime < 3000) {
    // Less than 3 seconds since last request
    return res.status(429).json({
      reply: "Hold on! Please wait a few seconds before asking again.",
    });
  }

  userRequests[userId] = now;
  next();
};

// --- API Endpoints ---

app.get("/", (req, res) => {
  res.json({ message: "Rhyniox AI Backend is running!" });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

/**
 * Main conversation handler with all rules enforced.
 */
app.post("/ask", apiLimiter, throttleMiddleware, async (req, res) => {
  try {
    const { text: userText, userName = "friend", mode = "live" } = req.body;

    // 1. Input Validation
    const { isValid, message, cleanedText } = validateInput(userText);
    if (!isValid) {
      return res.status(400).json({ reply: message });
    }

    // 2. Word & Token Limits for Live Mode
    if (mode === "live") {
      const wordCount = cleanedText.split(/\s+/).filter(Boolean).length;
      if (wordCount > 25) {
        return res.status(400).json({
          reply:
            "That’s a bit long! Try using record mode for longer questions.",
        });
      }
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("No API key found in environment variables");
      return res
        .status(500)
        .json({ reply: "Server configuration error: API key missing" });
    }

    // System prompt remains the same
    const systemPrompt = `
      You are Jarvis, a friendly, witty, and conversational AI assistant.
      You are talking to ${userName}.
      CRITICAL RESPONSE GUIDELINES:
      1. Keep responses SHORT and CONCISE - maximum 2-3 sentences.
      2. Be conversational and friendly.
      3. DO NOT use markdown formatting like **bold** or *italic*.
      4. Write in plain text that sounds natural when spoken aloud.
    `;

    // 3. Call External AI API
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama3-8b-8192", // Using a standard compatible model
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: cleanedText },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      // Gracefully handle AI API errors
      console.error("API Error:", response.status, await response.text());
      return res
        .status(502)
        .json({ reply: "Oops, I couldn’t process that. Try again." });
    }

    const data = await response.json();

    if (
      !data.choices ||
      data.choices.length === 0 ||
      !data.choices[0].message?.content
    ) {
      console.error("Groq API error or unexpected response:", data);
      return res
        .status(500)
        .json({ reply: "Oops, I couldn’t process that. Try again." });
    }

    let reply = data.choices[0].message.content.trim();

    // 4. History Management
    conversationHistory.push({
      user: cleanedText,
      ai: reply,
      timestamp: Date.now(),
    });

    // 5. Artificial Delay for Smoothness
    const delay = Math.floor(Math.random() * 201) + 200; // 200-400ms delay
    setTimeout(() => {
      res.json({ reply });
    }, delay);
  } catch (err) {
    // 6. Global Error Handling (Never crash the server)
    console.error("Server error in /ask endpoint:", err);
    res
      .status(500)
      .json({ reply: "Oops, I couldn’t process that. Try again." });
  }
});

/**
 * Returns the 20 most recent conversation turns.
 */
app.get("/history", (req, res) => {
  const recentHistory = conversationHistory.slice(-20).map((entry) => ({
    user: entry.user,
    ai: entry.ai,
  }));
  res.json({ history: recentHistory.reverse() });
});

/**
 * Manually clears the entire conversation history.
 */
app.get("/clear-history", (req, res) => {
  conversationHistory = [];
  console.log("Conversation history cleared manually.");
  res.json({ message: "Conversation history has been cleared." });
});

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔄 Health check available at http://localhost:${PORT}/health`);
  pruneOldHistory(); // Initial prune on startup
});

// --- Graceful Shutdown ---
const shutdown = (signal) => {
  console.log(`${signal} received, shutting down gracefully.`);
  server.close(() => {
    console.log("Process terminated.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
