import { useMemo, useState } from "react";
import { Loader2, Sparkles, ArrowRight } from "lucide-react";
import { buildContract, DEMO_PROMPTS } from "@/lib/warrant-contract";
import { ContractCard } from "./ContractCard";

export function DemoFlow() {
  const [request, setRequest] = useState(DEMO_PROMPTS[0]);
  const [submitted, setSubmitted] = useState<string | null>(DEMO_PROMPTS[0]);
  const [loading, setLoading] = useState(false);

  const contract = useMemo(() => (submitted ? buildContract(submitted) : null), [submitted]);

  const run = () => {
    if (!request.trim()) return;
    setLoading(true);
    setSubmitted(null);
    setTimeout(() => {
      setSubmitted(request);
      setLoading(false);
    }, 650);
  };

  return (
    <div id="demo" className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-8">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">
          <Sparkles className="h-3.5 w-3.5 text-[#4F7DFF]" />
          Live Demo
        </div>
        <h3 className="mt-2 text-xl font-semibold tracking-tight">
          Paste a purchase request
        </h3>
        <p className="mt-1 text-sm text-white/55">
          Warrant will convert your intent into a machine-checkable contract and
          test it against a candidate offer.
        </p>

        <textarea
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          rows={5}
          spellCheck={false}
          className="mt-5 w-full resize-none rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-[13px] leading-relaxed text-white/90 outline-none transition focus:border-[#4F7DFF]/60 focus:ring-2 focus:ring-[#4F7DFF]/25"
          placeholder='e.g. "Buy a new 27" monitor from Amazon under ₹30,000, delivered by tomorrow, seller rating 4.6+, 30-day returns."'
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {DEMO_PROMPTS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRequest(p)}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-white/60 transition hover:border-white/25 hover:text-white/90"
            >
              Example {i + 1}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4F7DFF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6a92ff] disabled:opacity-70 glow-electric"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Compiling contract…
            </>
          ) : (
            <>
              Generate Purchase Contract <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <div className="mt-4 font-mono text-[11px] text-white/35">
          Candidate offer (fixture): ₹28,499 · 27" · new · 1-day delivery · 4.7★ · amazon · 30d returns
        </div>
      </div>

      <div className="relative">
        {loading || !contract ? (
          <div className="glass flex h-full min-h-[340px] items-center justify-center rounded-2xl p-6 text-white/40">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="font-mono text-sm">Parsing intent…</span>
          </div>
        ) : (
          <div key={submitted} className="animate-rise">
            <ContractCard contract={contract} />
          </div>
        )}
      </div>
    </div>
  );
}
