"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Terminal, Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email or password. Only authorized administrators can log in.");
      } else {
        setError(err.message || "Failed to authenticate. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 selection:bg-white selection:text-black">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center mx-auto shadow-md">
            <Terminal className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Portfolio Admin Login</h1>
          <p className="text-xs font-mono text-zinc-400">
            Authorized administrator access console.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
              Admin Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-white text-black font-bold text-sm shadow-md hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : "Sign In to Admin Dashboard"}
          </button>
        </form>

        {/* Return to Public Website */}
        <div className="pt-4 border-t border-zinc-800 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Portfolio</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
