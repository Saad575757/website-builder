"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Plus, Check, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function DomainClient({
  projects,
}: {
  projects: Array<{
    id: string;
    name: string;
    domains: Array<{ id: string; domain: string; verified: boolean }>;
  }>;
}) {
  const [selectedProject, setSelectedProject] = useState(projects[0]?.id || "");
  const [newDomain, setNewDomain] = useState("");

  const currentProject = projects.find((p) => p.id === selectedProject);
  const subdomain = currentProject
    ? `${currentProject.name.toLowerCase().replace(/\s+/g, "-")}.webforge.app`
    : "";

  const handleAddDomain = () => {
    if (!newDomain) return;
    toast.success("Domain added! Please configure your DNS records.");
    setNewDomain("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select website" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Free Subdomain</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-3">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <span className="font-mono text-sm">{subdomain}</span>
            <Badge variant="success" className="ml-auto">
              <Check className="mr-1 h-3 w-3" /> Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Domains</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentProject?.domains.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No custom domains configured. Add a domain below.
            </p>
          )}
          {currentProject?.domains.map((domain) => (
            <div
              key={domain.id}
              className="flex items-center gap-3 rounded-lg border px-4 py-3"
            >
              <Globe className="h-5 w-5 text-muted-foreground" />
              <span className="font-mono text-sm">{domain.domain}</span>
              {domain.verified ? (
                <Badge variant="success" className="ml-auto">
                  <Check className="mr-1 h-3 w-3" /> Verified
                </Badge>
              ) : (
                <Badge variant="warning" className="ml-auto">
                  <X className="mr-1 h-3 w-3" /> Pending DNS
                </Badge>
              )}
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <Input
              placeholder="example.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="font-mono"
            />
            <Button onClick={handleAddDomain} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" /> Add Domain
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
