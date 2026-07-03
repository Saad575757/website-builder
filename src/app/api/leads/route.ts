import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { projectId, name, email, phone, message } = await req.json();

    if (!projectId || !name || !email) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: { projectId, name, email, phone, message },
    });

    await prisma.analytics.create({
      data: { projectId, leads: 1 },
    });

    return NextResponse.json({ id: lead.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
