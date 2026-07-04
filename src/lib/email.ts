import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const from = process.env.SMTP_FROM || process.env.SMTP_USER;
const notificationEmail = process.env.NOTIFICATION_EMAIL;

function baseHtml(content: string, title: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
  body{margin:0;padding:0;background-color:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
  .wrapper{padding:32px 16px;max-width:600px;margin:0 auto}
  .card{background:#fff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,.08);overflow:hidden}
  .header{background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:24px 32px}
  .header h1{margin:0;color:#fff;font-size:20px;font-weight:600}
  .body{padding:32px}
  .field{margin-bottom:16px}
  .field-label{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:#6b7280;margin-bottom:4px}
  .field-value{font-size:14px;color:#111827;word-break:break-word}
  .divider{border:none;border-top:1px solid #e5e7eb;margin:24px 0}
  .footer{text-align:center;padding:24px 32px;font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb}
  .badge{display:inline-block;padding:2px 10px;border-radius:9999px;font-size:12px;font-weight:500;background:#eef2ff;color:#6366f1}
  .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  @media(max-width:480px){.grid-2{grid-template-columns:1fr}}
</style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header"><h1>${title}</h1></div>
      <div class="body">${content}</div>
      <div class="footer">
        <p>WebForge &mdash; AI Website Builder</p>
        <p style="margin-top:4px">This is an automated notification. Please do not reply.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function field(label: string, value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const v = String(value);
  if (!v) return "";
  return `<div class="field"><div class="field-label">${label}</div><div class="field-value">${v}</div></div>`;
}

export function renderSignupEmail(data: {
  name: string;
  email: string;
  provider: string;
  userId: string;
  createdAt: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  const html = baseHtml(`
    <div class="badge" style="margin-bottom:16px">New Registration</div>
    <div class="grid-2">
      ${field("Full Name", data.name)}
      ${field("Email Address", data.email)}
    </div>
    ${field("Authentication Provider", data.provider)}
    ${field("User ID", data.userId)}
    ${field("Account Creation Time", data.createdAt)}
    ${field("IP Address", data.ipAddress)}
    ${field("Browser / User Agent", data.userAgent)}
  `, "🎉 New User Signup");

  const text = [
    "🎉 NEW USER SIGNUP",
    "─".repeat(40),
    `Full Name: ${data.name}`,
    `Email: ${data.email}`,
    `Provider: ${data.provider}`,
    `User ID: ${data.userId}`,
    `Created: ${data.createdAt}`,
    data.ipAddress ? `IP: ${data.ipAddress}` : null,
    data.userAgent ? `User Agent: ${data.userAgent}` : null,
  ].filter(Boolean).join("\n");

  return { html, text };
}

export function renderBusinessSubmissionEmail(data: {
  userName: string;
  userEmail: string;
  userId: string;
  companyName: string;
  category: string;
  tagline?: string;
  description: string;
  phone?: string;
  businessEmail?: string;
  address?: string;
  city?: string;
  country?: string;
  logoUploaded: boolean;
  logoFileName?: string;
  logoUrl?: string;
  aiEnabled: boolean;
  submissionTime: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  const html = baseHtml(`
    <div class="badge" style="margin-bottom:16px">New Website Submission</div>

    <h2 style="font-size:16px;font-weight:600;margin:0 0 16px;color:#111827">User Information</h2>
    <div class="grid-2">
      ${field("Name", data.userName)}
      ${field("Email", data.userEmail)}
    </div>
    ${field("User ID", data.userId)}

    <hr class="divider">

    <h2 style="font-size:16px;font-weight:600;margin:0 0 16px;color:#111827">Business Information</h2>
    <div class="grid-2">
      ${field("Company Name", data.companyName)}
      ${field("Category", data.category)}
    </div>
    ${field("Tagline", data.tagline)}
    ${field("Description", data.description)}
    <div class="grid-2">
      ${field("Phone", data.phone)}
      ${field("Business Email", data.businessEmail)}
    </div>
    ${field("Address", data.address)}
    <div class="grid-2">
      ${field("City", data.city)}
      ${field("Country", data.country)}
    </div>

    <hr class="divider">

    <h2 style="font-size:16px;font-weight:600;margin:0 0 16px;color:#111827">Assets</h2>
    ${field("Logo Uploaded", data.logoUploaded ? "Yes" : "No")}
    ${data.logoFileName ? field("Logo File Name", data.logoFileName) : ""}
    ${data.logoUrl ? field("Logo URL", `<a href="${data.logoUrl}" style="color:#6366f1">${data.logoUrl}</a>`) : ""}

    <hr class="divider">

    <h2 style="font-size:16px;font-weight:600;margin:0 0 16px;color:#111827">Submission Details</h2>
    <div class="grid-2">
      ${field("AI Generation", data.aiEnabled ? "Enabled" : "Disabled")}
      ${field("Submission Time", data.submissionTime)}
    </div>
    ${field("IP Address", data.ipAddress)}
    ${field("Browser / User Agent", data.userAgent)}
  `, "🚀 New AI Website Builder Submission");

  const text = [
    "🚀 NEW AI WEBSITE BUILDER SUBMISSION",
    "─".repeat(50),
    "USER INFORMATION",
    `Name: ${data.userName}`,
    `Email: ${data.userEmail}`,
    `User ID: ${data.userId}`,
    "",
    "BUSINESS INFORMATION",
    `Company: ${data.companyName}`,
    `Category: ${data.category}`,
    data.tagline ? `Tagline: ${data.tagline}` : null,
    `Description: ${data.description}`,
    data.phone ? `Phone: ${data.phone}` : null,
    data.businessEmail ? `Business Email: ${data.businessEmail}` : null,
    data.address ? `Address: ${data.address}` : null,
    data.city ? `City: ${data.city}` : null,
    data.country ? `Country: ${data.country}` : null,
    "",
    "ASSETS",
    `Logo Uploaded: ${data.logoUploaded ? "Yes" : "No"}`,
    data.logoFileName ? `Logo File: ${data.logoFileName}` : null,
    data.logoUrl ? `Logo URL: ${data.logoUrl}` : null,
    "",
    "SUBMISSION DETAILS",
    `AI Generation: ${data.aiEnabled ? "Enabled" : "Disabled"}`,
    `Submitted: ${data.submissionTime}`,
    data.ipAddress ? `IP: ${data.ipAddress}` : null,
    data.userAgent ? `User Agent: ${data.userAgent}` : null,
  ].filter(Boolean).join("\n");

  return { html, text };
}

export function renderLeadCaptureEmail(data: {
  step: number;
  stepName: string;
  userName: string;
  userEmail: string;
  userId: string;
  companyName?: string;
  tagline?: string;
  description?: string;
  phone?: string;
  businessEmail?: string;
  address?: string;
  city?: string;
  country?: string;
  category?: string;
  logoUploaded: boolean;
  logoFileName?: string;
  userAgent?: string;
}) {
  const stepLabels = ["Business Info", "Category", "Logo Upload", "Generate"];
  const progressBar = stepLabels
    .map((s, i) => (i <= data.step ? "✅" : "⬜") + " " + s)
    .join(" &nbsp;→&nbsp; ");

  const fieldsHtml = `
    ${data.companyName ? field("Company Name", data.companyName) : ""}
    ${data.tagline ? field("Tagline", data.tagline) : ""}
    ${data.description ? field("Description", data.description) : ""}
    ${data.phone ? field("Phone", data.phone) : ""}
    ${data.businessEmail ? field("Business Email", data.businessEmail) : ""}
    ${data.address ? field("Address", data.address) : ""}
    ${data.city ? field("City", data.city) : ""}
    ${data.country ? field("Country", data.country) : ""}
    ${data.category ? field("Category", data.category) : ""}
    ${field("Logo Uploaded", data.logoUploaded ? "Yes" : "No")}
    ${data.logoFileName ? field("Logo File Name", data.logoFileName) : ""}
  `;

  const html = baseHtml(`
    <div class="badge" style="margin-bottom:16px">Lead Captured at ${data.stepName}</div>
    <p style="font-size:14px;color:#6b7280;margin:0 0 20px">User has completed the <strong>${data.stepName}</strong> step and is progressing through onboarding.</p>
    <div style="font-size:13px;margin-bottom:20px;padding:12px;background:#f9fafb;border-radius:8px;text-align:center">${progressBar}</div>

    <h2 style="font-size:16px;font-weight:600;margin:0 0 16px;color:#111827">User Information</h2>
    <div class="grid-2">
      ${field("Name", data.userName)}
      ${field("Email", data.userEmail)}
    </div>
    ${field("User ID", data.userId)}

    <hr class="divider">

    <h2 style="font-size:16px;font-weight:600;margin:0 0 16px;color:#111827">Collected Data</h2>
    ${fieldsHtml || '<p style="color:#9ca3af;font-style:italic">No data collected yet.</p>'}

    <hr class="divider">

    <h2 style="font-size:16px;font-weight:600;margin:0 0 16px;color:#111827">Session</h2>
    ${field("User Agent", data.userAgent)}
    ${field("Timestamp", new Date().toLocaleString())}
  `, "📋 Lead Captured - Onboarding Progress");

  const text = [
    "📋 LEAD CAPTURED - ONBOARDING PROGRESS",
    "─".repeat(50),
    `Step: ${data.stepName} (${data.step + 1}/4)`,
    "",
    "USER INFORMATION",
    `Name: ${data.userName}`,
    `Email: ${data.userEmail}`,
    `User ID: ${data.userId}`,
    "",
    "COLLECTED DATA",
    data.companyName ? `Company: ${data.companyName}` : null,
    data.tagline ? `Tagline: ${data.tagline}` : null,
    data.description ? `Description: ${data.description}` : null,
    data.phone ? `Phone: ${data.phone}` : null,
    data.businessEmail ? `Business Email: ${data.businessEmail}` : null,
    data.address ? `Address: ${data.address}` : null,
    data.city ? `City: ${data.city}` : null,
    data.country ? `Country: ${data.country}` : null,
    data.category ? `Category: ${data.category}` : null,
    `Logo Uploaded: ${data.logoUploaded ? "Yes" : "No"}`,
    data.logoFileName ? `Logo File: ${data.logoFileName}` : null,
    "",
    "SESSION",
    data.userAgent ? `User Agent: ${data.userAgent}` : null,
    `Time: ${new Date().toLocaleString()}`,
  ].filter(Boolean).join("\n");

  return { html, text };
}

export async function sendEmail(
  subject: string,
  html: string,
  text: string,
  attachments?: Array<{ filename: string; content: Buffer }>
): Promise<void> {
  if (!notificationEmail) {
    console.warn("NOTIFICATION_EMAIL not configured; skipping email");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"WebForge" <${from}>`,
      to: notificationEmail,
      subject,
      html,
      text,
      attachments,
    });
    console.log(`Email sent: ${subject}`);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
