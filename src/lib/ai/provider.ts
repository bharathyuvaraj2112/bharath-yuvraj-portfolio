import { SYSTEM_PROMPT_TEMPLATE } from "./prompts";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function generateAIResponse(
  messages: ChatMessage[],
  contextData: string
): Promise<string> {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  const fullSystemPrompt = `${SYSTEM_PROMPT_TEMPLATE}\n${contextData}`;

  // If no live API key is configured yet on server, return intelligent contextual fallback
  if (!apiKey) {
    return generateFallbackResponse(messages, contextData);
  }

  try {
    if (provider === "openai") {
      return await callOpenAIAPI(apiKey, fullSystemPrompt, messages);
    } else {
      return await callGeminiAPI(apiKey, fullSystemPrompt, messages);
    }
  } catch (err: any) {
    console.error("AI Provider execution error:", err);
    return "Sorry, the AI assistant is temporarily unavailable. Please feel free to explore Bharath's portfolio sections or reach out directly using the contact form below!";
  }
}

async function callGeminiAPI(
  apiKey: string,
  systemInstruction: string,
  messages: ChatMessage[]
): Promise<string> {
  const model = process.env.AI_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Convert ChatHistory to Gemini Contents structure
  const contents = [
    {
      role: "user",
      parts: [{ text: systemInstruction }],
    },
    {
      role: "model",
      parts: [{ text: "Understood. I am Bharath Yuvraj's AI Portfolio Assistant and will answer questions strictly based on his portfolio context." }],
    },
    ...messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    })),
  ];

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API Error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!reply) {
    throw new Error("Empty response from Gemini API");
  }

  return reply;
}

async function callOpenAIAPI(
  apiKey: string,
  systemInstruction: string,
  messages: ChatMessage[]
): Promise<string> {
  const model = process.env.AI_MODEL || "gpt-4o-mini";
  const url = "https://api.openai.com/v1/chat/completions";

  const apiMessages = [
    { role: "system", content: systemInstruction },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: apiMessages,
      max_tokens: 600,
      temperature: 0.5,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API Error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "No response generated.";
}

/**
 * Intelligent local fallback when AI API key is not yet set in server environment
 */
function generateFallbackResponse(messages: ChatMessage[], context: string): string {
  const lastMsg = messages[messages.length - 1]?.content.toLowerCase() || "";

  if (lastMsg.includes("project") || lastMsg.includes("accident") || lastMsg.includes("resume") || lastMsg.includes("assistant")) {
    return "Bharath has built 4 key projects:\n1. **Accident Detect Alert** (AI / ML)\n2. **AI Study Assistant** (AI / ML)\n3. **AI Resume Analyzer** (Full Stack & AI)\n4. **Developer Portfolio** (Next.js & Tailwind CSS)\n\nYou can explore detailed overviews of each project in the **Projects** section!";
  }

  if (lastMsg.includes("skill") || lastMsg.includes("technology") || lastMsg.includes("python") || lastMsg.includes("react") || lastMsg.includes("know")) {
    return "Bharath specializes in **Artificial Intelligence & Machine Learning** alongside **Full Stack Web Development**.\n\nKey skills include: **Python, Next.js, React, TypeScript, Tailwind CSS, Data Structures & Algorithms, and Machine Learning Fundamentals**.";
  }

  if (lastMsg.includes("education") || lastMsg.includes("college") || lastMsg.includes("degree") || lastMsg.includes("btech") || lastMsg.includes("school") || lastMsg.includes("12th") || lastMsg.includes("10th")) {
    return "Bharath's Academic Timeline:\n- **B.Tech in Artificial Intelligence & Machine Learning** (2023 - 2027)\n- **Intermediate / Class XII (MPC Stream)** (2021 - 2023)\n- **Secondary School Certificate / Class X** (2020 - 2021)";
  }

  if (lastMsg.includes("contact") || lastMsg.includes("email") || lastMsg.includes("hire") || lastMsg.includes("reach")) {
    return "You can contact Bharath directly through the **Contact** section at the bottom of the page, or by emailing him at **bharathyuvraj.dev@example.com**!";
  }

  return "Hi! I am Bharath's AI Portfolio Assistant. I can answer questions about his AI/ML projects, skills, B.Tech education, certifications, and achievements. What would you like to know?";
}
