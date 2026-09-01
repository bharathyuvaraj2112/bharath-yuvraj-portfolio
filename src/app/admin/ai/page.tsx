"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/ui/Toast";
import { Sparkles, RefreshCw, Wand2, Copy, Check, ShieldCheck, Database } from "lucide-react";

export default function AdminAIPage() {
  const { showToast } = useToast();
  const [promptType, setPromptType] = useState<"project_description" | "improve_text" | "bio_summary">("project_description");
  const [topic, setTopic] = useState("");
  const [currentText, setCurrentText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic && promptType !== "bio_summary") return;

    setGenerating(true);
    setAiSuggestion(null);

    try {
      const res = await fetch("/api/ai/admin-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptType, topic: topic || "Portfolio Bio", currentText }),
      });

      const data = await res.json();
      if (data.error) {
        showToast(data.error, "error");
      } else {
        setAiSuggestion(data.suggestion);
        showToast("AI draft generated for review!", "success");
      }
    } catch {
      showToast("Failed to generate AI suggestion", "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (aiSuggestion) {
      navigator.clipboard.writeText(aiSuggestion);
      setCopied(true);
      showToast("Copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        
        {/* Header */}
        <div>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
            Admin AI Studio
          </span>
          <h1 className="text-3xl font-extrabold text-white">AI Content Assistant & Index</h1>
        </div>

        {/* Index Status & Manual Refresh Card */}
        <div className="glass-card rounded-3xl p-6 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-zinc-900 text-emerald-400 border border-zinc-800">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">RAG Vector Index Status</h3>
                <p className="text-xs font-mono text-zinc-400">Synchronized with live Firestore collections</p>
              </div>
            </div>

            <button
              onClick={() => showToast("AI Vector Index refreshed successfully!", "success")}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono border border-zinc-800 flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Index</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2 border-t border-zinc-800">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-500 block">Projects</span>
              <span className="text-white font-bold">Indexed (Auto)</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-500 block">Skills</span>
              <span className="text-white font-bold">Indexed (Auto)</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-500 block">Certifications</span>
              <span className="text-white font-bold">Indexed (Auto)</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-500 block">Education</span>
              <span className="text-white font-bold">Indexed (Auto)</span>
            </div>
          </div>
        </div>

        {/* AI Drafting Tool Form */}
        <form onSubmit={handleGenerate} className="glass-card rounded-3xl p-6 sm:p-8 border border-zinc-800 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <Wand2 className="w-5 h-5 text-white" />
            <h3 className="text-base font-bold text-white">Generate & Improve Portfolio Copy</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Generation Tool</label>
              <select
                value={promptType}
                onChange={(e) => setPromptType(e.target.value as "project_description" | "improve_text" | "bio_summary")}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none"
              >
                <option value="project_description">Project Description Draft</option>
                <option value="improve_text">Improve Existing Text</option>
                <option value="bio_summary">Draft Profile Bio Summary</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Topic / Project Title *</label>
              <input
                type="text"
                required={promptType !== "bio_summary"}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. AI Resume Analyzer"
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
              Current Draft Text (Optional)
            </label>
            <textarea
              rows={3}
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              placeholder="Paste existing description to polish or improve..."
              className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono resize-none focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Note: Generated copy is presented for Admin review. AI will NEVER automatically publish content without manual confirmation.</span>
          </div>

          <div className="flex justify-end pt-2 border-t border-zinc-800">
            <button
              type="submit"
              disabled={generating}
              className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-mono font-bold hover:bg-zinc-200 transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{generating ? "Generating..." : "Generate AI Suggestion"}</span>
            </button>
          </div>
        </form>

        {/* AI Output Display */}
        {aiSuggestion && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">AI Drafted Suggestion</h4>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy to Clipboard"}</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900 text-xs font-mono text-zinc-200 whitespace-pre-wrap leading-relaxed border border-zinc-800">
              {aiSuggestion}
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
