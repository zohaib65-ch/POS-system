"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { JobTicket } from "@/types/jobTicket";
import { User, Phone, Mail, MapPin, Monitor, Wrench, Calendar, DollarSign, AlertTriangle, CheckCircle, Package, FileText, User2, Printer } from "lucide-react";
import { useRef } from "react";
import JobReport from "./job-report";

interface ViewJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobTicket | null;
}

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case "urgent":
      return "bg-red-100 text-red-800 border-red-200";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "in-progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatStatus = (status: string) => {
  return status
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (date: Date | string | undefined) => {
  if (!date) return "Not set";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || amount === null) return "Not set";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function ViewJobModal({ open, onOpenChange, job }: ViewJobModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow && job) {
      const reportContent = document.getElementById("job-report-print")?.innerHTML || "";
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Job-${job.jobId}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @page { size: A4; margin: 0.5in; }
              body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${reportContent}
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto !max-w-3xl">
        <DialogHeader className="pb-4 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">Job Details</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">Complete information for this repair job</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Badge className={`px-3 py-1 font-medium border ${getStatusColor(job.status)}`}>{formatStatus(job.status)}</Badge>
              {job.priority && <Badge className={`px-3 py-1 font-medium border ${getPriorityColor(job.priority)}`}>{job.priority?.toUpperCase()}</Badge>}
              {job.isOverdue && (
                <Badge className="px-3 py-1 font-medium border bg-red-100 text-red-800 border-red-200">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Overdue
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div ref={printRef} className="space-y-6 p-8 print-content" style={{ fontSize: "11px" }}>
          <div className="hidden print:block mb-2">
            <h1 className="text-xl font-bold text-gray-900">Job Report</h1>
            <p className="text-xs text-gray-600">Job ID: {job.jobId}</p>
          </div>

          <Card className="gap-2 print:break-inside-avoid">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Job Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Job ID</label>
                  <p className="font-mono text-base font-semibold text-gray-900">{job.jobId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created Date</label>
                  <p className="font-mono text-base font-semibold text-gray-900">{formatDate(job.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="font-mono text-base font-semibold text-gray-900">{formatDate(job.updatedAt)}</p>
                </div>
                {job.daysUntilDelivery !== undefined && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Days Until Delivery</label>
                    <p className={`font-medium ${job.daysUntilDelivery < 0 ? "text-red-600" : job.daysUntilDelivery <= 2 ? "text-yellow-600" : "text-green-600"}`}>
                      {job.daysUntilDelivery < 0 ? `${Math.abs(job.daysUntilDelivery)} days overdue` : `${job.daysUntilDelivery} days remaining`}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="gap-2 print:break-inside-avoid">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="font-mono text-base font-semibold text-gray-900">{job.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="font-mono text-base font-semibold text-gray-900">{job.phoneNumber}</p>
                  </div>
                </div>
                {job.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="font-mono text-base font-semibold text-gray-900">{job.email}</p>
                    </div>
                  </div>
                )}
                {job.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="font-mono text-base font-semibold text-gray-900">{job.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="gap-2 print:break-inside-avoid">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Device Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Brand</label>
                  <p className="text-gray-900 font-medium uppercase">{job.brand}</p>
                </div>
                {job.tvModel && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Model</label>
                    <p className="font-mono text-base font-semibold text-gray-900">{job.tvModel}</p>
                  </div>
                )}
                {job.screenSize && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Screen Size</label>
                    <p className="font-mono text-base font-semibold text-gray-900">{job.screenSize}"</p>
                  </div>
                )}
                {job.serialNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Serial Number</label>
                    <p className="font-mono text-base font-semibold text-gray-900">{job.serialNumber}</p>
                  </div>
                )}
                {job.accessories && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Accessories</label>
                    <p className="font-mono text-base font-semibold text-gray-900">{job.accessories}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="gap-2 print:break-inside-avoid">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Problem Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-500">Problem Category</label>
                  <p className="font-mono text-base font-semibold text-gray-900">{job.problemCategory?.replace(/-/g, " ")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Problem Description</label>
                  <p className="font-mono text-base font-semibold text-gray-900">{job.problemDescription}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="gap-2 print:break-inside-avoid">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <User2 className="w-5 h-5" />
                Assignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Assigned Technician</label>
                  <div className="flex items-center gap-2 mt-1">
                    {job.technician ? (
                      <>
                        <div>
                          <p className="font-mono text-base font-semibold text-gray-900">{job.technician.name}</p>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User2 className="w-4 h-4 text-gray-400" />
                        </div>
                        <span>Unassigned</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gap-2 print:break-inside-avoid">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {job.expectedDeliveryDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Expected Delivery</label>
                    <p className="flex items-center gap-2 font-mono text-base font-semibold text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(job.expectedDeliveryDate)}
                    </p>
                  </div>
                )}
                {job.actualDeliveryDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Actual Delivery</label>
                    <p className="text-gray-900 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {formatDate(job.actualDeliveryDate)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="gap-2 print:break-inside-avoid">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Cost Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Estimated Cost</label>
                  <p className="font-mono text-base font-semibold text-gray-900">{formatCurrency(job.estimatedCost)}</p>
                </div>
                {job.actualCost && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Actual Cost</label>
                    <p className="font-mono text-base font-semibold text-gray-900">{formatCurrency(job.actualCost)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {(job.partsRequired?.length || job.workCompleted || job.testingNotes) && (
            <Card className="gap-2 print:break-inside-avoid">
              <CardHeader className="py-2 px-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Work Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {job.partsRequired && job.partsRequired.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Parts Required</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {job.partsRequired.map((part: string, index: number) => (
                          <Badge key={index} className="bg-orange-50 text-orange-700 border-orange-200">
                            {part}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {job.workCompleted && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Work Completed</label>
                      <p className="text-gray-900 bg-green-50 p-3 rounded-lg">{job.workCompleted}</p>
                    </div>
                  )}
                  {job.testingNotes && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Testing Notes</label>
                      <p className="text-gray-900 bg-purple-50 p-3 rounded-lg">{job.testingNotes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <div id="job-report-print" className="hidden">
          <JobReport job={job} />
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t print:hidden">
          <Button variant="outline" onClick={handlePrint} className="gap-2 bg-transparent">
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
