import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { insertAnalysisSchema } from "@shared/schema";
import OpenAI from "openai";
import multer from "multer";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Initialize OpenAI client using Replit AI integration env vars
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.import.parse.path, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      let text = "";
      if (req.file.mimetype === 'application/pdf') {
        const data = await pdf(req.file.buffer);
        text = data.text;
      } else if (req.file.mimetype === 'text/plain') {
        text = req.file.buffer.toString('utf-8');
      } else {
        return res.status(400).json({ message: "Unsupported file type. Please upload .txt or .pdf" });
      }

      res.json({ text, message: "Contract loaded" });
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({ message: "Failed to parse contract file" });
    }
  });

  app.post(api.analyze.process.path, async (req, res) => {
    try {
      const input = insertAnalysisSchema.parse(req.body);

      const systemPrompt = 
        `You are a helpful legal assistant for a non-lawyer. 
        Your job is to analyze a contract text and explain the consequences of a specific scenario or question in simple, plain language.
        
        The user will provide:
        1. A scenario or question (e.g., "quit", "payment", "terminate", or a custom question like "What happens if I take a leave of absence?")
        2. Contract text
        3. Target language (e.g., "english", "french", "spanish")

        You must:
        1. Find the specific clause(s) in the text relevant to that scenario or question.
        2. Extract the original text of that clause (keep it in its original language from the contract).
        3. Write a 1-2 paragraph explanation in the requested target language. 
           - Be calm, professional, and neutral.
           - Mention specific penalties, notice periods, fees, or restrictions if they exist.
           - If the contract is silent on the issue, state that clearly.
           - Do not use legal jargon.
           - For custom questions, directly address what the user asked.
        
        Return ONLY a JSON object with this structure:
        {
          "riskHeadline": "One clear summary sentence in the target language about the main consequence or answer...",
          "originalClause": "substring from the contract in its original language...",
          "plainEnglish": "Your explanation here in the target language...",
          "highlightSnippets": ["exact sentence 1 from contract", "exact sentence 2 from contract"],
          "clarityLevel": "High" | "Medium" | "Low",
          "clarityReason": "Short reason in the target language for the level"
        }`;

      // Check if scenario is a predefined one or a custom question
      const isPredefinedScenario = ['quit', 'payment', 'terminate'].includes(input.scenario.toLowerCase());
      const promptLabel = isPredefinedScenario ? 'Scenario' : 'Question';
      
      const userPrompt = `${promptLabel}: ${input.scenario}\nTarget Language: ${input.language}\n\nContract Text:\n${input.contractText}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      });

      const resultText = completion.choices[0].message.content || "{}";
      let aiResult;
      try {
        aiResult = JSON.parse(resultText);
      } catch (e) {
        console.error("Failed to parse AI response:", resultText);
        aiResult = { 
          riskHeadline: "An error occurred during analysis.",
          originalClause: "Could not parse AI response.", 
          plainEnglish: "An error occurred while analyzing the contract.",
          highlightSnippets: [],
          clarityLevel: "Low",
          clarityReason: "Error parsing AI response"
        };
      }

      // Store in DB for history
      const saved = await storage.createAnalysis({
        ...input,
        riskHeadline: aiResult.riskHeadline || "Analysis complete.",
        originalClause: aiResult.originalClause || "Not found",
        plainEnglish: aiResult.plainEnglish || "Could not generate explanation",
        highlightSnippets: aiResult.highlightSnippets || [],
        clarityLevel: aiResult.clarityLevel || "Low",
        clarityReason: aiResult.clarityReason || "Unspecified"
      });

      res.json({
        riskHeadline: saved.riskHeadline || "",
        originalClause: saved.originalClause || "",
        plainEnglish: saved.plainEnglish || "",
        language: saved.language as "english" | "french" | "spanish",
        highlightSnippets: saved.highlightSnippets || [],
        clarityLevel: (saved.clarityLevel as 'High' | 'Medium' | 'Low') || "Low",
        clarityReason: saved.clarityReason || "",
        audioUrl: undefined
      });

    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ message: "Failed to analyze contract" });
    }
  });

  app.post("/api/tts", async (req, res) => {
    try {
      const { text, language = 'english' } = req.body;
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
      
      // Map languages to high-quality multilingual voices
      // Rachel (21m00Tcm4TlvDq8ikWAM) supports many languages including ES/FR
      const VOICE_MAP: Record<string, string> = {
        english: "21m00Tcm4TlvDq8ikWAM", // Rachel
        french: "21m00Tcm4TlvDq8ikWAM",  // Rachel supports French
        spanish: "21m00Tcm4TlvDq8ikWAM", // Rachel supports Spanish
      };

      const voiceId = VOICE_MAP[language] || VOICE_MAP.english;

      if (!ELEVEN_LABS_API_KEY) {
        return res.status(500).json({ message: "ElevenLabs API key not configured" });
      }

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": ELEVEN_LABS_API_KEY,
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2", // Multilingual v2 is better for non-English
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`ElevenLabs API error: ${JSON.stringify(errorData)}`);
      }

      const audioBuffer = await response.arrayBuffer();
      res.set({
        "Content-Type": "audio/mpeg",
        "Transfer-Encoding": "chunked",
      });
      res.send(Buffer.from(audioBuffer));
    } catch (error) {
      console.error("TTS error:", error);
      res.status(500).json({ message: "Failed to generate speech" });
    }
  });

  return httpServer;
}
