"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createBlog(projectId: string, data: {
  title: string;
  content: any;
  excerpt?: string;
  category?: string;
  tags?: string;
  imageUrl?: string;
}) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const slug = slugify(data.title);
  const existing = await prisma.blog.findUnique({
    where: { projectId_slug: { projectId, slug } },
  });

  if (existing) {
    return { error: "A blog with this title already exists" };
  }

  const blog = await prisma.blog.create({
    data: {
      projectId,
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt,
      category: data.category,
      tags: data.tags,
      imageUrl: data.imageUrl,
    },
  });

  revalidatePath(`/dashboard/blogs`);
  return { id: blog.id };
}

export async function updateBlog(
  blogId: string,
  data: Partial<{
    title: string;
    content: any;
    excerpt: string;
    category: string;
    tags: string;
    imageUrl: string;
    published: boolean;
  }>
) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const updateData: Record<string, unknown> = { ...data };
  if (data.published !== undefined) {
    updateData.published = data.published;
    updateData.publishedAt = data.published ? new Date() : null;
  }

  await prisma.blog.update({
    where: { id: blogId },
    data: updateData as any,
  });
  revalidatePath(`/dashboard/blogs`);
  return { success: true };
}

export async function deleteBlog(blogId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  await prisma.blog.delete({ where: { id: blogId } });
  revalidatePath(`/dashboard/blogs`);
  return { success: true };
}

export async function getBlogs(projectId: string) {
  return prisma.blog.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}
