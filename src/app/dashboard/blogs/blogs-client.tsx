"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createBlog, updateBlog, deleteBlog } from "@/actions/blogs";
import { generateBlogContent } from "@/actions/ai";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  Sparkles,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

export function BlogsClient({
  projects,
}: {
  projects: Array<{
    id: string;
    name: string;
    blogs: Array<{
      id: string;
      title: string;
      slug: string;
      excerpt: string | null;
      published: boolean;
      createdAt: Date;
    }>;
  }>;
}) {
  const [selectedProject, setSelectedProject] = useState(projects[0]?.id || "");
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: "",
  });

  const currentProject = projects.find((p) => p.id === selectedProject);

  const handleGenerate = async () => {
    if (!newBlog.title) {
      toast.error("Please enter a topic/title");
      return;
    }
    setGenerating(true);
    try {
      const result = await generateBlogContent(
        newBlog.title,
        newBlog.tags,
        "professional"
      );
      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }
      if ("title" in result) {
        setNewBlog((prev) => ({
          ...prev,
          title: result.title || prev.title,
          excerpt: result.excerpt || prev.excerpt,
          content: result.content || prev.content,
        }));
      }
      toast.success("AI content generated!");
    } catch {
      toast.error("Failed to generate content");
    } finally {
      setGenerating(false);
    }
  };

  const handleCreate = async () => {
    if (!selectedProject || !newBlog.title) return;
    const result = await createBlog(selectedProject, {
      title: newBlog.title,
      content: { html: newBlog.content },
      excerpt: newBlog.excerpt,
      category: newBlog.category,
      tags: newBlog.tags,
    });
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Blog created!");
    setShowNewDialog(false);
    setNewBlog({ title: "", content: "", excerpt: "", category: "", tags: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blogs</h1>
          <p className="text-muted-foreground">
            Manage blog posts and articles
          </p>
        </div>
        <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Blog Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title / Topic</label>
                <Input
                  placeholder="Enter blog title or topic"
                  value={newBlog.title}
                  onChange={(e) =>
                    setNewBlog((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleGenerate}
                  disabled={generating}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {generating ? "Generating..." : "Generate with AI"}
                </Button>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Excerpt</label>
                <Textarea
                  placeholder="Brief summary"
                  value={newBlog.excerpt}
                  onChange={(e) =>
                    setNewBlog((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  placeholder="Blog content (HTML supported)"
                  value={newBlog.content}
                  onChange={(e) =>
                    setNewBlog((prev) => ({ ...prev, content: e.target.value }))
                  }
                  rows={8}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    placeholder="e.g., Technology"
                    value={newBlog.category}
                    onChange={(e) =>
                      setNewBlog((prev) => ({ ...prev, category: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <Input
                    placeholder="tag1, tag2, tag3"
                    value={newBlog.tags}
                    onChange={(e) =>
                      setNewBlog((prev) => ({ ...prev, tags: e.target.value }))
                    }
                  />
                </div>
              </div>
              <Button onClick={handleCreate} className="w-full">
                Create Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select website" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name} ({p.blogs.length} posts)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {currentProject?.blogs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-4" />
            <p>No blog posts yet. Create your first post!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {currentProject?.blogs.map((blog) => (
            <Card key={blog.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{blog.title}</span>
                    {blog.published ? (
                      <Badge variant="success">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(blog.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={async () => {
                      await updateBlog(blog.id, {
                        published: !blog.published,
                      });
                      toast.success(
                        blog.published ? "Unpublished" : "Published"
                      );
                    }}
                  >
                    {blog.published ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={async () => {
                      await deleteBlog(blog.id);
                      toast.success("Blog deleted");
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
