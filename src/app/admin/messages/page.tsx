"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getMessagesFromFirestore, markMessageStatusInFirestore, deleteMessageFromFirestore, ContactMessage } from "@/lib/firebase/messages";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { Mail, Trash2, CheckCircle, MailOpen, MailCheck, ExternalLink, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getMessagesFromFirestore();
      setMessages(data);
    } catch (e) {
      showToast("Failed to load contact messages", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleToggleReadStatus = async (msg: ContactMessage) => {
    const nextStatus = msg.status === "unread" ? "read" : "unread";
    try {
      await markMessageStatusInFirestore(msg.id, nextStatus);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: nextStatus } : m))
      );
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, status: nextStatus });
      }
      showToast(`Message marked as ${nextStatus}`, "success");
    } catch (e: any) {
      showToast("Error updating message status", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMessageFromFirestore(deleteTarget.id);
      showToast("Message deleted", "success");
      setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      if (selectedMessage?.id === deleteTarget.id) setSelectedMessage(null);
      setDeleteTarget(null);
    } catch (e: any) {
      showToast("Failed to delete message", "error");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = messages.filter((m) => {
    const matchesTab = activeTab === "all" || (activeTab === "unread" && m.status === "unread") || (activeTab === "read" && m.status !== "unread");
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()) || m.message.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              Inbox
            </span>
            <h1 className="text-3xl font-extrabold text-white">Contact Messages</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-colors ${
                activeTab === "all" ? "bg-white text-black font-bold" : "bg-zinc-900 text-zinc-400 border border-zinc-800"
              }`}
            >
              All ({messages.length})
            </button>

            <button
              onClick={() => setActiveTab("unread")}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-colors ${
                activeTab === "unread" ? "bg-rose-600 text-white font-bold" : "bg-zinc-900 text-zinc-400 border border-zinc-800"
              }`}
            >
              Unread ({messages.filter((m) => m.status === "unread").length})
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by sender name, email, or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-zinc-600"
          />
        </div>

        {/* Messages List / Table */}
        {loading ? (
          <div className="glass-card rounded-3xl p-12 text-center text-xs font-mono text-zinc-500 border border-zinc-800">
            Loading inbox messages...
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center text-xs font-mono text-zinc-500 border border-zinc-800">
            No contact messages found.
          </div>
        ) : (
          <div className="glass-card rounded-3xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  msg.status === "unread" ? "bg-zinc-900/80 font-bold" : "hover:bg-zinc-900/40 text-zinc-300"
                }`}
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (msg.status === "unread") handleToggleReadStatus(msg);
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{msg.name}</span>
                    <span className="text-xs font-mono text-zinc-500">&lt;{msg.email}&gt;</span>
                    {msg.status === "unread" && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-bold">Unread</span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-zinc-400 line-clamp-1">{msg.message}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleReadStatus(msg)}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors text-xs font-mono"
                    title={msg.status === "unread" ? "Mark as Read" : "Mark as Unread"}
                  >
                    {msg.status === "unread" ? <MailCheck className="w-4 h-4 text-emerald-400" /> : <MailOpen className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setDeleteTarget(msg)}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-rose-950 border border-zinc-800 text-zinc-500 hover:text-rose-400 transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedMessage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedMessage(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedMessage.name}</h3>
                    <p className="text-xs font-mono text-zinc-400">{selectedMessage.email}</p>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-1 text-zinc-500 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="py-2">
                  <span className="text-xs font-mono text-zinc-500 block mb-2">Message Body:</span>
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re:%20Portfolio%20Inquiry`}
                    className="px-4 py-2.5 rounded-xl bg-white text-black text-xs font-mono font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-md"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Reply via Mailto</span>
                  </a>

                  <button
                    onClick={() => handleToggleReadStatus(selectedMessage)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono"
                  >
                    Mark as {selectedMessage.status === "unread" ? "Read" : "Unread"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <ConfirmDialog
          isOpen={!!deleteTarget}
          title="Confirm Delete Message"
          message={`Are you sure you want to delete message from "${deleteTarget?.name}"?`}
          isDeleting={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />

      </div>
    </AdminLayout>
  );
}
