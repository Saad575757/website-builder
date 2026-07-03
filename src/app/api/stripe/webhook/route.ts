import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") || "";

    const StripeClient = (await import("stripe")).default;
    const stripe = new StripeClient(process.env.STRIPE_SECRET_KEY!);

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
    } catch {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.userId;

        if (userId) {
          await prisma.subscription.upsert({
            where: { userId },
            create: {
              userId,
              plan: subscription.items.data[0]?.price?.nickname?.toUpperCase() as any || "PRO",
              status: "ACTIVE",
              stripeCustomerId: subscription.customer as string,
              stripeSubscriptionId: subscription.id,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
            update: {
              plan: subscription.items.data[0]?.price?.nickname?.toUpperCase() as any || "PRO",
              status: "ACTIVE",
              stripeCustomerId: subscription.customer as string,
              stripeSubscriptionId: subscription.id,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const deletedSub = event.data.object as Stripe.Subscription;
        const deletedUserId = deletedSub.metadata.userId;

        if (deletedUserId) {
          await prisma.subscription.update({
            where: { userId: deletedUserId },
            data: { status: "CANCELED" },
          });
        }
        break;
      }

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const checkoutUserId = session.metadata?.userId;

        if (checkoutUserId && session.customer) {
          await prisma.subscription.upsert({
            where: { userId: checkoutUserId },
            create: {
              userId: checkoutUserId,
              plan: "STARTER",
              status: "ACTIVE",
              stripeCustomerId: session.customer as string,
            },
            update: {
              stripeCustomerId: session.customer as string,
            },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
