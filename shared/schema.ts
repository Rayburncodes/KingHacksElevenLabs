import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We'll store analysis history
export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  contractText: text("contract_text").notNull(),
  scenario: varchar("scenario", { length: 50 }).notNull(), // 'quit', 'payment', 'terminate'
  originalClause: text("original_clause"),
  plainEnglish: text("plain_english"),
  highlightSnippets: text("highlight_snippets").array(), // Specific strings to highlight
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAnalysisSchema = createInsertSchema(analyses).pick({
  contractText: true,
  scenario: true,
});

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;

export type AnalyzeRequest = InsertAnalysis;
export type AnalyzeResponse = {
  originalClause: string;
  plainEnglish: string;
  audioUrl?: string; // Placeholder for future TTS integration
};
