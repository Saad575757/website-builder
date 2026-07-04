import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Globe, Activity } from "lucide-react";

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const admin = await prisma.admin.findUnique({ where: { userId } });
  if (!admin) redirect("/dashboard");

  const totalUsers = await prisma.user.count();
  const totalProjects = await prisma.project.count();
  const publishedProjects = await prisma.project.count({
    where: { status: "PUBLISHED" },
  });
  const totalLeads = await prisma.lead.count();

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users, color: "text-blue-500" },
    { label: "Total Websites", value: totalProjects, icon: Globe, color: "text-violet-500" },
    { label: "Published", value: publishedProjects, icon: Globe, color: "text-emerald-500" },
    { label: "Total Leads", value: totalLeads, icon: Activity, color: "text-cyan-500" },
  ];

  const recentProjects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage platform users, websites, and subscriptions
            </p>
          </div>
          <Badge variant="premium">Admin</Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-4 text-center">
                  <Icon className={`mx-auto h-6 w-6 ${stat.color}`} />
                  <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Websites</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4"
                >
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">
                      by {project.user.name || project.user.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
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
                    <span className="text-sm text-muted-foreground">
                      {project.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Users</h3>
              <p className="text-sm text-muted-foreground">
                Manage platform users
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Templates</h3>
              <p className="text-sm text-muted-foreground">
                Manage website templates
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">AI Models</h3>
              <p className="text-sm text-muted-foreground">
                Configure AI model settings
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
