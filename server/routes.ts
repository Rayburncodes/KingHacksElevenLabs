import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { insertAnalysisSchema } from "@shared/schema";
import OpenAI from "openai";

// Initialize OpenAI client using Replit AI integration env vars
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

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
          "originalClause": "substring from the contract...",
          "plainEnglish": "Your explanation here...",
          "highlightSnippets": ["exact sentence 1 from contract", "exact sentence 2 from contract"]
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
          originalClause: "Could not parse AI response.", 
          plainEnglish: "An error occurred while analyzing the contract.",
          highlightSnippets: []
        };
      }

      // Store in DB for history
      const saved = await storage.createAnalysis({
        ...input,
        originalClause: aiResult.originalClause || "Not found",
        plainEnglish: aiResult.plainEnglish || "Could not generate explanation",
        highlightSnippets: aiResult.highlightSnippets || []
      });

      res.json({
        originalClause: saved.originalClause || "",
        plainEnglish: saved.plainEnglish || "",
        highlightSnippets: saved.highlightSnippets || [],
        audioUrl: undefined
      });

    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ message: "Failed to analyze contract" });
    }
  });

  return httpServer;
}
