import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function absoluteUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${path}`;
}

export const businessCategories = [
  "Digital Agency",
  "Marketing Agency",
  "Restaurant",
  "Construction",
  "Medical Clinic",
  "Dentist",
  "Gym",
  "Beauty Salon",
  "Real Estate",
  "E-commerce",
  "Auto Workshop",
  "Lawyer",
  "Accountant",
  "Education",
  "Travel Agency",
  "Photography",
  "Consulting",
] as const;

export type BusinessCategory = (typeof businessCategories)[number];

export const sectionDefinitions = [
  { type: "hero", label: "Hero", icon: "layout", category: "header" },
  { type: "about", label: "About", icon: "info", category: "content" },
  { type: "services", label: "Services", icon: "briefcase", category: "content" },
  { type: "features", label: "Features", icon: "layers", category: "content" },
  { type: "portfolio", label: "Portfolio", icon: "image", category: "content" },
  { type: "team", label: "Team", icon: "users", category: "content" },
  { type: "testimonials", label: "Testimonials", icon: "message-square", category: "social" },

  { type: "faq", label: "FAQ", icon: "help-circle", category: "content" },
  { type: "contact", label: "Contact", icon: "phone", category: "footer" },
  { type: "cta", label: "Call to Action", icon: "target", category: "conversion" },
  { type: "gallery", label: "Gallery", icon: "camera", category: "content" },
  { type: "stats", label: "Statistics", icon: "bar-chart", category: "content" },
  { type: "logo-cloud", label: "Logo Cloud", icon: "grid", category: "content" },
  { type: "menu", label: "Menu", icon: "book-open", category: "content" },
  { type: "appointment", label: "Appointment", icon: "calendar", category: "conversion" },
  { type: "video", label: "Video", icon: "play", category: "media" },
] as const;
