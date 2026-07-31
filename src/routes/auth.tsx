import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useSession } from "@/hooks/use-session";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Warrant" },
      {
        name: "description",
        content:
          "Sign in to Warrant to save your purchase contracts and review every PASS/FAIL verification across your devices.",
      },
      { property: "og:title", content: "Sign in — Warrant" },
      {
        property: "og:description",
        content: "Access your Warrant account and your saved purchase contracts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (session) void navigate({ to: "/", replace: true });
  }, [session, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (err) throw err;
        if (!data.session) {
          setNotice("Check your email to confirm your account, then sign in.");
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError(result.error.message ?? "Google sign-in failed.");
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#090909] px-6 py-16 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#4F7DFF]/12 blur-[140px]"
      />

      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-[12px] text-white/45 transition hover:text-white/80"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Warrant
        </Link>

        <div className="glass rounded-2xl p-7">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">
            <ShieldCheck className="h-3.5 w-3.5 text-[#4F7DFF]" />
            {mode === "signin" ? "Sign in" : "Create account"}
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            {mode === "signin" ? "Welcome back." : "Start issuing contracts."}
          </h1>
          <p className="mt-1.5 text-sm text-white/55">
            Your purchase contracts and PASS/FAIL history sync to your account.
          </p>

          <button
            type="button"
            onClick={() => void onGoogle()}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/85 transition hover:border-white/30 hover:text-white"
          >
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/25">
            <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            {mode === "signup" && (
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display name"
                autoComplete="name"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/90 outline-none transition placeholder:text-white/30 focus:border-[#4F7DFF]/60 focus:ring-2 focus:ring-[#4F7DFF]/25"
              />
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/90 outline-none transition placeholder:text-white/30 focus:border-[#4F7DFF]/60 focus:ring-2 focus:ring-[#4F7DFF]/25"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/90 outline-none transition placeholder:text-white/30 focus:border-[#4F7DFF]/60 focus:ring-2 focus:ring-[#4F7DFF]/25"
            />

            <button
              type="submit"
              disabled={loading}
              className="glow-electric inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4F7DFF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6a92ff] disabled:opacity-70"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          {error && (
            <div className="mt-3 rounded-lg border border-[oklch(0.72_0.22_25/0.3)] bg-[oklch(0.72_0.22_25/0.08)] p-3 text-[12px] text-white/80">
              {error}
            </div>
          )}
          {notice && (
            <div className="mt-3 rounded-lg border border-[#4F7DFF]/30 bg-[#4F7DFF]/10 p-3 text-[12px] text-white/80">
              {notice}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setNotice(null);
            }}
            className="mt-5 w-full text-center text-[12.5px] text-white/45 transition hover:text-white/80"
          >
            {mode === "signin"
              ? "No account yet? Create one"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </main>
  );
}
