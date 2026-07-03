"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { businessCategories } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Building2, Upload, Sparkles } from "lucide-react";
import { createProject } from "@/actions/project";
import Image from "next/image";

const steps = [
  { id: "business", title: "Business Info" },
  { id: "category", title: "Category" },
  { id: "logo", title: "Logo Upload" },
  { id: "generate", title: "AI Generation" },
];

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    tagline: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    country: "",
    category: "",
    logoFile: null as File | null,
    logoPreview: "",
  });

  const progress = ((step + 1) / steps.length) * 100;

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload PNG, JPG, SVG, or WEBP files only");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        logoFile: file,
        logoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleGenerate = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const form = new FormData();
      form.append("companyName", formData.companyName);
      form.append("tagline", formData.tagline);
      form.append("description", formData.description);
      form.append("phone", formData.phone);
      form.append("email", formData.email);
      form.append("address", formData.address);
      form.append("city", formData.city);
      form.append("country", formData.country);
      form.append("category", formData.category);
      if (formData.logoFile) {
        form.append("logo", formData.logoFile);
      }

      const result = await createProject(form);
      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Website generated successfully!");
      if ("id" in result) {
        router.push(`/builder/${result.id}`);
      }
    } catch {
      toast.error("Failed to generate website. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            AI-Powered Setup
          </div>
          <h1 className="text-3xl font-bold">Set Up Your Business</h1>
          <p className="mt-2 text-muted-foreground">
            Tell us about your business and we&apos;ll create your website
          </p>
        </div>

        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            {steps.map((s, i) => (
              <span
                key={s.id}
                className={i <= step ? "font-medium text-primary" : ""}
              >
                {s.title}
              </span>
            ))}
          </div>
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {step === 0 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold">Business Information</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Tell us about your business
                      </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          placeholder="Acme Inc."
                          value={formData.companyName}
                          onChange={(e) => updateField("companyName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input
                          id="tagline"
                          placeholder="Building the future"
                          value={formData.tagline}
                          onChange={(e) => updateField("tagline", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe what your business does..."
                          value={formData.description}
                          onChange={(e) => updateField("description", e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="+1 234 567 890"
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Business Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="contact@acme.com"
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          placeholder="123 Main St"
                          value={formData.address}
                          onChange={(e) => updateField("address", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={formData.city}
                          onChange={(e) => updateField("city", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          placeholder="United States"
                          value={formData.country}
                          onChange={(e) => updateField("country", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold">Business Category</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Select the category that best describes your business
                      </p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      {businessCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => updateField("category", cat)}
                          className={`rounded-lg border p-4 text-left transition-all hover:border-primary hover:shadow-sm ${
                            formData.category === cat
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : ""
                          }`}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-bold">
                            {cat[0]}
                          </div>
                          <p className="mt-2 text-sm font-medium">{cat}</p>
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custom-category">Or enter custom category</Label>
                      <Input
                        id="custom-category"
                        placeholder="e.g., Interior Design"
                        value={
                          !businessCategories.includes(formData.category as any)
                            ? formData.category
                            : ""
                        }
                        onChange={(e) => updateField("category", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold">Upload Logo</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Upload your company logo. Our AI will analyze it to create your brand identity.
                      </p>
                    </div>
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all hover:border-primary hover:bg-primary/5">
                      {formData.logoPreview ? (
                        <div className="relative h-32 w-32">
                          <Image
                            src={formData.logoPreview}
                            alt="Logo preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                          <p className="mt-4 font-medium">Click to upload logo</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            PNG, JPG, SVG, WEBP (max 5MB)
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.svg,.webp"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    {formData.logoPreview && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            logoFile: null,
                            logoPreview: "",
                          }))
                        }
                      >
                        Remove Logo
                      </Button>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6 text-center">
                    <div>
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold">Ready to Generate</h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Our AI will create a complete website with:
                      </p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        "Brand Identity",
                        "Color Palette",
                        "Typography",
                        "Page Structure",
                        "Content & Copy",
                        "SEO Optimization",
                        "Responsive Design",
                        "Contact Forms",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 rounded-lg border p-3 text-sm"
                        >
                          <Sparkles className="h-4 w-4 text-primary shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {step < steps.length - 1 ? (
                <Button
                  onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                  disabled={
                    (step === 0 && !formData.companyName) ||
                    (step === 1 && !formData.category)
                  }
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  {generating ? (
                    <>Generating...</>
                  ) : (
                    <>
                      Generate Website <Sparkles className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
