import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BillingClient } from "./billing-client";

export default async function BillingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.upsert({
    where: { email: userId },
    create: { id: userId, email: userId },
    update: {},
  });

  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });

  return <BillingClient subscription={subscription} />;
}
