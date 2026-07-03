"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  position?: "bottom-right" | "bottom-left";
  variant?: "default" | "outline" | "ghost";
}

export function WhatsAppButton({
  phoneNumber,
  message = "Hi! I'd like to know more about your services.",
  position = "bottom-right",
  variant = "default",
}: WhatsAppButtonProps) {
  const formattedNumber = phoneNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;

  const positionClasses =
    position === "bottom-right"
      ? "fixed bottom-6 right-6 z-50"
      : "fixed bottom-6 left-6 z-50";

  if (variant === "default") {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${positionClasses}`}
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </a>
    );
  }

  return (
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
      <Button variant={variant === "ghost" ? "ghost" : "outline"} className="gap-2">
        <MessageCircle className="h-4 w-4 text-emerald-500" />
        WhatsApp
      </Button>
    </a>
  );
}
