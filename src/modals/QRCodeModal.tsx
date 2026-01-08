"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import QRCode from "react-qr-code";
import { JobTicket } from "@/types/jobTicket";

interface QRCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobTicket | null;
}

export default function QRCodeModal({ open, onOpenChange, job }: QRCodeModalProps) {
  if (!job) return null;

  const receiptText = `
REPAIR JOB RECEIPT
Job ID: ${job.jobId}

CUSTOMER
  Name: ${job.customerName}

DEVICE
  Brand: ${job.brand.toUpperCase()}
  Model: ${job.tvModel || "—"}
  Size: ${job.screenSize ? job.screenSize + '"' : "—"}

PROBLEM
  Category: ${job.problemCategory.replace(/-/g, " ")}
  Issue: ${job.problemDescription || "—"}

STATUS
  Current: ${job.status
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")}
  ${job.isOverdue ? "Overdue: Yes" : ""}

TECHNICIAN
  Assigned: ${job.technician?.name || "Unassigned"}

DATE
  Created: ${new Date(job.createdAt).toLocaleDateString("en-GB")}

Thank you for trusting us!
`.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md p-4 gap-0 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-lg sm:text-xl">QR Receipt – {job.jobId}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-5 py-4">
          <div className="w-full max-w-[280px] p-3 bg-white rounded-lg shadow-sm">
            <QRCode value={receiptText} size={256} level="M" className="w-full h-auto" />
          </div>
          <div className="text-center space-y-1 text-sm sm:text-base text-gray-600">
            <p>Scan to view receipt</p>
            <p className="font-medium">{job.customerName}</p>
            <p className="text-xs sm:text-sm">
              {job.brand.toUpperCase()} {job.tvModel}
            </p>
          </div>
          <Button variant="default" size="sm" onClick={() => window.print()} className="w-full">
            Print QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
