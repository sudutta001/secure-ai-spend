import { Check, X, HelpCircle, ShieldCheck, ShieldAlert } from "lucide-react";
import type { PurchaseContract } from "@/lib/warrant-contract";

const STATUS_ICON = {
  pass: Check,
  fail: X,
  unknown: HelpCircle,
};

const STATUS_STYLES = {
  pass: "text-[oklch(0.82_0.16_155)] bg-[oklch(0.82_0.16_155/0.1)] ring-[oklch(0.82_0.16_155/0.25)]",
  fail: "text-[oklch(0.72_0.22_25)] bg-[oklch(0.72_0.22_25/0.1)] ring-[oklch(0.72_0.22_25/0.3)]",
  unknown: "text-white/70 bg-white/5 ring-white/15",
};

export function ContractCard({
  contract,
  compact = false,
  floating = false,
}: {
  contract: PurchaseContract;
  compact?: boolean;
  floating?: boolean;
}) {
  const signed = contract.signed;

  return (
    <div className={floating ? "animate-float" : undefined}>
      <div className="glass-strong rounded-2xl p-6 font-mono text-[13px] leading-relaxed">
        <div className="flex items-center justify-between border-b border-white/8 pb-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#4F7DFF] shadow-[0_0_12px_#4F7DFF]" />
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
              Purchase Contract
            </span>
          </div>
          <span className="font-sans text-[10px] uppercase tracking-widest text-white/40">
            wrnt-{Math.abs(hash(contract.intent)).toString(16).slice(0, 6)}
          </span>
        </div>

        {!compact && (
          <div className="mt-4 space-y-1">
            <div className="text-white/40 text-[11px] uppercase tracking-wider font-sans">Item</div>
            <div className="truncate text-white/90">{contract.item}</div>
          </div>
        )}

        <ul className="mt-5 space-y-2.5">
          {contract.conditions.map((c) => {
            const Icon = STATUS_ICON[c.status];
            return (
              <li key={c.id} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-1 ${STATUS_STYLES[c.status]}`}
                >
                  <Icon className="h-3 w-3" strokeWidth={3} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-white/90">{c.expression}</span>
                    <span className="font-sans text-[10px] uppercase tracking-widest text-white/35">
                      {c.label}
                    </span>
                  </div>
                  {!compact && c.detail && (
                    <div className="mt-0.5 text-[12px] text-white/45">{c.detail}</div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4">
          <div className="flex items-center gap-2">
            {signed ? (
              <ShieldCheck className="h-4 w-4 text-[#4F7DFF]" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-[oklch(0.72_0.22_25)]" />
            )}
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
              Status
            </span>
          </div>
          <span
            className={
              signed
                ? "rounded-full bg-[#4F7DFF]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#4F7DFF] ring-1 ring-[#4F7DFF]/40"
                : "rounded-full bg-[oklch(0.72_0.22_25/0.1)] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.78_0.22_25)] ring-1 ring-[oklch(0.72_0.22_25/0.35)]"
            }
          >
            {signed ? "Contract Signed" : "Not Authorized"}
          </span>
        </div>

        {!signed && contract.blockedReasons.length > 0 && (
          <div className="mt-4 rounded-lg border border-[oklch(0.72_0.22_25/0.25)] bg-[oklch(0.72_0.22_25/0.06)] p-3 font-sans text-[12px] text-white/75">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[oklch(0.82_0.2_25)]">
              Agent Halted
            </div>
            <ul className="list-disc space-y-1 pl-4 text-white/70">
              {contract.blockedReasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h || 1;
}
