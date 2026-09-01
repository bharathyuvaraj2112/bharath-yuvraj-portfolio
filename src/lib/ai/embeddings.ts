/**
 * Server-side Vector Embeddings & Similarity Utilities
 */

// Simple tokenizer & term frequency map for vectorizing text
export function tokenizeText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

/**
 * Creates a normalized frequency vector representation for lightweight, zero-dependency vector search
 */
export function generateSparseVector(text: string, vocabulary: string[]): number[] {
  const tokens = tokenizeText(text);
  const freqMap: Record<string, number> = {};
  tokens.forEach((t) => {
    freqMap[t] = (freqMap[t] || 0) + 1;
  });

  return vocabulary.map((vocabTerm) => freqMap[vocabTerm] || 0);
}

/**
 * Calculates Cosine Similarity score between two vector arrays
 * Returns value between 0.0 (unrelated) and 1.0 (identical)
 */
export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
