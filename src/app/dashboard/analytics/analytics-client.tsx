"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAnalytics } from "@/actions/analytics";
import {
  BarChart3,
  Users,
  Eye,
  TrendingUp,
  MousePointerClick,
} from "lucide-react";

interface AnalyticsData {
  totalVisitors: number;
  totalPageViews: number;
  totalLeads: number;
  conversionRate: string;
  topPages: Array<{ page: string; views: number }>;
}

export function AnalyticsClient({
  projects,
}: {
  projects: Array<{ id: string; name: string }>;
}) {
  const [selectedProject, setSelectedProject] = useState(projects[0]?.id || "");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedProject) return;
    setLoading(true);
    getAnalytics(selectedProject)
      .then(setData)
      .finally(() => setLoading(false));
  }, [selectedProject]);

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Create a website to see analytics
        </CardContent>
      </Card>
    );
  }

  const stats = [
    { label: "Visitors", value: data?.totalVisitors || 0, icon: Users, color: "text-blue-500" },
    { label: "Page Views", value: data?.totalPageViews || 0, icon: Eye, color: "text-violet-500" },
    { label: "Leads", value: data?.totalLeads || 0, icon: MousePointerClick, color: "text-emerald-500" },
    { label: "Conversion", value: `${data?.conversionRate || "0"}%`, icon: TrendingUp, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select website" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`rounded-lg bg-muted p-3 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.topPages && data.topPages.length > 0 ? (
            <div className="space-y-2">
              {data.topPages.map((page) => (
                <div
                  key={page.page}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <span className="text-sm font-medium">{page.page}</span>
                  <span className="text-sm text-muted-foreground">
                    {page.views} views
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">
              No data yet. Publish your website to start collecting analytics.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
