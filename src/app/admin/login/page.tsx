"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth";
import { CupIcon } from "@/components/CupIcon";

export default function AdminLoginPage() {
  const router = useRouter();
  const { refresh } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await api.staffLogin(email, password);
      await refresh();
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't log in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
        <div className="flex items-center justify-center gap-1.5">
          <CupIcon className="h-8 w-8 text-espresso" />
          <span className="font-display text-lg font-bold text-espresso">Koffee Lounge</span>
        </div>
        <h1 className="mt-4 text-center font-display text-xl font-extrabold text-espresso">
          Staff Sign In
        </h1>
        <p className="mt-1 text-center text-sm text-espresso/50">
          For staff use only — manage orders and inquiries here.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-espresso/80">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-espresso/15 bg-cream px-3 py-2.5 text-sm text-espresso focus:border-amber focus:outline-none"
              placeholder="you@koffeelounge.test"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-espresso/80">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-espresso/15 bg-cream px-3 py-2.5 text-sm text-espresso focus:border-amber focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-amber px-4 py-2.5 font-display text-sm font-bold text-espresso-deep disabled:opacity-60"
          >
            {isSubmitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
