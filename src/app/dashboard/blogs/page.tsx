import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogsClient } from "./blogs-client";

export default async function BlogsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.upsert({
    where: { email: userId },
    create: { id: userId, email: userId },
    update: {},
  });

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    include: { blogs: { orderBy: { createdAt: "desc" } } },
  });

  return <BlogsClient projects={projects} />;
}
