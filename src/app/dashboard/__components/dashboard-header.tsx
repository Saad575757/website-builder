"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function DashboardHeader() {
  const { user } = useUser();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div>
        <h2 className="text-sm text-muted-foreground">
          Welcome back, {user?.firstName || "User"}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/onboarding">
          <Button size="sm" className="gap-2">
            <Sparkles className="h-4 w-4" />
            New Website
          </Button>
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
