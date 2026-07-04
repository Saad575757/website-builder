import type { TemplateDefinition } from "@/types";

const baseTheme = {
  borderRadius: "0.5rem",
  shadow: "md",
  spacing: "1rem",
};

export const templates: TemplateDefinition[] = [
  {
    id: "agency-modern",
    name: "Modern Agency",
    category: "Digital Agency",
    thumbnail: "/templates/agency-modern.png",
    theme: {
      ...baseTheme,
      primaryColor: "#6366f1",
      secondaryColor: "#8b5cf6",
      accentColor: "#06b6d4",
      fontHeading: "Inter",
      fontBody: "Inter",
    },
    pages: [
      {
        title: "Home",
        slug: "home",
        sections: [
          {
            type: "hero",
            content: {
              headline: "We Build Digital Experiences",
              subheadline: "Award-winning agency helping brands grow online",
              ctaText: "Get Started",
            },
            styles: {},
            sortOrder: 0,
          },
          {
            type: "services",
            content: { title: "Our Services" },
            styles: {},
            sortOrder: 1,
          },
          {
            type: "portfolio",
            content: { title: "Our Work" },
            styles: {},
            sortOrder: 2,
          },
          {
            type: "team",
            content: { title: "Meet Our Team" },
            styles: {},
            sortOrder: 3,
          },
          {
            type: "testimonials",
            content: { title: "Client Reviews" },
            styles: {},
            sortOrder: 4,
          },
          {
            type: "faq",
            content: { title: "FAQs" },
            styles: {},
            sortOrder: 6,
          },
          {
            type: "contact",
            content: { title: "Get In Touch" },
            styles: {},
            sortOrder: 7,
          },
        ],
      },
    ],
  },
  {
    id: "restaurant-elegant",
    name: "Elegant Restaurant",
    category: "Restaurant",
    thumbnail: "/templates/restaurant-elegant.png",
    theme: {
      ...baseTheme,
      primaryColor: "#dc2626",
      secondaryColor: "#f59e0b",
      accentColor: "#10b981",
      fontHeading: "Playfair Display",
      fontBody: "Inter",
    },
    pages: [
      {
        title: "Home",
        slug: "home",
        sections: [
          { type: "hero", content: { headline: "Exceptional Dining Experience" }, styles: {}, sortOrder: 0 },
          { type: "about", content: { title: "Our Story" }, styles: {}, sortOrder: 1 },
          { type: "menu", content: { title: "Our Menu" }, styles: {}, sortOrder: 2 },
          { type: "gallery", content: { title: "Gallery" }, styles: {}, sortOrder: 3 },
          { type: "testimonials", content: { title: "What Our Guests Say" }, styles: {}, sortOrder: 4 },
          { type: "contact", content: { title: "Reservations" }, styles: {}, sortOrder: 5 },
        ],
      },
    ],
  },
  {
    id: "medical-professional",
    name: "Medical Professional",
    category: "Medical Clinic",
    thumbnail: "/templates/medical-professional.png",
    theme: {
      ...baseTheme,
      primaryColor: "#0891b2",
      secondaryColor: "#06b6d4",
      accentColor: "#22c55e",
      fontHeading: "Inter",
      fontBody: "Inter",
    },
    pages: [
      {
        title: "Home",
        slug: "home",
        sections: [
          { type: "hero", content: { headline: "Your Health Is Our Priority" }, styles: {}, sortOrder: 0 },
          { type: "about", content: { title: "About Our Clinic" }, styles: {}, sortOrder: 1 },
          { type: "services", content: { title: "Medical Services" }, styles: {}, sortOrder: 2 },
          { type: "team", content: { title: "Our Doctors" }, styles: {}, sortOrder: 3 },
          { type: "testimonials", content: { title: "Patient Testimonials" }, styles: {}, sortOrder: 4 },
          { type: "appointment", content: { title: "Book Appointment" }, styles: {}, sortOrder: 5 },
          { type: "contact", content: { title: "Contact Us" }, styles: {}, sortOrder: 6 },
        ],
      },
    ],
  },
  {
    id: "real-estate-premium",
    name: "Premium Real Estate",
    category: "Real Estate",
    thumbnail: "/templates/real-estate-premium.png",
    theme: {
      ...baseTheme,
      primaryColor: "#1e40af",
      secondaryColor: "#3b82f6",
      accentColor: "#f59e0b",
      fontHeading: "Inter",
      fontBody: "Inter",
    },
    pages: [
      {
        title: "Home",
        slug: "home",
        sections: [
          { type: "hero", content: { headline: "Find Your Dream Home" }, styles: {}, sortOrder: 0 },
          { type: "services", content: { title: "Our Services" }, styles: {}, sortOrder: 1 },
          { type: "gallery", content: { title: "Featured Properties" }, styles: {}, sortOrder: 2 },
          { type: "team", content: { title: "Our Agents" }, styles: {}, sortOrder: 3 },
          { type: "testimonials", content: { title: "Client Success Stories" }, styles: {}, sortOrder: 4 },
          { type: "contact", content: { title: "Schedule a Visit" }, styles: {}, sortOrder: 5 },
        ],
      },
    ],
  },
  {
    id: "construction-strong",
    name: "Strong Construction",
    category: "Construction",
    thumbnail: "/templates/construction-strong.png",
    theme: {
      ...baseTheme,
      primaryColor: "#d97706",
      secondaryColor: "#f59e0b",
      accentColor: "#dc2626",
      fontHeading: "Inter",
      fontBody: "Inter",
    },
    pages: [
      {
        title: "Home",
        slug: "home",
        sections: [
          { type: "hero", content: { headline: "Building Excellence Since 2010" }, styles: {}, sortOrder: 0 },
          { type: "about", content: { title: "About Us" }, styles: {}, sortOrder: 1 },
          { type: "services", content: { title: "Our Services" }, styles: {}, sortOrder: 2 },
          { type: "portfolio", content: { title: "Our Projects" }, styles: {}, sortOrder: 3 },
          { type: "team", content: { title: "Our Team" }, styles: {}, sortOrder: 4 },
          { type: "testimonials", content: { title: "Client Feedback" }, styles: {}, sortOrder: 5 },
          { type: "contact", content: { title: "Get a Quote" }, styles: {}, sortOrder: 6 },
        ],
      },
    ],
  },
  {
    id: "fitness-energy",
    name: "Energy Fitness",
    category: "Gym",
    thumbnail: "/templates/fitness-energy.png",
    theme: {
      ...baseTheme,
      primaryColor: "#dc2626",
      secondaryColor: "#ef4444",
      accentColor: "#22c55e",
      fontHeading: "Inter",
      fontBody: "Inter",
    },
    pages: [
      {
        title: "Home",
        slug: "home",
        sections: [
          { type: "hero", content: { headline: "Transform Your Body" }, styles: {}, sortOrder: 0 },
          { type: "about", content: { title: "About Our Gym" }, styles: {}, sortOrder: 1 },
          { type: "services", content: { title: "Classes & Programs" }, styles: {}, sortOrder: 2 },
          { type: "team", content: { title: "Our Trainers" }, styles: {}, sortOrder: 3 },
          { type: "testimonials", content: { title: "Member Results" }, styles: {}, sortOrder: 4 },
          { type: "contact", content: { title: "Free Trial" }, styles: {}, sortOrder: 6 },
        ],
      },
    ],
  },
  {
    id: "beauty-glow",
    name: "Glow Beauty Salon",
    category: "Beauty Salon",
    thumbnail: "/templates/beauty-glow.png",
    theme: {
      ...baseTheme,
      primaryColor: "#db2777",
      secondaryColor: "#ec4899",
      accentColor: "#a855f7",
      fontHeading: "Playfair Display",
      fontBody: "Inter",
    },
    pages: [
      {
        title: "Home",
        slug: "home",
        sections: [
          { type: "hero", content: { headline: "Unleash Your Beauty" }, styles: {}, sortOrder: 0 },
          { type: "services", content: { title: "Our Services" }, styles: {}, sortOrder: 1 },
          { type: "gallery", content: { title: "Our Work" }, styles: {}, sortOrder: 2 },
          { type: "team", content: { title: "Our Stylists" }, styles: {}, sortOrder: 3 },
          { type: "testimonials", content: { title: "Client Reviews" }, styles: {}, sortOrder: 4 },
          { type: "appointment", content: { title: "Book Appointment" }, styles: {}, sortOrder: 5 },
          { type: "contact", content: { title: "Visit Us" }, styles: {}, sortOrder: 6 },
        ],
      },
    ],
  },
  {
    id: "education-learn",
    name: "Learn Academy",
    category: "Education",
    thumbnail: "/templates/education-learn.png",
    theme: {
      ...baseTheme,
      primaryColor: "#7c3aed",
      secondaryColor: "#a855f7",
      accentColor: "#06b6d4",
      fontHeading: "Inter",
      fontBody: "Inter",
    },
    pages: [
      {
        title: "Home",
        slug: "home",
        sections: [
          { type: "hero", content: { headline: "Shape Your Future" }, styles: {}, sortOrder: 0 },
          { type: "about", content: { title: "About Our Academy" }, styles: {}, sortOrder: 1 },
          { type: "services", content: { title: "Our Courses" }, styles: {}, sortOrder: 2 },
          { type: "features", content: { title: "Why Choose Us" }, styles: {}, sortOrder: 3 },
          { type: "team", content: { title: "Our Faculty" }, styles: {}, sortOrder: 4 },
          { type: "testimonials", content: { title: "Student Stories" }, styles: {}, sortOrder: 5 },
          { type: "contact", content: { title: "Enroll Now" }, styles: {}, sortOrder: 6 },
        ],
      },
    ],
  },
  {
    id: "travel-adventure",
    name: "Adventure Travel",
    category: "Travel Agency",
    thumbnail: "/templates/travel-adventure.png",
    theme: {
      ...baseTheme,
      primaryColor: "#2563eb",
      secondaryColor: "#06b6d4",
      accentColor: "#22c55e",
      fontHeading: "Inter",
      fontBody: "Inter",
    },
    pages: [
      {
        title: "Home",
        slug: "home",
        sections: [
          { type: "hero", content: { headline: "Explore The World" }, styles: {}, sortOrder: 0 },
          { type: "services", content: { title: "Travel Packages" }, styles: {}, sortOrder: 1 },
          { type: "gallery", content: { title: "Destinations" }, styles: {}, sortOrder: 2 },
          { type: "features", content: { title: "Why Travel With Us" }, styles: {}, sortOrder: 3 },
          { type: "testimonials", content: { title: "Traveler Reviews" }, styles: {}, sortOrder: 4 },
          { type: "contact", content: { title: "Plan Your Trip" }, styles: {}, sortOrder: 5 },
        ],
      },
    ],
  },
  {
    id: "photography-studio",
    name: "Photography Studio",
    category: "Photography",
    thumbnail: "/templates/photography-studio.png",
    theme: {
      ...baseTheme,
      primaryColor: "#1e1e1e",
      secondaryColor: "#404040",
      accentColor: "#f59e0b",
      fontHeading: "Inter",
      fontBody: "Inter",
    },
    pages: [
      {
        title: "Home",
        slug: "home",
        sections: [
          { type: "hero", content: { headline: "Capturing Moments That Last Forever" }, styles: {}, sortOrder: 0 },
          { type: "about", content: { title: "About Me" }, styles: {}, sortOrder: 1 },
          { type: "portfolio", content: { title: "My Portfolio" }, styles: {}, sortOrder: 2 },
          { type: "services", content: { title: "Services & Pricing" }, styles: {}, sortOrder: 3 },
          { type: "testimonials", content: { title: "Client Love" }, styles: {}, sortOrder: 4 },
          { type: "contact", content: { title: "Book a Session" }, styles: {}, sortOrder: 5 },
        ],
      },
    ],
  },
  {
    id: "law-firm",
    name: "Law Firm Pro",
    category: "Lawyer",
    thumbnail: "/templates/law-firm.png",
    theme: {
      ...baseTheme,
      primaryColor: "#1e3a5f",
      secondaryColor: "#3b82f6",
      accentColor: "#d4a047",
      fontHeading: "Inter",
      fontBody: "Inter",
    },
    pages: [
      {
        title: "Home",
        slug: "home",
        sections: [
          { type: "hero", content: { headline: "Expert Legal Counsel" }, styles: {}, sortOrder: 0 },
          { type: "about", content: { title: "Our Firm" }, styles: {}, sortOrder: 1 },
          { type: "services", content: { title: "Practice Areas" }, styles: {}, sortOrder: 2 },
          { type: "team", content: { title: "Our Attorneys" }, styles: {}, sortOrder: 3 },
          { type: "testimonials", content: { title: "Case Results" }, styles: {}, sortOrder: 4 },
          { type: "contact", content: { title: "Free Consultation" }, styles: {}, sortOrder: 5 },
        ],
      },
    ],
  },
  {
    id: "finance-trust",
    name: "Trust Finance",
    category: "Accountant",
    thumbnail: "/templates/finance-trust.png",
    theme: {
      ...baseTheme,
      primaryColor: "#0f766e",
      secondaryColor: "#14b8a6",
      accentColor: "#f59e0b",
      fontHeading: "Inter",
      fontBody: "Inter",
    },
    pages: [
      {
        title: "Home",
        slug: "home",
        sections: [
          { type: "hero", content: { headline: "Secure Your Financial Future" }, styles: {}, sortOrder: 0 },
          { type: "services", content: { title: "Financial Services" }, styles: {}, sortOrder: 1 },
          { type: "about", content: { title: "Why Choose Us" }, styles: {}, sortOrder: 2 },
          { type: "features", content: { title: "Our Approach" }, styles: {}, sortOrder: 3 },
          { type: "testimonials", content: { title: "Client Success" }, styles: {}, sortOrder: 4 },
          { type: "contact", content: { title: "Schedule a Meeting" }, styles: {}, sortOrder: 5 },
        ],
      },
    ],
  },
  {
    id: "auto-workshop",
    name: "AutoWorks Pro",
    category: "Auto Workshop",
    thumbnail: "/templates/auto-workshop.png",
    theme: {
      ...baseTheme,
      primaryColor: "#dc2626",
      secondaryColor: "#1e293b",
      accentColor: "#f59e0b",
      fontHeading: "Inter",
      fontBody: "Inter",
    },
    pages: [
      {
        title: "Home",
        slug: "home",
        sections: [
          { type: "hero", content: { headline: "Professional Auto Repair" }, styles: {}, sortOrder: 0 },
          { type: "services", content: { title: "Our Services" }, styles: {}, sortOrder: 1 },
          { type: "about", content: { title: "About Our Shop" }, styles: {}, sortOrder: 2 },
          { type: "testimonials", content: { title: "Customer Reviews" }, styles: {}, sortOrder: 3 },
          { type: "contact", content: { title: "Book an Appointment" }, styles: {}, sortOrder: 4 },
        ],
      },
    ],
  },
  {
    id: "dentist-care",
    name: "Dental Care",
    category: "Dentist",
    thumbnail: "/templates/dentist-care.png",
    theme: {
      ...baseTheme,
      primaryColor: "#0ea5e9",
      secondaryColor: "#06b6d4",
      accentColor: "#22c55e",
      fontHeading: "Inter",
      fontBody: "Inter",
    },
    pages: [
      {
        title: "Home",
        slug: "home",
        sections: [
          { type: "hero", content: { headline: "Bright Smiles For Everyone" }, styles: {}, sortOrder: 0 },
          { type: "about", content: { title: "Our Practice" }, styles: {}, sortOrder: 1 },
          { type: "services", content: { title: "Dental Services" }, styles: {}, sortOrder: 2 },
          { type: "team", content: { title: "Our Dentists" }, styles: {}, sortOrder: 3 },
          { type: "testimonials", content: { title: "Patient Reviews" }, styles: {}, sortOrder: 4 },
          { type: "appointment", content: { title: "Book Appointment" }, styles: {}, sortOrder: 5 },
          { type: "contact", content: { title: "Contact Us" }, styles: {}, sortOrder: 6 },
        ],
      },
    ],
  },
];

export function getTemplatesByCategory(category: string): TemplateDefinition[] {
  return templates.filter(
    (t) => t.category.toLowerCase() === category.toLowerCase()
  );
}

export function getTemplate(id: string): TemplateDefinition | undefined {
  return templates.find((t) => t.id === id);
}

export function getAllCategories(): string[] {
  return [...new Set(templates.map((t) => t.category))];
}
