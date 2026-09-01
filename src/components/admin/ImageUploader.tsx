"use client";

import React, { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: "images" | "certifications" | "projects" | "profile";
  label?: string;
}

export function ImageUploader({
  value,
  onChange,
  folder = "images",
  label = "Upload Image (JPEG, PNG, WebP)",
}: ImageUploaderProps) {
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
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to upload image to Cloudinary.");
      }

      setProgress(100);
      onChange(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-mono font-semibold text-zinc-300">
        {label}
      </label>

      {value ? (
        <div className="relative group w-full max-w-xs h-44 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
          <Image
            src={value}
            alt="Uploaded preview"
            fill
            sizes="300px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <label className="px-3 py-1.5 rounded-xl bg-white text-black text-xs font-mono font-bold cursor-pointer hover:bg-zinc-200 transition-colors">
              Replace
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </label>

            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-zinc-800 hover:border-zinc-500 rounded-2xl bg-zinc-950/60 cursor-pointer transition-colors p-4 text-center">
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
              <span className="text-xs font-mono text-zinc-400">Uploading to Cloudinary {progress}%...</span>
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
                Click to upload to Cloudinary
              </span>
              <span className="text-[10px] font-mono text-zinc-500 mt-1">
                Supports JPG, PNG, WebP (Max 10MB)
              </span>
            </>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
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
