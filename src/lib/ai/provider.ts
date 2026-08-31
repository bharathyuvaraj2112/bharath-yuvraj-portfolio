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
  const apiKey = (process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || "").trim();

  const fullSystemPrompt = `${SYSTEM_PROMPT_TEMPLATE}\n${contextData}`;

  // If no live API key is set yet, return smart context fallback
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
    console.warn("AI Provider call failed, serving smart fallback response:", err.message);
    return generateFallbackResponse(messages, contextData);
  }
}

async function callGeminiAPI(
  apiKey: string,
  systemInstruction: string,
  messages: ChatMessage[]
): Promise<string> {
  const model = process.env.AI_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

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
 * Smart contextual fallback engine when API key is unconfigured or offline
 */
function generateFallbackResponse(messages: ChatMessage[], context: string): string {
  const lastMsg = messages[messages.length - 1]?.content.toLowerCase() || "";

  if (lastMsg.includes("accident") || lastMsg.includes("detect")) {
    return "The **Accident Detect Alert** project is an AI & IoT safety system designed to automatically detect vehicle collisions and alert emergency services with location data in real time.";
  }

  if (lastMsg.includes("project") || lastMsg.includes("built") || lastMsg.includes("work")) {
    return "Bharath has engineered 4 major featured projects:\n1. **Accident Detect Alert** (AI / ML & IoT Safety System)\n2. **AI Study Assistant** (AI / ML Learning Tool)\n3. **AI Resume Analyzer** (Full Stack ATS Feedback Tool)\n4. **Developer Portfolio** (Next.js & Tailwind CSS)\n\nYou can view full overviews and live demos in the **Projects** section!";
  }

  if (lastMsg.includes("skill") || lastMsg.includes("technology") || lastMsg.includes("python") || lastMsg.includes("react") || lastMsg.includes("stack")) {
    return "Bharath specializes in **Artificial Intelligence & Machine Learning** and **Full Stack Engineering**.\n\nHis technical stack includes: **Python, Next.js, React, TypeScript, Tailwind CSS, Data Structures & Algorithms, and Machine Learning Fundamentals**.";
  }

  if (lastMsg.includes("education") || lastMsg.includes("college") || lastMsg.includes("btech") || lastMsg.includes("degree") || lastMsg.includes("school") || lastMsg.includes("12th") || lastMsg.includes("10th")) {
    return "Bharath's Academic Education Timeline:\n- **B.Tech in Artificial Intelligence & Machine Learning** (2023 - 2027)\n- **Intermediate / Class XII (MPC Stream)** (2021 - 2023)\n- **Secondary School Certificate / Class X** (2020 - 2021)";
  }

  if (lastMsg.includes("certif") || lastMsg.includes("credential")) {
    return "Bharath holds credentials in **Python for Data Science & ML**, **Full Stack Web Development**, and **Data Structures & Algorithmic Problem Solving**.";
  }

  if (lastMsg.includes("contact") || lastMsg.includes("email") || lastMsg.includes("hire") || lastMsg.includes("reach")) {
    return "You can reach Bharath directly via the **Contact** section at the bottom of this page or email him at **bharathyuvraj.dev@example.com**!";
  }

  return "I am Bharath's AI Portfolio Assistant! You can ask me about his AI/ML projects (like Accident Detect Alert), technical skills, education timeline, or how to contact him.";
}
