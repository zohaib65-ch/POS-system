"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect, useMemo } from "react";
import { getAllJobs } from "@/app/actions/jobs/actions";

export interface JobTicket {
  id: string;
  jobId: string;
  customer: string;
  device: string;
  issue: string;
  amount: number;
  status: string;
}

import { InvoiceItem } from "@/types/Invoice";

interface JobTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTickets: (tickets: Array<InvoiceItem & { source: "job" }>) => void;
}

export default function JobTicketModal({
  open,
  onOpenChange,
  onSelectTickets,
}: JobTicketModalProps) {
  const [search, setSearch] = useState("");
  const [tickets, setTickets] = useState<JobTicket[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getAllJobs({}, 1, 100, "createdAt", "desc");
        if (res.success && Array.isArray(res.jobs)) {
          const mapped: JobTicket[] = res.jobs.map((j: any) => ({
            id: j._id?.toString?.() || j._id,
            customer: j.customerName,
            device: j.brand + (j.tvModel ? ` ${j.tvModel}` : ""),
            issue: j.problemDescription,
            amount: j.estimatedCost || j.actualCost || 0,
            status: j.status,
            jobId: j.jobId,
          }));
          setTickets(mapped);
        }
      } finally {
        setLoading(false);
      }
    };
    if (open) load();
  }, [open]);

  const filteredTickets = useMemo(() => {
    const q = search.toLowerCase();
    return tickets.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.customer.toLowerCase().includes(q) ||
        t.device.toLowerCase().includes(q)
    );
  }, [search, tickets]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addSelected = () => {
    const chosen = filteredTickets
      .filter((t) => selected[t.id])
      .map<InvoiceItem & { source: "job" }>((t) => ({
        id: t.id,
        name: `${t.customer} - ${t.device}`,
        quantity: 1,
        price: t.amount,
        source: "job",
      }));
    if (chosen.length > 0) {
      onSelectTickets(chosen);
      setSelected({});
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Link Job Ticket</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Input
            placeholder="Search job tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="max-h-96 p-2 overflow-y-auto space-y-1">
            {loading ? (
              <div className="text-center text-gray-400 py-4">Loading...</div>
            ) : filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className={`cursor-pointer hover:bg-gray-50 ${
                    selected[ticket.id] ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => toggleSelect(ticket.id)}
                >
                  <CardContent className="flex justify-between items-center gap-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={!!selected[ticket.id]}
                        onCheckedChange={() => toggleSelect(ticket.id)}
                      />
                      <div>
                        <div className="font-medium">{ticket.jobId}</div>
                        <div className="text-sm text-gray-500">
                          {ticket.customer} - {ticket.device}
                        </div>
                        <div className="text-xs text-gray-400">
                          {ticket.issue}
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div>৳ {ticket.amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        {ticket.status}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center text-gray-400 py-4">
                No tickets found
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={addSelected}
            disabled={Object.values(selected).every((v) => !v)}
          >
            Add Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
