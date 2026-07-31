import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Loader2, Sparkles, ArrowRight, Download, History, Trash2, Wrench, ShieldOff } from "lucide-react";
import { DEMO_PROMPTS, type PurchaseContract } from "@/lib/warrant-contract";
import { verifyPurchaseRequest } from "@/lib/contract.functions";
import { downloadContractPdf } from "@/lib/contract-pdf";
import { useContractHistory } from "@/lib/use-contract-history";
import { useSession } from "@/hooks/use-session";
import { ContractCard } from "./ContractCard";

export function DemoFlow() {
  const [request, setRequest] = useState(DEMO_PROMPTS[0]);
  const [contract, setContract] = useState<PurchaseContract | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const verify = useServerFn(verifyPurchaseRequest);
  const { user } = useSession();
  const { history, save, remove, clear } = useContractHistory(Boolean(user));


  const run = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      setLoading(true);
      setError(null);
      setContract(null);
      try {
        const result = await verify({ data: { request: text } });
        setContract(result);
        save(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Verification failed. Try again.");
      } finally {
        setLoading(false);
      }
    },
    [verify, save],
  );

  useEffect(() => {
    void run(DEMO_PROMPTS[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const failed = useMemo(
    () => (contract ? contract.conditions.filter((c) => c.status !== "pass") : []),
    [contract],
  );

  return (
    <div id="demo" className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-8">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">
            <Sparkles className="h-3.5 w-3.5 text-[#4F7DFF]" />
            Live Demo · server-verified
          </div>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">Paste a purchase request</h3>
          <p className="mt-1 text-sm text-white/55">
            Warrant compiles your intent into a machine-checkable contract, then verifies every
            clause on the server — the verdict never comes from your browser.
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
            onClick={() => void run(request)}
            disabled={loading}
            className="glow-electric mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4F7DFF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6a92ff] disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Verifying on server…
              </>
            ) : (
              <>
                Generate Purchase Contract <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {error && (
            <div className="mt-3 rounded-lg border border-[oklch(0.72_0.22_25/0.3)] bg-[oklch(0.72_0.22_25/0.08)] p-3 text-[12px] text-white/80">
              {error}
            </div>
          )}

          <div className="mt-4 font-mono text-[11px] text-white/35">
            Candidate offer (fixture): ₹28,499 · 27" · new · 1-day delivery · 4.7★ · amazon · 30d returns
          </div>
        </div>

        <div className="relative space-y-4">
          {loading || !contract ? (
            <div className="glass flex h-full min-h-[340px] items-center justify-center rounded-2xl p-6 text-white/40">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span className="font-mono text-sm">Verifying clauses…</span>
            </div>
          ) : (
            <div key={contract.verificationId} className="animate-rise space-y-4">
              <ContractCard contract={contract} />

              <button
                type="button"
                onClick={() => downloadContractPdf(contract)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/85 transition hover:border-[#4F7DFF]/50 hover:text-white"
              >
                <Download className="h-4 w-4" /> Download contract as PDF
              </button>

              {failed.length > 0 && (
                <div className="glass rounded-2xl p-5">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.82_0.2_25)]">
                    <ShieldOff className="h-3.5 w-3.5" />
                    {failed.length} clause{failed.length > 1 ? "s" : ""} blocking this purchase
                  </div>
                  <ul className="mt-4 space-y-4">
                    {failed.map((c) => (
                      <li key={c.id} className="border-l-2 border-[oklch(0.72_0.22_25/0.5)] pl-4">
                        <div className="font-mono text-[13px] text-white/90">{c.expression}</div>
                        <div className="mt-0.5 text-[10px] uppercase tracking-widest text-white/40">
                          {c.label} · {c.status === "fail" ? "failed" : "unknown"}
                        </div>
                        {(c.reason ?? c.detail) && (
                          <p className="mt-2 text-[13px] leading-relaxed text-white/60">
                            {c.reason ?? c.detail}
                          </p>
                        )}
                        {c.remediation && (
                          <p className="mt-2 flex gap-2 text-[13px] leading-relaxed text-[#8fabff]">
                            <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            <span>{c.remediation}</span>
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">
              <History className="h-3.5 w-3.5 text-[#4F7DFF]" /> Saved requests · this device
            </div>
            <button
              type="button"
              onClick={clear}
              className="text-[11px] uppercase tracking-widest text-white/40 transition hover:text-white/80"
            >
              Clear all
            </button>
          </div>

          <ul className="mt-4 divide-y divide-white/8">
            {history.map((h) => (
              <li key={h.id} className="flex items-start gap-3 py-3">
                <span
                  className={`mt-1 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ring-1 ${
                    h.signed
                      ? "bg-[oklch(0.82_0.16_155/0.1)] text-[oklch(0.82_0.16_155)] ring-[oklch(0.82_0.16_155/0.3)]"
                      : "bg-[oklch(0.72_0.22_25/0.1)] text-[oklch(0.8_0.2_25)] ring-[oklch(0.72_0.22_25/0.3)]"
                  }`}
                >
                  {h.signed ? "Pass" : "Fail"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setRequest(h.request);
                    void run(h.request);
                  }}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="truncate font-mono text-[12.5px] text-white/80">{h.request}</div>
                  <div className="mt-0.5 text-[11px] text-white/40">
                    {new Date(h.verifiedAt).toLocaleString()}
                    {h.failedClauses.length > 0 && ` · blocked by ${h.failedClauses.join(", ")}`}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => remove(h.id)}
                  aria-label="Remove saved request"
                  className="mt-0.5 text-white/30 transition hover:text-white/80"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
