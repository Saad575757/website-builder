"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLeads, getSubscribers, getAppointments } from "@/actions/leads";
import { formatDate } from "@/lib/utils";
import { Users, Mail, Calendar } from "lucide-react";

export function LeadsClient({
  projects,
}: {
  projects: Array<{
    id: string;
    name: string;
    _count: { leads: number; subscribers: number; appointments: number };
  }>;
}) {
  const [selectedProject, setSelectedProject] = useState(projects[0]?.id || "");
  const [leads, setLeads] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedProject) return;
    setLoading(true);
    Promise.all([
      getLeads(selectedProject),
      getSubscribers(selectedProject),
      getAppointments(selectedProject),
    ])
      .then(([l, s, a]) => {
        setLeads(l);
        setSubscribers(s);
        setAppointments(a);
      })
      .finally(() => setLoading(false));
  }, [selectedProject]);

  const totalCounts = projects.reduce(
    (acc, p) => ({
      leads: acc.leads + p._count.leads,
      subscribers: acc.subscribers + p._count.subscribers,
      appointments: acc.appointments + p._count.appointments,
    }),
    { leads: 0, subscribers: 0, appointments: 0 }
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-blue-500/10 p-3 text-blue-500">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCounts.leads}</p>
              <p className="text-xs text-muted-foreground">Total Leads</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-500">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCounts.subscribers}</p>
              <p className="text-xs text-muted-foreground">Subscribers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-violet-500/10 p-3 text-violet-500">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCounts.appointments}</p>
              <p className="text-xs text-muted-foreground">Appointments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select website" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name} ({p._count.leads} leads)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="leads">
        <TabsList>
          <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
          <TabsTrigger value="subscribers">
            Subscribers ({subscribers.length})
          </TabsTrigger>
          <TabsTrigger value="appointments">
            Appointments ({appointments.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="leads">
          <Card>
            <CardContent className="p-0">
              {leads.length === 0 ? (
                <p className="p-6 text-center text-sm text-muted-foreground">
                  No leads yet
                </p>
              ) : (
                <div className="divide-y">
                  {leads.map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                        {lead.message && (
                          <p className="mt-1 text-sm">{lead.message}</p>
                        )}
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{lead.phone}</p>
                        <p>{formatDate(lead.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="subscribers">
          <Card>
            <CardContent className="p-0">
              {subscribers.length === 0 ? (
                <p className="p-6 text-center text-sm text-muted-foreground">
                  No subscribers yet
                </p>
              ) : (
                <div className="divide-y">
                  {subscribers.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-4">
                      <span className="font-medium">{sub.email}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(sub.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appointments">
          <Card>
            <CardContent className="p-0">
              {appointments.length === 0 ? (
                <p className="p-6 text-center text-sm text-muted-foreground">
                  No appointments yet
                </p>
              ) : (
                <div className="divide-y">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{apt.name}</p>
                        <p className="text-sm text-muted-foreground">{apt.email}</p>
                        {apt.message && (
                          <p className="mt-1 text-sm">{apt.message}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{apt.status}</Badge>
                        {apt.date && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatDate(apt.date)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
