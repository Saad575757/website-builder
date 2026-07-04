"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { analyzeBranding } from "@/agents/branding";
import { generateLayout } from "@/agents/layout";
import { generateContent } from "@/agents/content";
import { generateSEO } from "@/agents/seo";
import { buildWebsite } from "@/agents/builder";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { sendEmail, renderBusinessSubmissionEmail } from "@/lib/email";

export async function createProject(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const companyName = formData.get("companyName") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const tagline = formData.get("tagline") as string;
  const city = formData.get("city") as string;
  const country = formData.get("country") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const address = formData.get("address") as string;
  const logoFile = formData.get("logo") as File | null;
  const logoBuffer = logoFile ? Buffer.from(await logoFile.arrayBuffer()) : null;
  const ipAddress = formData.get("ipAddress") as string | null;
  const userAgent = formData.get("userAgent") as string | null;

  if (!companyName || !description) {
    return { error: "Company name and description are required" };
  }

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

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      name: companyName,
      category: category || "General",
      description,
      status: "GENERATING",
    },
  });

  const { html, text } = renderBusinessSubmissionEmail({
    userName: realName,
    userEmail: realEmail,
    userId: user.id,
    companyName,
    category: category || "General",
    tagline: tagline || undefined,
    description,
    phone: phone || undefined,
    businessEmail: email || undefined,
    address: address || undefined,
    city: city || undefined,
    country: country || undefined,
    logoUploaded: !!logoFile,
    logoFileName: logoFile?.name || undefined,
    logoUrl: undefined,
    aiEnabled: true,
    submissionTime: new Date().toLocaleString(),
    ipAddress: ipAddress || undefined,
    userAgent: userAgent || undefined,
  });

  const attachments = logoBuffer && logoFile
    ? [{ filename: logoFile.name, content: logoBuffer }]
    : undefined;

  await sendEmail(
    `🚀 New AI Website Builder Submission - ${companyName}`,
    html,
    text,
    attachments
  );

  try {
    const logoAnalysis = await analyzeBranding(
      companyName,
      description,
      category,
      `Logo for ${companyName}, a ${category} business`
    );

    const layout = await generateLayout(
      companyName,
      description,
      category,
      {
        primaryColor: logoAnalysis.primaryColor,
        secondaryColor: logoAnalysis.secondaryColor,
        accentColor: logoAnalysis.accentColor,
        fontHeading: logoAnalysis.fontHeading,
        fontBody: logoAnalysis.fontBody,
        borderRadius: "0.5rem",
        shadow: "md",
        spacing: "1rem",
      }
    );

    const contentResult = await generateContent(
      companyName,
      description,
      category,
      layout.pages
    );

    const seoResult = await generateSEO(
      companyName,
      description,
      category,
      contentResult.pages
    );

    const result = await buildWebsite(project.id, {
      theme: {
        primaryColor: logoAnalysis.primaryColor,
        secondaryColor: logoAnalysis.secondaryColor,
        accentColor: logoAnalysis.accentColor,
        fontHeading: logoAnalysis.fontHeading,
        fontBody: logoAnalysis.fontBody,
        borderRadius: "0.5rem",
        shadow: "md",
        spacing: "1rem",
      },
      pages: contentResult.pages,
      seo: seoResult.seo,
    });

    revalidatePath("/dashboard");
    return { id: project.id, ...result };
  } catch (error) {
    await prisma.project.update({
      where: { id: project.id },
      data: { status: "DRAFT" },
    });
    console.error("AI generation failed:", error);
    return { error: "insufficient_credits" };
  }
}

export async function getUserProjects() {
  const { userId } = await auth();
  if (!userId) return [];

  return prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      theme: true,
      pages: {
        include: { seo: true },
        orderBy: { sortOrder: "asc" },
      },
      _count: { select: { leads: true, blogs: true } },
    },
  });
}

export async function getProject(projectId: string) {
  const { userId } = await auth();
  if (!userId) return null;

  return prisma.project.findFirst({
    where: { id: projectId, userId },
    include: {
      theme: true,
      pages: {
        include: { sections: true, seo: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function updateProjectStatus(
  projectId: string,
  status: "DRAFT" | "GENERATING" | "COMPLETED" | "PUBLISHED"
) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  await prisma.project.update({
    where: { id: projectId, userId },
    data: { status },
  });
  revalidatePath(`/builder/${projectId}`);
  return { success: true };
}

export async function deleteProject(projectId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  await prisma.project.delete({
    where: { id: projectId, userId },
  });
  revalidatePath("/dashboard");
  return { success: true };
}

export async function saveSection(
  pageId: string,
  sectionId: string,
  contentJson: any,
  stylesJson: any
) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const section = await prisma.section.findFirst({
    where: { id: sectionId, page: { project: { userId } } },
  });
  if (!section) return { error: "Not found" };

  await prisma.section.update({
    where: { id: sectionId },
    data: { contentJson, stylesJson },
  });
  return { success: true };
}

export async function reorderSections(
  pageId: string,
  sectionOrder: Array<{ id: string; sortOrder: number }>
) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  await prisma.$transaction(
    sectionOrder.map((s) =>
      prisma.section.update({
        where: { id: s.id },
        data: { sortOrder: s.sortOrder },
      })
    )
  );
  return { success: true };
}

export async function addSection(
  pageId: string,
  type: string,
  contentJson: any
) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const maxOrder = await prisma.section.aggregate({
    where: { page: { project: { userId }, id: pageId } },
    _max: { sortOrder: true },
  });

  const section = await prisma.section.create({
    data: {
      pageId,
      type,
      contentJson,
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
    },
  });
  return { id: section.id };
}

export async function deleteSection(sectionId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  await prisma.section.delete({
    where: { id: sectionId, page: { project: { userId } } },
  });
  return { success: true };
}
