import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadsClient } from "./leads-client";

export default async function LeadsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.upsert({
    where: { id: userId },
    create: { id: userId, email: userId },
    update: {},
  });

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    include: {
      _count: { select: { leads: true, subscribers: true, appointments: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Leads & CRM</h1>
        <p className="text-muted-foreground">
          Manage contacts, form submissions, and appointments
        </p>
      </div>
      <LeadsClient projects={projects} />
    </div>
  );
}
