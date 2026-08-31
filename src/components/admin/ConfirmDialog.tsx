"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isDeleting = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl z-10"
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2.5 text-rose-400 font-mono text-xs font-bold uppercase">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>{title}</span>
            </div>
            <button
              onClick={onCancel}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-5">
            <p className="text-sm text-zinc-300 leading-relaxed">{message}</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-300 text-xs font-mono font-semibold hover:bg-zinc-900 transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-semibold shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? "Deleting..." : confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
