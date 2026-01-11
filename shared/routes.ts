import { z } from 'zod';
import { insertAnalysisSchema } from './schema';

export const api = {
  analyze: {
    process: {
      method: 'POST' as const,
      path: '/api/analyze',
      input: insertAnalysisSchema,
      responses: {
        200: z.object({
          riskHeadline: z.string(),
          originalClause: z.string(),
          plainEnglish: z.string(),
          highlightSnippets: z.array(z.string()).optional(),
          clarityLevel: z.enum(['High', 'Medium', 'Low']).optional(),
          clarityReason: z.string().optional(),
          audioUrl: z.string().optional(),
        }),
        500: z.object({
          message: z.string(),
        })
      },
    },
  },
  import: {
    parse: {
      method: 'POST' as const,
      path: '/api/import',
      responses: {
        200: z.object({
          text: z.string(),
          message: z.string(),
        }),
        400: z.object({
          message: z.string(),
        }),
        500: z.object({
          message: z.string(),
        })
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type NoteInput = any;
export type NoteResponse = any;
export type NoteUpdateInput = any;
export type NotesListResponse = any;
export type ValidationError = any;
export type NotFoundError = any;
export type InternalError = any;
