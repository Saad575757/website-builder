import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const aiModels = [
    { name: "Claude Sonnet 4", provider: "Anthropic", tier: "premium" },
    { name: "Gemini 2.5 Pro", provider: "Google", tier: "standard" },
    { name: "Gemini 2.5 Flash", provider: "Google", tier: "fast" },
    { name: "DeepSeek Chat", provider: "DeepSeek", tier: "budget" },
  ];

  for (const model of aiModels) {
    await prisma.aIModel.upsert({
      where: { name: model.name },
      update: {},
      create: model,
    });
  }

  const templateData = [
    { name: "Modern Agency", category: "Digital Agency", pages: JSON.stringify(["home", "about", "services", "portfolio", "contact"]) },
    { name: "Elegant Restaurant", category: "Restaurant", pages: JSON.stringify(["home", "menu", "gallery", "contact"]) },
    { name: "Medical Professional", category: "Medical Clinic", pages: JSON.stringify(["home", "services", "doctors", "contact"]) },
    { name: "Real Estate Premium", category: "Real Estate", pages: JSON.stringify(["home", "listings", "agents", "contact"]) },
    { name: "Fitness Energy", category: "Gym", pages: JSON.stringify(["home", "classes", "pricing", "contact"]) },
    { name: "Beauty Glow", category: "Beauty Salon", pages: JSON.stringify(["home", "services", "gallery", "contact"]) },
    { name: "Learn Academy", category: "Education", pages: JSON.stringify(["home", "courses", "faculty", "contact"]) },
    { name: "Adventure Travel", category: "Travel Agency", pages: JSON.stringify(["home", "packages", "destinations", "contact"]) },
    { name: "Law Firm Pro", category: "Lawyer", pages: JSON.stringify(["home", "practice-areas", "team", "contact"]) },
    { name: "Trust Finance", category: "Accountant", pages: JSON.stringify(["home", "services", "team", "contact"]) },
    { name: "AutoWorks Pro", category: "Auto Workshop", pages: JSON.stringify(["home", "services", "gallery", "contact"]) },
    { name: "Dental Care", category: "Dentist", pages: JSON.stringify(["home", "services", "team", "contact"]) },
    { name: "Strong Construction", category: "Construction", pages: JSON.stringify(["home", "projects", "services", "contact"]) },
    { name: "Photography Studio", category: "Photography", pages: JSON.stringify(["home", "portfolio", "pricing", "contact"]) },
    { name: "Marketing Pro", category: "Marketing Agency", pages: JSON.stringify(["home", "services", "case-studies", "contact"]) },
  ];

  for (const template of templateData) {
    await prisma.template.upsert({
      where: { id: template.name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        id: template.name.toLowerCase().replace(/\s+/g, "-"),
        name: template.name,
        category: template.category,
        pages: JSON.parse(template.pages),
        theme: {},
      },
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
