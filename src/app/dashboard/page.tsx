import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  TrendingUp,
  Users,
  Sparkles,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
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
    include: { _count: { select: { leads: true, pages: true } } },
    take: 5,
  });

  const totalLeads = projects.reduce((sum, p) => sum + p._count.leads, 0);
  const totalPages = projects.reduce((sum, p) => sum + p._count.pages, 0);

  const stats = [
    { label: "Websites", value: projects.length, icon: Globe, color: "text-blue-500" },
    { label: "Total Pages", value: totalPages, icon: FileText, color: "text-violet-500" },
    { label: "Total Leads", value: totalLeads, icon: Users, color: "text-emerald-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your websites and track performance
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`rounded-lg bg-muted p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Websites</CardTitle>
          <Link href="/onboarding">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> New Website
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <Globe className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">No websites yet</h3>
                <p className="text-sm text-muted-foreground">
                  Create your first AI-powered website
                </p>
              </div>
              <Link href="/onboarding">
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" /> Create Website
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between py-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{project.name}</span>
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
                      {project.category} &middot;{" "}
                      {project._count.pages} pages &middot;{" "}
                      {formatDate(project.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{project._count.leads} leads</Badge>
                    <Link href={`/builder/${project.id}`}>
                      <Button variant="ghost" size="sm">
                        Edit <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FileText(props: { className?: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
