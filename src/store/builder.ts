import { create } from "zustand";
import type { BuilderState, GeneratedTheme, PageStructure } from "@/types";

interface BuilderStore extends BuilderState {
  setProjectId: (id: string) => void;
  setCurrentPage: (slug: string) => void;
  setPages: (pages: PageStructure[]) => void;
  setTheme: (theme: GeneratedTheme) => void;
  setSelectedSection: (id: string | null) => void;
  setIsDragging: (dragging: boolean) => void;
  setPreviewMode: (mode: "desktop" | "tablet" | "mobile") => void;
  addPage: (page: PageStructure) => void;
  removePage: (slug: string) => void;
  updatePage: (slug: string, page: Partial<PageStructure>) => void;
  addSection: (pageSlug: string, section: PageStructure["sections"][0]) => void;
  removeSection: (pageSlug: string, sectionId: string) => void;
  updateSection: (pageSlug: string, sectionId: string, data: Partial<PageStructure["sections"][0]>) => void;
  reorderSections: (pageSlug: string, sections: PageStructure["sections"]) => void;
  updateTheme: (theme: Partial<GeneratedTheme>) => void;
}

export const useBuilderStore = create<BuilderStore>((set) => ({
  projectId: "",
  currentPage: "home",
  pages: [],
  theme: {
    primaryColor: "#6366f1",
    secondaryColor: "#8b5cf6",
    accentColor: "#06b6d4",
    fontHeading: "Inter",
    fontBody: "Inter",
    borderRadius: "0.5rem",
    shadow: "md",
    spacing: "1rem",
  },
  selectedSection: null,
  isDragging: false,
  previewMode: "desktop",

  setProjectId: (id) => set({ projectId: id }),
  setCurrentPage: (slug) => set({ currentPage: slug }),
  setPages: (pages) => set({ pages }),
  setTheme: (theme) => set({ theme }),
  setSelectedSection: (id) => set({ selectedSection: id }),
  setIsDragging: (dragging) => set({ isDragging: dragging }),
  setPreviewMode: (mode) => set({ previewMode: mode }),

  addPage: (page) =>
    set((state) => ({ pages: [...state.pages, page] })),

  removePage: (slug) =>
    set((state) => ({
      pages: state.pages.filter((p) => p.slug !== slug),
    })),

  updatePage: (slug, page) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.slug === slug ? { ...p, ...page } : p
      ),
    })),

  addSection: (pageSlug, section) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.slug === pageSlug
          ? { ...p, sections: [...p.sections, section] }
          : p
      ),
    })),

  removeSection: (pageSlug, sectionId) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.slug === pageSlug
          ? {
              ...p,
              sections: p.sections.filter((s) => s.type !== sectionId),
            }
          : p
      ),
    })),

  updateSection: (pageSlug, sectionId, data) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.slug === pageSlug
          ? {
              ...p,
              sections: p.sections.map((s) =>
                s.type === sectionId ? { ...s, ...data } : s
              ),
            }
          : p
      ),
    })),

  reorderSections: (pageSlug, sections) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.slug === pageSlug ? { ...p, sections } : p
      ),
    })),

  updateTheme: (theme) =>
    set((state) => ({ theme: { ...state.theme, ...theme } })),
}));
