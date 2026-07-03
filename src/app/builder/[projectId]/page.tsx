import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BuilderClient } from "./builder-client";
import type { SerializedProject } from "./builder-client";

function serializeSection(s: any) {
  return {
    id: s.id,
    type: s.type,
    sortOrder: s.sortOrder,
    contentJson: s.contentJson as Record<string, unknown>,
    stylesJson: s.stylesJson as Record<string, unknown>,
  };
}

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    include: {
      theme: true,
      pages: {
        include: { sections: true, seo: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!project) redirect("/dashboard");

  const serialized: SerializedProject = {
    id: project.id,
    name: project.name,
    category: project.category,
    status: project.status,
    theme: project.theme
      ? {
          primaryColor: project.theme.primaryColor,
          secondaryColor: project.theme.secondaryColor,
          accentColor: project.theme.accentColor,
          fontHeading: project.theme.fontHeading,
          fontBody: project.theme.fontBody,
          borderRadius: project.theme.borderRadius,
          shadow: project.theme.shadow,
          spacing: project.theme.spacing,
        }
      : null,
    pages: project.pages.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      sections: p.sections.map(serializeSection),
    })),
  };

  return <BuilderClient project={serialized} />;
}
