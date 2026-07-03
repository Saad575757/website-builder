"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function trackVisit(projectId: string, page?: string, userAgent?: string) {
  try {
    await prisma.analytics.create({
      data: {
        projectId,
        visitors: 1,
        pageViews: 1,
        page,
        userAgent,
      },
    });
  } catch {
    // silently fail
  }
}

export async function getAnalytics(projectId: string, days: number = 30) {
  const { userId } = await auth();
  if (!userId) return null;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const data = await prisma.analytics.findMany({
    where: {
      projectId,
      date: { gte: startDate },
    },
    orderBy: { date: "asc" },
  });

  const totalVisitors = data.reduce((sum, d) => sum + d.visitors, 0);
  const totalPageViews = data.reduce((sum, d) => sum + d.pageViews, 0);
  const totalLeads = data.reduce((sum, d) => sum + d.leads, 0);

  const dailyData = data.map((d) => ({
    date: d.date.toISOString().split("T")[0],
    visitors: d.visitors,
    pageViews: d.pageViews,
    leads: d.leads,
  }));

  const topPages = data.reduce<Record<string, number>>((acc, d) => {
    if (d.page) {
      acc[d.page] = (acc[d.page] || 0) + d.pageViews;
    }
    return acc;
  }, {});

  return {
    totalVisitors,
    totalPageViews,
    totalLeads,
    conversionRate: totalVisitors > 0 ? ((totalLeads / totalVisitors) * 100).toFixed(2) : "0",
    dailyData,
    topPages: Object.entries(topPages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([page, views]) => ({ page, views })),
  };
}
