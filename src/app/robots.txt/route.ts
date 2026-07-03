import { NextResponse } from "next/server";

export async function GET() {
  const robotsTxt = `
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/

Sitemap: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/sitemap

Host: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
`.trim();

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
