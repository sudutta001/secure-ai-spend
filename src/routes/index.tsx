import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, FileText } from "lucide-react";
import { GridBackdrop } from "@/components/warrant/GridBackdrop";
import { ContractCard } from "@/components/warrant/ContractCard";
import { Nav } from "@/components/warrant/Nav";
import { DemoFlow } from "@/components/warrant/DemoFlow";
import {
  ProblemSection,
  HowItWorks,
  Pricing,
  FAQSection,
  CTA,
} from "@/components/warrant/Sections";
import { buildContract } from "@/lib/warrant-contract";

export const Route = createFileRoute("/")({
  component: Landing,
});

const HERO_CONTRACT = buildContract(
  'Buy a new 27" monitor from Amazon under ₹30,000, delivered by tomorrow, seller rating 4.6+, 30-day returns.',
);

function Landing() {
  return (
    <div id="top" className="relative min-h-screen bg-[#090909] text-white">
      <Nav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <GridBackdrop />
        <div className="relative mx-auto grid max-w-6xl gap-14 px-6 pb-24 pt-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:pb-32 lg:pt-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4F7DFF] shadow-[0_0_10px_#4F7DFF] animate-pulse-glow" />
              AI trust layer for autonomous purchasing
            </div>

            <h1 className="mt-6 text-[64px] font-semibold leading-[0.95] tracking-tight sm:text-[84px]">
              <span className="text-gradient">Warrant</span>
            </h1>
            <p className="mt-4 max-w-xl text-[19px] font-medium leading-snug text-white/85 sm:text-[22px]">
              An agent that cannot buy the wrong thing.
            </p>
            <div className="mt-6 max-w-xl space-y-4 text-[15px] leading-relaxed text-white/55">
              <p>
                Every AI shopping agent optimizes for completing the task.
                Warrant optimizes for respecting your intent.
              </p>
              <p>
                Before a single dollar is spent, Warrant turns your request into
                a machine-checkable purchase contract. If the agent can't prove
                every condition is satisfied, it doesn't buy.
              </p>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
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
                <FileText className="h-4 w-4" /> View Purchase Contract
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-widest text-white/35">
              <span>Fails closed</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>Audit-logged</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>SOC 2 ready</span>
            </div>
          </div>

          <div className="relative">
            <ContractCard contract={HERO_CONTRACT} floating />
          </div>
        </div>
      </section>

      <ProblemSection />

      <HowItWorks />

      {/* Demo */}
      <section className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 max-w-2xl">
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#4F7DFF]">
            Live demo
          </div>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Try it on your own <span className="text-gradient">request.</span>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-white/60">
            Type or paste a purchase request. Warrant will compile it into a
            purchase contract and show you exactly which conditions the agent
            can — and cannot — prove.
          </p>
        </div>
        <DemoFlow />
      </section>

      <Pricing />
      <FAQSection />
      <CTA />
    </div>
  );
}
