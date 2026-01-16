import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { insertAnalysisSchema } from "@shared/schema";
import OpenAI from "openai";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Initialize OpenAI client using Replit AI integration env vars
// Only initialize if API key is available
const openaiApiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
const openai = openaiApiKey ? new OpenAI({
  apiKey: openaiApiKey,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
}) : null;

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
        // pdf-parse v2+ uses PDFParse class
        const { PDFParse } = await import("pdf-parse");
        const parser = new PDFParse({ data: req.file.buffer });
        const result = await parser.getText();
        text = result.text;
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
      if (!openai) {
        return res.status(500).json({ 
          message: "OpenAI API key not configured. Please set AI_INTEGRATIONS_OPENAI_API_KEY or OPENAI_API_KEY environment variable." 
        });
      }

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
        model: "gpt-4o-mini", // Using gpt-4o-mini as default, fallback to gpt-3.5-turbo if needed
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
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        console.error("Raw response:", resultText);
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
        language: (saved.language || "english") as "english" | "french" | "spanish",
        highlightSnippets: saved.highlightSnippets || [],
        clarityLevel: (saved.clarityLevel as 'High' | 'Medium' | 'Low') || "Low",
        clarityReason: saved.clarityReason || "",
        audioUrl: undefined
      });

    } catch (error: any) {
      console.error("Analysis error:", error);
      
      // Provide more specific error messages
      if (error?.code === 'invalid_api_key' || error?.status === 401) {
        return res.status(500).json({ 
          message: "Invalid OpenAI API key. The key you provided appears to be an ElevenLabs key. Please get an OpenAI API key from https://platform.openai.com/api-keys (keys start with 'sk-', not 'sk_')" 
        });
      }
      
      if (error?.message?.includes('API key')) {
        return res.status(500).json({ 
          message: error.message || "OpenAI API key error. Please check your configuration." 
        });
      }
      
      res.status(500).json({ 
        message: error?.message || "Failed to analyze contract. Please check your OpenAI API key and try again." 
      });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, contractText, scenario, language = "english" } = req.body;
      if (!message || !contractText) {
        return res.status(400).json({ message: "Message and contract text are required" });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are ClauseCast AI, a professional legal assistant. 
            Answer follow-up questions about a specific contract scenario.
            
            Context:
            - Contract: ${contractText.substring(0, 10000)}
            - Scenario being discussed: ${scenario}
            - Preferred language: ${language}

            Guidelines:
            - Use calm, plain, professional language.
            - Answer in ${language}.
            - Do not re-explain the main scenario unless explicitly asked.
            - Focus strictly on the user's question relative to the contract.
            - Be concise but thorough.
            - This is for information only, not formal legal advice.`
          },
          { role: "user", content: message }
        ],
        temperature: 0.3,
      });

      const reply = response.choices[0].message.content;
      res.json({ reply });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to get AI response" });
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
