import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const PLANS = {
  FREE: {
    priceId: null,
    name: "Free",
    limit: 1,
  },
  STARTER: {
    priceId: "price_starter_monthly",
    name: "Starter",
    limit: 3,
  },
  PRO: {
    priceId: "price_pro_monthly",
    name: "Pro",
    limit: -1,
  },
  AGENCY: {
    priceId: "price_agency_monthly",
    name: "Agency",
    limit: -1,
  },
} as const;

export function getPlanLimit(plan: string): number {
  switch (plan) {
    case "STARTER":
      return 3;
    case "PRO":
    case "AGENCY":
      return -1;
    default:
      return 1;
  }
}
