import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { sendEmail, renderSignupEmail } from "@/lib/email";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const headerPayload = await headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json({ error: "Missing Svix headers" }, { status: 400 });
    }

    const payload = await req.text();
    const wh = new Webhook(webhookSecret);

    let evt: Record<string, any>;
    try {
      evt = wh.verify(payload, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as Record<string, any>;
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (evt.type === "user.created") {
      const d = evt.data;
      const emailAddresses = d.email_addresses || [];
      const emailObj = emailAddresses.find((e: any) => e.email_address) || emailAddresses[0];
      const emailAddress = emailObj?.email_address || "";

      const externalAccounts = d.external_accounts || [];
      const oauthAccount = externalAccounts[0];
      const oauthProvider = oauthAccount?.provider || "";
      const oauthEmail = oauthAccount?.email_address || "";

      const firstName = d.first_name || "";
      const lastName = d.last_name || "";
      const displayName = [firstName, lastName].filter(Boolean).join(" ");
      const name = displayName || emailAddress || oauthEmail || d.id;

      const finalEmail = emailAddress || oauthEmail || d.id;

      const provider = oauthProvider
        ? oauthProvider.charAt(0).toUpperCase() + oauthProvider.slice(1)
        : emailAddress
          ? "Email"
          : "Unknown";

      const ipAddress = headerPayload.get("x-forwarded-for") || undefined;
      const userAgent = headerPayload.get("user-agent") || undefined;

      const { html, text } = renderSignupEmail({
        name,
        email: finalEmail,
        provider,
        userId: d.id,
        createdAt: new Date(d.created_at).toLocaleString(),
        ipAddress,
        userAgent,
      });

      await sendEmail("🎉 New User Signup - " + name, html, text);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
