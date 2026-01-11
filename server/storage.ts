import { db } from "./db";
import { analyses, type InsertAnalysis, type Analysis } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  createAnalysis(analysis: InsertAnalysis & { originalClause: string, plainEnglish: string, highlightSnippets?: string[] }): Promise<Analysis>;
  getAnalysis(id: number): Promise<Analysis | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createAnalysis(analysis: InsertAnalysis & { originalClause: string, plainEnglish: string, highlightSnippets?: string[] }): Promise<Analysis> {
    const [result] = await db.insert(analyses).values(analysis).returning();
    return result;
  }

  async getAnalysis(id: number): Promise<Analysis | undefined> {
    const [result] = await db.select().from(analyses).where(eq(analyses.id, id));
    return result;
  }
}

export const storage = new DatabaseStorage();
