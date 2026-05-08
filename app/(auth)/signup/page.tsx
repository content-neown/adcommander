"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [done, setDone]         = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name }, emailRedirectTo: `${location.origin}/auth/callback` },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setDone(true);
    setLoading(false);
  }

  if (done) return (
    <div className="card-dark p-8 text-center animate-fade-in">
      <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
      <h2 className="text-xl font-semibold mb-2">Check your email</h2>
      <p className="text-slate-400 text-sm">We sent a confirmation link to <strong className="text-white">{email}</strong>. Click it to activate your account.</p>
    </div>
  );

  return (
    <div className="card-dark p-8 animate-fade-in">
      <h1 className="text-2xl font-semibold mb-1">Create workspace</h1>
      <p className="text-slate-400 text-sm mb-8">Start building smarter Meta campaigns with AI</p>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Full name</label>
          <input type="text" className="input-dark" placeholder="Alex Chen" value={name}
            onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Work email</label>
          <input type="email" className="input-dark" placeholder="you@company.com" value={email}
            onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
          <input type="password" className="input-dark" placeholder="Min 8 characters" value={password}
            onChange={e => setPassword(e.target.value)} required minLength={8} />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2.5">
            <AlertCircle size={15} className="shrink-0" /> {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
          {loading ? <><Loader2 size={15} className="animate-spin" /> Creating account...</> : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
      </p>
    </div>
  );
}
