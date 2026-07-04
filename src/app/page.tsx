"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Palette,
  Globe,
  Layout,
  Smartphone,
  Search,
  Shield,
} from "lucide-react";
import Link from "next/link";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-6 w-6 text-primary" />
            WebForge
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#templates" className="text-sm text-muted-foreground hover:text-foreground">
              Templates
            </Link>

          </nav>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-gradient-to-r from-primary to-secondary">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden pt-32 pb-24">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background" />
          <div className="absolute top-20 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl" />
          <motion.div
            className="container relative text-center"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.div variants={fadeIn}>
              <Badge variant="premium" className="mb-4">
                Powered by AI
              </Badge>
            </motion.div>
            <motion.h1
              variants={fadeIn}
              className="mx-auto max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            >
              Build Your Dream Website
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                With AI in Minutes
              </span>
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
            >
              Describe your business, upload your logo, and let our AI create a
              stunning, fully responsive website. No coding, no design skills
              needed.
            </motion.p>
            <motion.div
              variants={fadeIn}
              className="mt-8 flex items-center justify-center gap-4"
            >
              <Link href="/sign-up">
                <Button size="xl" className="gap-2">
                  Start Building Free <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              
            </motion.div>
          </motion.div>
        </section>

        <section id="features" className="py-24">
          <div className="container">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold">
                Everything You Need to Succeed Online
              </h2>
              <p className="mt-4 text-muted-foreground">
                AI-powered tools that make website creation effortless
              </p>
            </motion.div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="group h-full transition-all hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {feature.icon}
                      </div>
                      <h3 className="mb-2 font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="templates" className="bg-muted/50 py-24">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold">30+ Professional Templates</h2>
              <p className="mt-4 text-muted-foreground">
                Choose from industry-specific designs optimized for conversions
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">
                        {cat[0]}
                      </div>
                      <span className="font-medium">{cat}</span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


      </main>

      <footer className="border-t py-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2024 WebForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "AI-Powered Generation",
    description: "Describe your business and get a complete website instantly",
    icon: <Zap className="h-6 w-6" />,
  },
  {
    title: "Smart Design System",
    description: "AI analyzes your logo and creates a cohesive brand identity",
    icon: <Palette className="h-6 w-6" />,
  },
  {
    title: "Drag & Drop Editor",
    description: "Customize every element with our intuitive visual builder",
    icon: <Layout className="h-6 w-6" />,
  },
  {
    title: "Fully Responsive",
    description: "Websites look perfect on all devices automatically",
    icon: <Smartphone className="h-6 w-6" />,
  },
];

const categories = [
  "Digital Agency",
  "Restaurant",
  "Medical Clinic",
  "Real Estate",
  "Construction",
  "Gym & Fitness",
  "Beauty Salon",
  "Education",
  "Travel Agency",
  "Photography",
  "Law Firm",
  "Auto Workshop",
];

