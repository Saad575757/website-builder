"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, renderLeadCaptureEmail } from "@/lib/email";

export async function trackOnboardingStep(data: {
  step: number;
  companyName?: string;
  tagline?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  category?: string;
  logoUploaded: boolean;
  logoFileName?: string;
  userAgent?: string;
}) {
  const { userId } = await auth();
  if (!userId) return;

  const clerkUser = await currentUser();
  const realName = clerkUser
    ? [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || clerkUser.emailAddresses[0]?.emailAddress || userId
    : userId;
  const realEmail = clerkUser?.emailAddresses[0]?.emailAddress || userId;

  const user = await prisma.user.upsert({
    where: { id: userId },
    create: { id: userId, email: realEmail, name: realName },
    update: { email: realEmail, name: realName },
  });

  const stepNames = ["Business Info", "Category", "Logo Upload", "AI Generation"];
  const stepName = stepNames[data.step] || `Step ${data.step + 1}`;
  const companyName = data.companyName || "Unknown";

  const { html, text } = renderLeadCaptureEmail({
    step: data.step,
    stepName,
    userName: realName,
    userEmail: realEmail,
    userId: user.id,
    companyName: data.companyName,
    tagline: data.tagline,
    description: data.description,
    phone: data.phone,
    businessEmail: data.email,
    address: data.address,
    city: data.city,
    country: data.country,
    category: data.category,
    logoUploaded: data.logoUploaded,
    logoFileName: data.logoFileName,
    userAgent: data.userAgent,
  });

  await sendEmail(
    `📋 Lead Captured - ${companyName} (${stepName})`,
    html,
    text
  );
}
