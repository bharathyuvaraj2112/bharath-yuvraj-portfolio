"use client";

import { useState, useEffect } from "react";
import { Search, Sparkles, X, ArrowRight, FolderGit2, Wrench, Award, Trophy, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResultItem {
  id: string;
  type: string;
  title: string;
  content: string;
  source: string;
  score: number;
  metadata?: Record<string, unknown>;
}

export function SemanticSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const displayedResults = query.trim() ? results : [];

  const getItemIcon = (type: string) => {
    switch (type) {
      case "project": return <FolderGit2 className="w-4 h-4 text-emerald-400" />;
      case "skill": return <Wrench className="w-4 h-4 text-cyan-400" />;
      case "certification": return <Award className="w-4 h-4 text-amber-400" />;
      case "achievement": return <Trophy className="w-4 h-4 text-purple-400" />;
      case "education": return <GraduationCap className="w-4 h-4 text-indigo-400" />;
      default: return <Sparkles className="w-4 h-4 text-white" />;
    }
  };

  return (
    <>
      {/* Trigger Button inside Navbar or Hero */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 hover:border-zinc-500 text-xs font-mono text-zinc-400 hover:text-white transition-all shadow-sm"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Semantic Search...</span>
        <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[9px] font-mono text-zinc-400 border border-zinc-700">⌘K</span>
      </button>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10 space-y-0"
            >
              {/* Search Input Bar */}
              <div className="flex items-center p-4 border-b border-zinc-800 bg-zinc-900/60">
                <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search portfolio with AI (e.g. 'embedded accident safety project' or 'machine learning skills')..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent text-white text-sm font-mono focus:outline-none placeholder:text-zinc-500"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="p-1 text-zinc-500 hover:text-white mr-2">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="px-3 py-1 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white text-xs font-mono">
                  Esc
                </button>
              </div>

              {/* Results Area */}
              <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                {loading ? (
                  <div className="py-8 text-center text-xs font-mono text-zinc-500 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin text-white" />
                    <span>Searching vectors...</span>
                  </div>
                ) : query && displayedResults.length === 0 ? (
                  <div className="py-8 text-center text-xs font-mono text-zinc-500">
                    No matching portfolio documents found for &quot;{query}&quot;.
                  </div>
                ) : !query ? (
                  <div className="py-6 text-center text-xs font-mono text-zinc-500">
                    Try searching: <span className="text-zinc-300">&quot;accident detection&quot;</span>, <span className="text-zinc-300">&quot;Python ML&quot;</span>, <span className="text-zinc-300">&quot;full-stack&quot;</span>, or <span className="text-zinc-300">&quot;certifications&quot;</span>.
                  </div>
                ) : (
                  displayedResults.map((res) => (
                    <div
                      key={res.id}
                      className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-600 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700">
                            {getItemIcon(res.type)}
                          </div>
                          <span className="text-xs font-bold text-white">{res.title}</span>
                          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono uppercase">
                            {res.type}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                          {(res.score * 100).toFixed(0)}% Match
                        </span>
                      </div>

                      <p className="text-xs font-mono text-zinc-400 leading-relaxed line-clamp-2">
                        {res.content}
                      </p>

                      {res.type === "project" && (
                        <div className="pt-2 flex items-center justify-end gap-3 text-xs font-mono">
                          <a
                            href="#projects"
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:underline flex items-center gap-1"
                          >
                            <span>View Section</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
