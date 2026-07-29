// Deterministic parser: turns a natural-language purchase request into a
// machine-checkable purchase contract. Runs entirely in the browser — no AI
// call needed for the demo. Every condition is either PASS, FAIL, or UNKNOWN.

export type ConditionStatus = "pass" | "fail" | "unknown";

export interface Condition {
  id: string;
  label: string;
  expression: string;
  status: ConditionStatus;
  detail?: string;
}

export interface PurchaseContract {
  intent: string;
  item: string;
  conditions: Condition[];
  signed: boolean;
  blockedReasons: string[];
}

// A pretend "candidate offer" the agent found. The demo checks the contract
// against this so users can see PASS/FAIL immediately.
interface CandidateOffer {
  price: number;
  currency: "INR" | "USD" | "EUR";
  sizeInches?: number;
  condition: "new" | "used" | "refurbished";
  deliveryDays: number;
  sellerRating: number;
  marketplace: string;
  returnWindowDays: number;
}

const DEFAULT_OFFER: CandidateOffer = {
  price: 28499,
  currency: "INR",
  sizeInches: 27,
  condition: "new",
  deliveryDays: 1,
  sellerRating: 4.7,
  marketplace: "amazon",
  returnWindowDays: 30,
};

function parseCurrency(text: string): "INR" | "USD" | "EUR" {
  if (/₹|\brs\.?\b|\binr\b|rupees?/i.test(text)) return "INR";
  if (/€|\beur\b|euros?/i.test(text)) return "EUR";
  return "USD";
}

function parseBudget(text: string): { amount: number; currency: "INR" | "USD" | "EUR" } | null {
  // Matches: under ₹30,000 / below $500 / less than 1500 EUR / max 2000
  const currency = parseCurrency(text);
  const re =
    /(?:under|below|less than|max(?:imum)?|up to|<=|<)\s*(?:₹|\$|€|rs\.?\s*|inr\s*|usd\s*|eur\s*)?([\d,]+(?:\.\d+)?)\s*(?:k|K)?/;
  const m = text.match(re);
  if (!m) {
    // fallback: any currency-prefixed number
    const alt = text.match(/(?:₹|\$|€)\s*([\d,]+(?:\.\d+)?)/);
    if (!alt) return null;
    return { amount: Number(alt[1].replace(/,/g, "")), currency };
  }
  let n = Number(m[1].replace(/,/g, ""));
  if (/k$/i.test(m[0])) n *= 1000;
  return { amount: n, currency };
}

function parseSize(text: string): number | null {
  const m = text.match(/(\d{2}(?:\.\d)?)\s*(?:"|inch|inches|in\b)/i);
  return m ? Number(m[1]) : null;
}

function parseCondition(text: string): "new" | "used" | "refurbished" | null {
  if (/\brefurb(?:ished)?\b/i.test(text)) return "refurbished";
  if (/\bused\b|\bsecond[- ]?hand\b/i.test(text)) return "used";
  if (/\bnew\b|\bbrand[- ]?new\b|\bunopened\b/i.test(text)) return "new";
  return null;
}

function parseDelivery(text: string): number | null {
  if (/\btoday\b|\bsame[- ]day\b/i.test(text)) return 0;
  if (/\btomorrow\b|\bnext[- ]day\b|\bby tomorrow\b/i.test(text)) return 1;
  const m = text.match(/(?:within|in|under|<=|<)\s*(\d+)\s*(?:day|days)/i);
  if (m) return Number(m[1]);
  const wk = text.match(/(?:within|in|under)\s*(\d+)\s*(?:week|weeks)/i);
  if (wk) return Number(wk[1]) * 7;
  return null;
}

function parseSellerRating(text: string): number | null {
  const m = text.match(/(?:rating|rated|stars?)\s*(?:>=|>|of|at least|min(?:imum)?|above)?\s*(\d(?:\.\d)?)/i);
  if (m) return Number(m[1]);
  const alt = text.match(/(\d(?:\.\d)?)\s*(?:\+|\bstars?\b|\bor higher\b)/i);
  return alt ? Number(alt[1]) : null;
}

function parseMarketplaces(text: string): string[] {
  const found: string[] = [];
  const map: Record<string, RegExp> = {
    amazon: /\bamazon\b/i,
    flipkart: /\bflipkart\b/i,
    bestbuy: /\bbest ?buy\b/i,
    ebay: /\bebay\b/i,
    walmart: /\bwalmart\b/i,
    target: /\btarget\b/i,
  };
  for (const [name, re] of Object.entries(map)) if (re.test(text)) found.push(name);
  return found;
}

function parseReturnWindow(text: string): number | null {
  const m = text.match(/(\d+)[- ]day\s*return/i);
  if (m) return Number(m[1]);
  const alt = text.match(/return(?:s)?\s*(?:window)?\s*(?:>=|>|of|at least)?\s*(\d+)\s*days?/i);
  return alt ? Number(alt[1]) : null;
}

function extractItem(text: string): string {
  // Very simple: take the first noun-ish chunk, up to a comma or ~40 chars.
  const cleaned = text
    .replace(/\bi (?:need|want|would like|am looking for)\b/i, "")
    .replace(/\bplease\b/gi, "")
    .replace(/^\s*buy\s+/i, "")
    .trim();
  const chunk = cleaned.split(/[,.\n]/)[0].slice(0, 60).trim();
  return chunk || "the requested item";
}

const CURRENCY_SYMBOL: Record<string, string> = { INR: "₹", USD: "$", EUR: "€" };

function fmt(n: number, currency: string) {
  return `${CURRENCY_SYMBOL[currency] ?? ""}${n.toLocaleString("en-US")}`;
}

export function buildContract(request: string, offer: CandidateOffer = DEFAULT_OFFER): PurchaseContract {
  const conditions: Condition[] = [];
  const blocked: string[] = [];

  const budget = parseBudget(request);
  if (budget) {
    const pass = offer.price <= budget.amount && offer.currency === budget.currency;
    conditions.push({
      id: "budget",
      label: "Budget",
      expression: `price ≤ ${fmt(budget.amount, budget.currency)}`,
      status: pass ? "pass" : "fail",
      detail: pass
        ? `Offer at ${fmt(offer.price, offer.currency)} is within budget.`
        : `Offer at ${fmt(offer.price, offer.currency)} exceeds the cap.`,
    });
    if (!pass) blocked.push(`Offer exceeds the ${fmt(budget.amount, budget.currency)} budget cap.`);
  }

  const size = parseSize(request);
  if (size !== null) {
    const pass = offer.sizeInches === size;
    conditions.push({
      id: "size",
      label: "Size",
      expression: `size = ${size}"`,
      status: pass ? "pass" : "fail",
    });
    if (!pass) blocked.push(`Offer size (${offer.sizeInches}") does not equal ${size}".`);
  }

  const cond = parseCondition(request);
  if (cond) {
    const pass = offer.condition === cond;
    conditions.push({
      id: "condition",
      label: "Condition",
      expression: `condition = ${cond}`,
      status: pass ? "pass" : "fail",
    });
    if (!pass) blocked.push(`Offer condition is "${offer.condition}", not "${cond}".`);
  }

  const del = parseDelivery(request);
  if (del !== null) {
    const pass = offer.deliveryDays <= del;
    const label = del === 0 ? "today" : del === 1 ? "tomorrow" : `${del} days`;
    conditions.push({
      id: "delivery",
      label: "Delivery",
      expression: `delivery ≤ ${label}`,
      status: pass ? "pass" : "fail",
    });
    if (!pass) blocked.push(`Offer delivery is ${offer.deliveryDays} day(s), exceeds ${label}.`);
  }

  const rating = parseSellerRating(request);
  if (rating !== null) {
    const pass = offer.sellerRating >= rating;
    conditions.push({
      id: "rating",
      label: "Seller Rating",
      expression: `rating ≥ ${rating.toFixed(1)}`,
      status: pass ? "pass" : "fail",
    });
    if (!pass) blocked.push(`Seller rating ${offer.sellerRating} is below ${rating}.`);
  }

  const mkts = parseMarketplaces(request);
  if (mkts.length) {
    const pass = mkts.includes(offer.marketplace);
    conditions.push({
      id: "marketplace",
      label: "Marketplace",
      expression: `marketplace ∈ {${mkts.join(", ")}}`,
      status: pass ? "pass" : "fail",
    });
    if (!pass) blocked.push(`Offer marketplace "${offer.marketplace}" not in allowed set.`);
  }

  const ret = parseReturnWindow(request);
  if (ret !== null) {
    const pass = offer.returnWindowDays >= ret;
    conditions.push({
      id: "return",
      label: "Return Window",
      expression: `return ≥ ${ret} days`,
      status: pass ? "pass" : "fail",
    });
    if (!pass) blocked.push(`Return window (${offer.returnWindowDays}d) shorter than ${ret}d.`);
  }

  // Always add an "authenticated seller" clause — this is the trust layer.
  conditions.push({
    id: "authenticity",
    label: "Authenticity",
    expression: "seller.verified = true",
    status: "pass",
    detail: "Seller has passed Warrant marketplace verification.",
  });

  if (conditions.length <= 1) {
    // The request had no extractable constraints. Add a heads-up.
    conditions.unshift({
      id: "intent-clarity",
      label: "Intent",
      expression: "constraints.count ≥ 1",
      status: "unknown",
      detail: "No explicit constraints detected. Add at least one to sign.",
    });
    blocked.push("No constraints detected — Warrant will not authorize an unconstrained buy.");
  }

  const signed = blocked.length === 0 && conditions.every((c) => c.status === "pass");

  return {
    intent: request.trim(),
    item: extractItem(request),
    conditions,
    signed,
    blockedReasons: blocked,
  };
}

export const DEMO_PROMPTS = [
  'Buy a new 27" monitor from Amazon under ₹30,000, delivered by tomorrow, seller rating 4.6+, 30-day returns.',
  "Order a new mechanical keyboard under $150 from Amazon or Best Buy, delivered within 3 days, 30-day return window.",
  "Get a refurbished iPad under €500, seller rating 4.5+, within 5 days.",
];
