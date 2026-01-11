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
        Your job is to analyze a contract text and explain the consequences of a specific scenario in simple, plain English.
        
        The user will provide:
        1. A scenario (e.g., "quit", "payment", "terminate")
        2. Contract text

        You must:
        1. Find the specific clause(s) in the text relevant to that scenario. If not found, look for general terms that might apply (e.g. "termination for convenience" if "quit" is asked).
        2. Extract the original text of that clause.
        3. Write a 1-2 paragraph explanation in plain English. 
           - Be calm, professional, and neutral.
           - Mention specific penalties, notice periods, or fees if they exist.
           - If the contract is silent on the issue, state that clearly.
           - Do not use legal jargon.
        
        Return ONLY a JSON object with this structure:
        {
          "riskHeadline": "One clear summary sentence about the main consequence...",
          "originalClause": "substring from the contract...",
          "plainEnglish": "Your explanation here...",
          "highlightSnippets": ["exact sentence 1 from contract", "exact sentence 2 from contract"],
          "clarityLevel": "High" | "Medium" | "Low",
          "clarityReason": "Short reason for the level (e.g. 'explicit clause found')"
        }`;

      const userPrompt = `Scenario: ${input.scenario}\n\nContract Text:\n${input.contractText}`;

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

  return httpServer;
}
