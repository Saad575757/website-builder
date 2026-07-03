import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { projectId, page, userAgent } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID required" },
        { status: 400 }
      );
    }

    await prisma.analytics.create({
      data: {
        projectId,
        visitors: 1,
        pageViews: 1,
        page: page || "/",
        userAgent: userAgent || req.headers.get("user-agent") || "",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to track analytics" },
      { status: 500 }
    );
  }
}
