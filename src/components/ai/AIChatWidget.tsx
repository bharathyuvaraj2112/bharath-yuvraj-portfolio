"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Sparkles, Send, X, RotateCcw, Loader2, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "Tell me about Bharath's projects.",
  "What technologies does Bharath use?",
  "Tell me about the Accident Detect Alert project.",
  "What is Bharath currently learning?",
  "How can I contact Bharath?",
];

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Bharath's AI portfolio assistant. Ask me about his AI/ML projects, technical skills, education, certifications, or experience!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (textToSend?: string) => {
    const messageContent = textToSend || input.trim();
    if (!messageContent || loading) return;

    setError(null);
    const newMessages: Message[] = [...messages, { role: "user", content: messageContent }];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageContent,
          history: newMessages.slice(1, -1), // send context history excluding initial welcome
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to connect to AI assistant service.");
      }

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch {
      setError("Sorry, the AI assistant is temporarily unavailable. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi! I'm Bharath's AI portfolio assistant. Ask me about his AI/ML projects, technical skills, education, certifications, or experience!",
      },
    ]);
    setError(null);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-white text-black font-mono font-bold text-xs shadow-2xl border border-zinc-300 hover:bg-zinc-200 transition-all group"
          aria-label="Ask AI Assistant"
        >
          <div className="p-1.5 rounded-full bg-black text-white group-hover:rotate-12 transition-transform">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span>Ask AI Assistant</span>
        </motion.button>
      </div>

      {/* Floating Chat Modal Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-105 max-h-150 h-[80vh] flex flex-col rounded-3xl bg-zinc-950/95 border border-zinc-800 backdrop-blur-xl shadow-2xl overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-zinc-900/80 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white text-black font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <span>Portfolio AI Assistant</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-400">Powered by Bharath&apos;s Portfolio Context</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClear}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Reset Conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-white text-black font-medium rounded-tr-none"
                        : "bg-zinc-900/90 text-zinc-200 border border-zinc-800 rounded-tl-none whitespace-pre-wrap font-mono"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {/* Thinking Loading State */}
              {loading && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="w-7 h-7 rounded-xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-zinc-900 text-zinc-400 text-xs font-mono border border-zinc-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.4s]" />
                    <span className="ml-1 text-[11px]">Thinking...</span>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono">
                  {error}
                </div>
              )}

              {/* Suggested Questions Pills (shown when 1 message) */}
              {messages.length === 1 && (
                <div className="pt-3 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                    Suggested Questions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[11px] font-mono transition-colors text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-zinc-900/80 border-t border-zinc-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Bharath's projects, skills..."
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-zinc-600 disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
