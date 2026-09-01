"use client";

import React, { useState } from "react";
import { FileText, Upload, X, ExternalLink, Loader2 } from "lucide-react";

interface ResumeUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export function ResumeUploader({ value, onChange }: ResumeUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
        throw new Error(data.error || "Failed to upload resume to Cloudinary.");
      }

      setProgress(100);
      onChange(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to upload resume PDF.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-mono font-semibold text-zinc-300">
        Resume Document (Cloudinary PDF Upload)
      </label>

      {value ? (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-zinc-800 text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono font-bold text-white">Cloudinary PDF Attached</p>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-zinc-400 hover:text-white underline flex items-center gap-1 mt-0.5"
              >
                <ExternalLink className="w-3 h-3" />
                <span>View Document</span>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="px-3 py-1.5 rounded-xl bg-white text-black text-xs font-mono font-bold cursor-pointer hover:bg-zinc-200 transition-colors">
              Replace PDF
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
              onClick={() => onChange("")}
              className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title="Remove resume"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-800 hover:border-zinc-500 rounded-2xl bg-zinc-950/60 cursor-pointer transition-colors p-4 text-center">
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
                Click to upload PDF resume to Cloudinary
              </span>
              <span className="text-[10px] font-mono text-zinc-500 mt-1">
                PDF format only (Max 10MB)
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
      )}

      {error && (
        <p className="text-xs font-mono text-rose-400">{error}</p>
      )}
    </div>
  );
}
