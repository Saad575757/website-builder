import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Plus, ArrowRight, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function WebsitesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.upsert({
    where: { email: userId },
    create: { id: userId, email: userId },
    update: {},
  });

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      theme: true,
      _count: { select: { pages: true, leads: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Websites</h1>
          <p className="text-muted-foreground">Manage all your websites</p>
        </div>
        <Link href="/onboarding">
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" /> New Website
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <Globe className="h-16 w-16 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">No websites yet</h3>
              <p className="text-sm text-muted-foreground">
                Create your first AI-powered website in minutes
              </p>
            </div>
            <Link href="/onboarding">
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" /> Create Your First Website
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group transition-all hover:shadow-md"
            >
              <CardContent className="p-6">
                <div
                  className="mb-4 h-40 rounded-lg bg-gradient-to-br"
                  style={{
                    background: `linear-gradient(135deg, ${project.theme?.primaryColor || "#6366f1"}22, ${project.theme?.secondaryColor || "#8b5cf6"}22)`,
                  }}
                >
                  <div className="flex h-full items-center justify-center">
                    <Globe
                      className="h-12 w-12"
                      style={{ color: project.theme?.primaryColor || "#6366f1" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{project.name}</h3>
                    <Badge
                      variant={
                        project.status === "PUBLISHED"
                          ? "success"
                          : project.status === "COMPLETED"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {project.status.toLowerCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {project.category} &middot; {project._count.pages} pages
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Created {formatDate(project.createdAt)}
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <Link href={`/builder/${project.id}`} className="flex-1">
                      <Button size="sm" variant="default" className="w-full gap-2">
                        Edit <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    {project.status === "PUBLISHED" && (
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
