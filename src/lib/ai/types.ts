export type AIDocumentType =
  | "profile"
  | "project"
  | "skill"
  | "certification"
  | "achievement"
  | "education";

export interface AIDocument {
  id: string;
  type: AIDocumentType;
  title: string;
  content: string;
  source: string;
  metadata: Record<string, any>;
  embedding?: number[];
  updatedAt: string;
}

export interface SearchResult {
  document: AIDocument;
  score: number;
}
