"use client";

import { useState } from "react";
import { FileText, Sparkles, X, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ResumeAnalyzerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setError(null);
    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch("/api/ai/resume-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setAnalysisResult(data.analysis);
      }
    } catch {
      setError("Failed to process resume analysis. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-500 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
      >
        <FileText className="w-3.5 h-3.5 text-zinc-400" />
        <span>AI Resume Matcher</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-white text-black font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">AI Resume & Job Alignment Tool</h3>
                    <p className="text-xs font-mono text-zinc-400">
                      Evaluate technical stack alignment & ATS clarity
                    </p>
                  </div>
                </div>

                <button onClick={() => setIsOpen(false)} className="p-1 text-zinc-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Privacy Security Callout */}
              <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Strict Privacy Guarantee: Uploaded text is processed in memory on the server and is NEVER stored in database.</span>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
                  Paste Resume or Job Description Text (Max 10,000 chars)
                </label>
                <textarea
                  rows={6}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste resume content or job requirements here to analyze technical alignment with Bharath's portfolio..."
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-zinc-600 resize-none"
                />
              </div>

              {error && (
                <p className="text-xs font-mono text-rose-400">{error}</p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setResumeText("");
                    setAnalysisResult(null);
                    setError(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-mono"
                >
                  Clear Text
                </button>

                <button
                  onClick={handleAnalyze}
                  disabled={!resumeText.trim() || analyzing}
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-mono font-bold text-xs hover:bg-zinc-200 transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{analyzing ? "Analyzing Text..." : "Generate AI Assessment"}</span>
                </button>
              </div>

              {/* Analysis Results Display */}
              {analysisResult && (
                <div className="pt-6 border-t border-zinc-800 space-y-4">
                  <h4 className="text-sm font-mono font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>AI Evaluation Report:</span>
                  </h4>

                  <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-200 whitespace-pre-wrap leading-relaxed">
                    {analysisResult}
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
