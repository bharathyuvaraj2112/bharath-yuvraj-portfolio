"use client";

import React, { useState } from "react";
import { FileText, Upload, X, ExternalLink, Loader2, Link as LinkIcon, Edit3 } from "lucide-react";

interface ResumeUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export function ResumeUploader({ value, onChange }: ResumeUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [manualUrl, setManualUrl] = useState(value || "");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setProgress(30);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "resumes");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to upload resume document.");
      }

      setProgress(100);
      onChange(data.url);
      setManualUrl(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to upload resume PDF.");
    } finally {
      setUploading(false);
    }
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    onChange(manualUrl.trim());
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-mono font-semibold text-zinc-300">
          Resume Document & URL
        </label>
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              mode === "upload"
                ? "bg-zinc-800 text-white font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            PDF Upload
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("url");
              setManualUrl(value || "");
            }}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              mode === "url"
                ? "bg-zinc-800 text-white font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Direct Link
          </button>
        </div>
      </div>

      {value ? (
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2.5 rounded-xl bg-zinc-800 text-emerald-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-mono font-bold text-white">Active Resume Attached</p>
                <p className="text-[11px] font-mono text-zinc-400 truncate max-w-xs sm:max-w-md">
                  {value}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-200 text-xs font-mono font-semibold hover:bg-zinc-700 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test Link</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setManualUrl("");
                }}
                className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors"
                title="Remove resume"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Edit/Replace inside active state */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
            <label className="text-zinc-400 hover:text-white cursor-pointer underline flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" />
              <span>Replace PDF file</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </label>

            <button
              type="button"
              onClick={() => {
                setMode("url");
                setManualUrl(value);
              }}
              className="text-zinc-400 hover:text-white underline flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit URL manually</span>
            </button>
          </div>
        </div>
      ) : mode === "upload" ? (
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-zinc-800 hover:border-zinc-500 rounded-2xl bg-zinc-950/60 cursor-pointer transition-colors p-4 text-center">
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
              <span className="text-xs font-mono text-zinc-400">Uploading PDF {progress}%...</span>
              <div className="w-44 h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-white transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-2xl bg-zinc-900 text-zinc-300 mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-zinc-300 font-semibold">
                Click to upload PDF resume document
              </span>
              <span className="text-[10px] font-mono text-zinc-500 mt-1">
                PDF format (Max 10MB)
              </span>
            </>
          )}

          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      ) : (
        <form onSubmit={handleManualUrlSubmit} className="space-y-3 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-mono font-semibold text-zinc-300">
              Paste Resume Direct URL / Cloud Link
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="url"
              required
              placeholder="https://drive.google.com/... or https://domain.com/resume.pdf"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-zinc-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-white text-black text-xs font-mono font-bold hover:bg-zinc-200 transition-colors"
            >
              Set Resume URL
            </button>
          </div>
          <p className="text-[10px] font-mono text-zinc-500">
            Enter any valid public PDF or document URL (Google Drive share link, GitHub raw URL, Cloudinary link, etc.).
          </p>
        </form>
      )}

      {error && (
        <p className="text-xs font-mono text-rose-400">{error}</p>
      )}
    </div>
  );
}
