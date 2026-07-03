"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitLead(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;

  if (!projectId || !name || !email) {
    return { error: "Required fields missing" };
  }

  const lead = await prisma.lead.create({
    data: { projectId, name, email, phone, message },
  });

  await prisma.analytics.create({
    data: { projectId, leads: 1 },
  });

  return { id: lead.id };
}

export async function subscribeToNewsletter(projectId: string, email: string) {
  if (!email) return { error: "Email required" };

  const existing = await prisma.subscriber.findUnique({
    where: { email },
  });
  if (existing) return { error: "Already subscribed" };

  await prisma.subscriber.create({
    data: { projectId, email },
  });
  return { success: true };
}

export async function createAppointment(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const date = formData.get("date") as string;
  const message = formData.get("message") as string;

  await prisma.appointment.create({
    data: {
      projectId,
      name,
      email,
      phone,
      date: date ? new Date(date) : null,
      message,
    },
  });
  return { success: true };
}

export async function getLeads(projectId: string) {
  return prisma.lead.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSubscribers(projectId: string) {
  return prisma.subscriber.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAppointments(projectId: string) {
  return prisma.appointment.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}
