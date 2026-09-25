"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error || "Login failed");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-alt p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border-2 border-ink-strong bg-white p-8 shadow-card"
      >
        <h1 className="text-2xl font-extrabold text-ink-strong">Admin login</h1>
        <p className="mt-1 text-sm text-muted">Enter the admin password to view orders.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-6 w-full rounded-xl border-2 border-ink-strong bg-white px-4 py-3 text-base focus:outline-none focus:ring-4 focus:ring-[#C9B6FF]"
          placeholder="Password"
          autoFocus
        />
        {error && (
          <p className="mt-3 rounded-lg border-2 border-ink-strong bg-[#FFE0E0] px-3 py-2 text-sm text-ink-strong">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="mt-4 w-full rounded-pill bg-ink-strong px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
