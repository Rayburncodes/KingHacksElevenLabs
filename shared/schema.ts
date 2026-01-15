import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We'll store analysis history
export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  contractText: text("contract_text").notNull(),
  scenario: varchar("scenario", { length: 50 }).notNull(), // 'quit', 'payment', 'terminate'
  language: varchar("language", { length: 20 }).notNull().default("english"), // 'english', 'french', 'spanish'
  originalClause: text("original_clause"),
  plainEnglish: text("plain_english"),
  riskHeadline: text("risk_headline"), // One-sentence summary
  highlightSnippets: text("highlight_snippets").array(),
  clarityLevel: varchar("clarity_level", { length: 20 }), // 'High', 'Medium', 'Low'
  clarityReason: text("clarity_reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAnalysisSchema = createInsertSchema(analyses).pick({
  contractText: true,
  scenario: true,
  language: true,
});

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;

export type AnalyzeRequest = InsertAnalysis;
export type AnalyzeResponse = {
  riskHeadline: string;
  originalClause: string;
  plainEnglish: string;
  language: "english" | "french" | "spanish";
  highlightSnippets?: string[];
  clarityLevel?: 'High' | 'Medium' | 'Low';
  clarityReason?: string;
  audioUrl?: string; // Placeholder for future TTS integration
};
