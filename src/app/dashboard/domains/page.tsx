import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Plus, Check, X, ExternalLink } from "lucide-react";
import { DomainClient } from "./domain-client";

export default async function DomainsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.upsert({
    where: { email: userId },
    create: { id: userId, email: userId },
    update: {},
  });

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    include: { domains: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Domains</h1>
        <p className="text-muted-foreground">
          Manage custom domains for your websites
        </p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Create a website first to manage domains
          </CardContent>
        </Card>
      ) : (
        <DomainClient projects={projects} />
      )}
    </div>
  );
}
