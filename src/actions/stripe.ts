"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function createCheckoutSession(planId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const prices: Record<string, string> = {
    starter: "price_starter_monthly",
    pro: "price_pro_monthly",
    agency: "price_agency_monthly",
  };

  const priceId = prices[planId];
  if (!priceId) return { error: "Invalid plan" };

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: userId,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
    metadata: { userId },
  });

  return { url: session.url };
}

export async function createCustomerPortalSession() {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription?.stripeCustomerId) {
    return { error: "No active subscription" };
  }

  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
  });

  return { url: session.url };
}

export async function getSubscription() {
  const { userId } = await auth();
  if (!userId) return null;

  return prisma.subscription.findUnique({ where: { userId } });
}
