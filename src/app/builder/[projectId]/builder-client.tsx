"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Monitor,
  Tablet,
  Smartphone,
  Plus,
  GripVertical,
  Trash2,
  Settings,
  Save,
  Globe,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { sectionDefinitions } from "@/lib/utils";

export interface SerializedProject {
  id: string;
  name: string;
  category: string | null;
  status: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontHeading: string;
    fontBody: string;
    borderRadius: string;
    shadow: string;
    spacing: string;
  } | null;
  pages: Array<{
    id: string;
    title: string;
    slug: string;
    sections: Array<{
      id: string;
      type: string;
      contentJson: Record<string, unknown>;
      stylesJson: Record<string, unknown>;
      sortOrder: number;
    }>;
  }>;
}

interface BuilderClientProps {
  project: SerializedProject;
}

function PreviewSection({ section }: { section: { type: string; contentJson: Record<string, unknown> } }) {
  const type = section.type;
  const content = section.contentJson as Record<string, string>;

  const previews: Record<string, React.ReactNode> = {
    hero: (
      <div className="flex min-h-[200px] items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{content.headline || "Hero Section"}</h2>
          <p className="text-muted-foreground mt-2">{content.subheadline || "Your headline here"}</p>
        </div>
      </div>
    ),
    about: (
      <div className="p-6">
        <h3 className="text-lg font-semibold">{content.title || "About Us"}</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {typeof content.paragraphs === "string" ? content.paragraphs : "Your about content here"}
        </p>
      </div>
    ),
    services: (
      <div className="p-6">
        <h3 className="text-lg font-semibold">{content.title || "Our Services"}</h3>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="rounded-lg bg-muted p-3 text-sm">Service 1</div>
          <div className="rounded-lg bg-muted p-3 text-sm">Service 2</div>
        </div>
      </div>
    ),
    contact: (
      <div className="p-6">
        <h3 className="text-lg font-semibold">{content.title || "Contact Us"}</h3>
        <p className="text-sm text-muted-foreground mt-2">{content.email || "email@example.com"}</p>
      </div>
    ),
  };

  return (
    <div className="rounded-lg border bg-card">
      {previews[type] || (
        <div className="p-6 text-center text-muted-foreground">
          <p className="font-medium capitalize">{type} Section</p>
          <p className="text-sm">Click to edit</p>
        </div>
      )}
    </div>
  );
}

export function BuilderClient({ project }: BuilderClientProps) {
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState("editor");
  const [showGrid, setShowGrid] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      toast.success("Section reordered");
    }
  };

  const handleAddSection = (type: string) => {
    toast.success(`Added ${type} section`);
  };

  const previewWidth =
    previewMode === "mobile" ? "w-[375px]" : previewMode === "tablet" ? "w-[768px]" : "w-full";

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b bg-card px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-semibold">{project.name}</h1>
            <p className="text-xs text-muted-foreground">Builder</p>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border p-1">
            <Button
              variant={previewMode === "desktop" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setPreviewMode("desktop")}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === "tablet" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setPreviewMode("tablet")}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === "mobile" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setPreviewMode("mobile")}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowGrid(!showGrid)}>
            {showGrid ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button size="sm" className="gap-2">
            <Save className="h-4 w-4" /> Save
          </Button>
          <Button variant="default" size="sm" className="gap-2">
            <Globe className="h-4 w-4" /> Publish
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r bg-card overflow-y-auto">
          <TabsContent value="editor" className="p-4 mt-0">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Add Sections</h3>
            <div className="space-y-2">
              {sectionDefinitions.map((def) => (
                <button
                  key={def.type}
                  onClick={() => handleAddSection(def.type)}
                  className="flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all hover:border-primary hover:bg-primary/5"
                >
                  <Plus className="h-4 w-4 text-primary shrink-0" />
                  <span>{def.label}</span>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pages" className="p-4 mt-0">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Pages</h3>
            <div className="space-y-2">
              {project.pages.map((page) => (
                <button
                  key={page.id}
                  className="flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all hover:border-primary"
                >
                  <Globe className="h-4 w-4" />
                  <span>{page.title}</span>
                </button>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full gap-2">
              <Plus className="h-4 w-4" /> Add Page
            </Button>
          </TabsContent>

          <TabsContent value="theme" className="p-4 mt-0">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Theme Settings</h3>
            <div className="space-y-4">
              {[
                { label: "Primary Color", value: project.theme?.primaryColor || "#6366f1" },
                { label: "Secondary Color", value: project.theme?.secondaryColor || "#8b5cf6" },
                { label: "Accent Color", value: project.theme?.accentColor || "#06b6d4" },
              ].map((color) => (
                <div key={color.label} className="space-y-2">
                  <label className="text-xs text-muted-foreground">{color.label}</label>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-8 w-8 rounded-md border"
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="text-sm font-mono">{color.value}</span>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Heading Font</label>
                <p className="text-sm font-medium">{project.theme?.fontHeading || "Inter"}</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Body Font</label>
                <p className="text-sm font-medium">{project.theme?.fontBody || "Inter"}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="p-4 mt-0">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">SEO Settings</h3>
            <p className="text-sm text-muted-foreground">
              SEO metadata will be automatically generated for each page.
            </p>
          </TabsContent>
        </aside>

        <main className="flex-1 overflow-y-auto bg-muted/30 p-8">
          <div
            className={`mx-auto transition-all duration-300 ${previewWidth} ${
              previewMode !== "desktop" ? "rounded-xl border-8 border-foreground/20 shadow-2xl" : ""
            }`}
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="space-y-4">
                {project.pages[0]?.sections
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((section) => (
                    <SortableContext
                      key={section.id}
                      items={[section.id]}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="rounded-lg border bg-card shadow-sm">
                        {showGrid && (
                          <div className="flex items-center justify-between rounded-t-lg border-b bg-muted/50 px-4 py-2">
                            <div className="flex items-center gap-2">
                              <div className="cursor-grab text-muted-foreground">
                                <GripVertical className="h-4 w-4" />
                              </div>
                              <Badge variant="outline" className="capitalize">
                                {section.type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                        <PreviewSection section={section} />
                      </div>
                    </SortableContext>
                  ))}
              </div>
            </DndContext>
          </div>
        </main>
      </div>
    </div>
    </Tabs>
  );
}
