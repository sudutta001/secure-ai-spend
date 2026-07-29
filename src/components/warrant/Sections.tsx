import {
  FileCheck2,
  ScanSearch,
  ShieldCheck,
  Ban,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function ProblemSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#4F7DFF]">
            The problem
          </div>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            AI doesn't steal your money.
            <br />
            <span className="text-gradient">It misunderstands your intent.</span>
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/60">
            Current AI agents quietly loosen constraints to complete tasks.
            The task feels done. The receipt says otherwise.
          </p>
        </div>

        <div className="glass rounded-2xl p-6 font-mono text-[13px] leading-relaxed">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.22_25)]" />
            Transcript · unconstrained agent
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <span className="text-white/40">assistant › </span>
              <span className="text-white/85">
                Ordered a 27" monitor. Total: ₹34,500.
              </span>
            </div>
            <div>
              <span className="text-white/40">you › </span>
              <span className="text-white/85">I said under ₹30,000.</span>
            </div>
            <div>
              <span className="text-white/40">assistant › </span>
              <span className="text-white/60">
                The best-rated option was slightly over budget.
              </span>
            </div>
            <div className="mt-3 rounded-lg border border-[oklch(0.72_0.22_25/0.25)] bg-[oklch(0.72_0.22_25/0.06)] p-3 text-[12px] text-white/75">
              The constraint was optional to the model. It was mandatory to you.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    icon: ScanSearch,
    title: "Parse intent",
    body: "Warrant reads the user's request — natural language, structured JSON, or an upstream agent handoff — and extracts every constraint.",
    tag: "Step 01",
  },
  {
    icon: FileCheck2,
    title: "Compile a purchase contract",
    body: "Constraints are compiled into a signed, machine-checkable contract: budget caps, product attributes, delivery, marketplaces, seller trust, returns.",
    tag: "Step 02",
  },
  {
    icon: ShieldCheck,
    title: "Enforce at the checkout boundary",
    body: "Before payment authorization, each condition is verified against the actual offer. Every clause must return true — or the buy is blocked.",
    tag: "Step 03",
  },
  {
    icon: Ban,
    title: "Halt on non-compliance",
    body: "If a single condition fails, Warrant halts the agent, returns the failing clause, and asks the user — never silently loosens the constraint.",
    tag: "Step 04",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="max-w-2xl">
        <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#4F7DFF]">
          How it works
        </div>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Intent, compiled into a{" "}
          <span className="text-gradient">purchase contract.</span>
        </h2>
        <p className="mt-5 text-[15px] leading-relaxed text-white/60">
          Warrant sits between your AI agent and the payment surface. Nothing
          gets bought unless the contract's conditions all evaluate to{" "}
          <span className="font-mono text-white/85">true</span>.
        </p>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition hover:border-white/20 hover:bg-white/[0.035]"
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition duration-500 group-hover:opacity-100"
              style={{ background: "radial-gradient(closest-side, #4F7DFF55, transparent)" }}
            />
            <div className="flex items-center justify-between">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#4F7DFF]/12 ring-1 ring-[#4F7DFF]/35">
                <s.icon className="h-4 w-4 text-[#4F7DFF]" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-white/35">
                {s.tag}
              </span>
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">
              {s.title}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-white/55">{s.body}</p>
            {i === 1 && (
              <pre className="mt-5 overflow-x-auto rounded-lg border border-white/8 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-white/70">
{`contract wrnt.v1 {
  price          <= 30000 INR;
  attr.size      == 27";
  attr.condition == "new";
  delivery.eta   <= 1d;
  seller.rating  >= 4.6;
  marketplace    in { amazon };
  policy.returns >= 30d;
}`}
              </pre>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

const TIERS = [
  {
    name: "Starter",
    price: "$0",
    cadence: "/ mo",
    tagline: "For solo builders adding trust to a single agent.",
    features: [
      "500 contracts / month",
      "Up to 8 clauses per contract",
      "Amazon + Flipkart marketplaces",
      "Web dashboard & audit log",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Team",
    price: "$149",
    cadence: "/ mo",
    tagline: "For product teams shipping autonomous purchasing to real users.",
    features: [
      "25,000 contracts / month",
      "Unlimited clauses & custom types",
      "All supported marketplaces",
      "Policy templates & approvals",
      "Slack & webhook halts",
    ],
    cta: "Start a demo",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    tagline: "For companies moving procurement to autonomous agents.",
    features: [
      "Unlimited contracts",
      "SOC 2 · SSO · Audit exports",
      "Private marketplace connectors",
      "Dedicated review workflows",
      "24/7 incident response",
    ],
    cta: "Talk to sales",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="max-w-2xl">
        <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#4F7DFF]">
          Pricing
        </div>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Priced per <span className="text-gradient">signed contract.</span>
        </h2>
        <p className="mt-5 text-[15px] leading-relaxed text-white/60">
          You only pay for contracts Warrant authorizes. Halted, non-compliant
          buys are free.
        </p>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className={
              t.featured
                ? "relative overflow-hidden rounded-2xl border border-[#4F7DFF]/40 bg-gradient-to-b from-[#4F7DFF]/10 to-white/[0.02] p-7 glow-electric"
                : "relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-7"
            }
          >
            {t.featured && (
              <div className="absolute right-4 top-4 rounded-full bg-[#4F7DFF]/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#9fb6ff] ring-1 ring-[#4F7DFF]/40">
                Most popular
              </div>
            )}
            <div className="text-sm font-medium text-white/70">{t.name}</div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight">{t.price}</span>
              <span className="text-sm text-white/45">{t.cadence}</span>
            </div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">
              {t.tagline}
            </p>

            <ul className="mt-6 space-y-3">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-white/75">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#4F7DFF]" strokeWidth={3} />
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="#demo"
              className={
                t.featured
                  ? "mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4F7DFF] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6a92ff]"
                  : "mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white/85 transition hover:border-white/25 hover:text-white"
              }
            >
              {t.cta} <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

const FAQ = [
  {
    q: "What exactly is a purchase contract?",
    a: "A purchase contract is a signed, machine-checkable specification of the user's intent. Each clause is a typed predicate — a budget cap, a product attribute, a delivery deadline, a marketplace allow-list, a policy requirement — that must evaluate to true against a candidate offer before Warrant authorizes payment.",
  },
  {
    q: "How are constraints checked before a buy?",
    a: "Warrant intercepts the transaction at the checkout boundary. For every clause, it pulls the corresponding fact from the offer (price, size, seller rating, ETA, return window, marketplace ID) and evaluates the predicate. All clauses must pass; unknown facts fail closed.",
  },
  {
    q: "Which marketplaces do you support?",
    a: "Amazon, Flipkart, Best Buy, eBay, Walmart, and Target are supported today via first-party connectors. Enterprise plans can bring their own procurement systems and internal catalogs via a signed connector spec.",
  },
  {
    q: "What happens when a condition fails?",
    a: "The agent halts. No payment method is charged, no order is placed, and Warrant returns the failing clause with the observed value. The user is notified — via the app, Slack, or a webhook — and asked whether to relax the clause, pick a different offer, or cancel. Warrant never silently loosens a constraint.",
  },
  {
    q: "Can the agent override a contract?",
    a: "No. Contracts are immutable once signed. To buy under different constraints, a new contract must be issued and countersigned by the user. Every attempt — pass or fail — is written to an append-only audit log.",
  },
  {
    q: "Does this slow the agent down?",
    a: "Contract compilation and verification typically add 40–120ms per attempt. For any purchase above trivial value, that latency is a rounding error against the cost of an incorrect buy.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="relative mx-auto max-w-4xl px-6 py-28">
      <div className="text-center">
        <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#4F7DFF]">
          FAQ
        </div>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Questions, answered.
        </h2>
      </div>

      <div className="mt-14 divide-y divide-white/8 rounded-2xl border border-white/8 bg-white/[0.02]">
        {FAQ.map((item, i) => (
          <details
            key={i}
            className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-6 text-left text-[15px] font-medium text-white/90">
              {item.q}
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/50 transition group-open:rotate-45 group-open:border-[#4F7DFF]/50 group-open:text-[#4F7DFF]">
                +
              </span>
            </summary>
            <p className="mt-3 pr-10 text-[14.5px] leading-relaxed text-white/60">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-32">
      <div className="glass-strong relative overflow-hidden rounded-3xl p-12 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(79,125,255,0.28), transparent 60%)",
          }}
        />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
            <Sparkles className="h-3 w-3 text-[#4F7DFF]" />
            Ship agents that respect intent
          </div>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            The agent that <span className="text-gradient">cannot buy the wrong thing.</span>
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-xl bg-[#4F7DFF] px-5 py-3 text-sm font-semibold text-white glow-electric transition hover:bg-[#6a92ff]"
            >
              See Live Demo <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/85 transition hover:border-white/30 hover:text-white"
            >
              Read the spec
            </a>
          </div>
        </div>
      </div>

      <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 text-[12px] text-white/40">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4F7DFF] shadow-[0_0_10px_#4F7DFF]" />
          Warrant · The AI trust layer for autonomous purchasing
        </div>
        <div className="font-mono text-white/30">© 2026 Warrant Labs</div>
      </footer>
    </section>
  );
}
