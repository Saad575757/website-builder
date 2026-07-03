import { prisma } from "@/lib/prisma";
import type { GeneratedWebsite } from "@/types";

interface BuildResult {
  projectId: string;
  pages: Array<{
    id: string;
    title: string;
    slug: string;
    sections: Array<{
      id: string;
      type: string;
      sortOrder: number;
    }>;
  }>;
  themeId: string;
}

export async function buildWebsite(
  projectId: string,
  website: GeneratedWebsite
): Promise<BuildResult> {
  const result = await prisma.$transaction(async (tx) => {
    const theme = await tx.theme.upsert({
      where: { projectId },
      create: {
        projectId,
        primaryColor: website.theme.primaryColor,
        secondaryColor: website.theme.secondaryColor,
        accentColor: website.theme.accentColor,
        fontHeading: website.theme.fontHeading,
        fontBody: website.theme.fontBody,
        borderRadius: website.theme.borderRadius,
        shadow: website.theme.shadow,
        spacing: website.theme.spacing,
      },
      update: {
        primaryColor: website.theme.primaryColor,
        secondaryColor: website.theme.secondaryColor,
        accentColor: website.theme.accentColor,
        fontHeading: website.theme.fontHeading,
        fontBody: website.theme.fontBody,
      },
    });

    const createdPages: Array<{
      id: string;
      title: string;
      slug: string;
      sections: Array<{ id: string; type: string; sortOrder: number }>;
    }> = [];

    for (const pageData of website.pages) {
      const page = await tx.page.upsert({
        where: { projectId_slug: { projectId, slug: pageData.slug } },
        create: {
          projectId,
          title: pageData.title,
          slug: pageData.slug,
          status: "PUBLISHED",
        },
        update: { title: pageData.title },
      });

      await tx.section.deleteMany({ where: { pageId: page.id } });

      const sectionIds: Array<{ id: string; type: string; sortOrder: number }> = [];
      for (const section of pageData.sections) {
      const created = await tx.section.create({
        data: {
          pageId: page.id,
          type: section.type,
          contentJson: section.content as any,
          stylesJson: section.styles as any,
          sortOrder: section.sortOrder,
        },
      });
        sectionIds.push({ id: created.id, type: created.type, sortOrder: created.sortOrder });
      }

      createdPages.push({
        id: page.id,
        title: page.title,
        slug: page.slug,
        sections: sectionIds,
      });
    }

    await tx.project.update({
      where: { id: projectId },
      data: { status: "COMPLETED" },
    });

    return {
      projectId,
      pages: createdPages,
      themeId: theme.id,
    };
  });

  return result;
}

export async function updateProjectStatus(
  projectId: string,
  status: "DRAFT" | "GENERATING" | "COMPLETED" | "PUBLISHED"
) {
  return prisma.project.update({
    where: { id: projectId },
    data: { status },
  });
}
