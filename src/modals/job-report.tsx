"use client";
import type { JobTicket } from "@/types/jobTicket";
import { Badge } from "@/components/ui/badge";

interface JobReportProps {
  job: JobTicket;
}

const formatDate = (date: Date | string | undefined) => {
  if (!date) return "Not set";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
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

export default function JobReport({ job }: JobReportProps) {
  return (
    <div className="w-full bg-white p-8" style={{ maxWidth: "8.5in", margin: "0 auto" }}>
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .job-report { margin: 0; padding: 0; }
        }
        @page {
          size: A4;
          margin: 0.5in;
        }
      `}</style>

      <div className="job-report space-y-3 text-sm">
        <div className="border-b-2 flex justify-between items-center border-gray-800 pb-3">
          <h1 className="text-2xl font-bold text-gray-900">JOB REPAIR REPORT</h1>
          <span>{formatDate(job.createdAt)}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-gray-700">Customer Name</p>
            <p className="text-gray-900">{job.customerName}</p>
          </div>

          {job.email && (
            <div>
              <p className="font-semibold text-gray-700">Email</p>
              <p className="text-gray-900">{job.email}</p>
            </div>
          )}
          {job.address && (
            <div>
              <p className="font-semibold text-gray-700">Address</p>
              <p className="text-gray-900">{job.address}</p>
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-700">Job ID: </p>
            <p className="text-gray-900">{job.jobId}</p>
          </div>
        </div>

        <hr className="border-gray-300" />
        <div>
          <p className="font-bold text-gray-900 mb-2">DEVICE INFORMATION</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="font-semibold text-gray-700 text-xs">Brand</p>
              <p className="text-gray-900">{job.brand}</p>
            </div>
            {job.tvModel && (
              <div>
                <p className="font-semibold text-gray-700 text-xs">Model</p>
                <p className="text-gray-900">{job.tvModel}</p>
              </div>
            )}
            {job.screenSize && (
              <div>
                <p className="font-semibold text-gray-700 text-xs">Screen Size</p>
                <p className="text-gray-900">{job.screenSize}"</p>
              </div>
            )}
            {job.serialNumber && (
              <div className="col-span-3">
                <p className="font-semibold text-gray-700 text-xs">Serial Number</p>
                <p className="text-gray-900">{job.serialNumber}</p>
              </div>
            )}
          </div>
        </div>
        <hr className="border-gray-300" />
        <div>
          <p className="font-bold text-gray-900 mb-2">PROBLEM DETAILS</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-700 text-xs">Category</p>
              <p className="text-gray-900">{job.problemCategory?.replace(/-/g, " ")}</p>
            </div>
            <div className="mt-2">
              <p className="font-semibold text-gray-700 text-xs">Description</p>
              <p className="text-gray-900">{job.problemDescription}</p>
            </div>
          </div>
        </div>

        {(job.expectedDeliveryDate || job.actualDeliveryDate) && (
          <>
            <hr className="border-gray-300" />
            <div className="grid grid-cols-2 gap-4">
              {job.expectedDeliveryDate && (
                <div>
                  <p className="font-semibold text-gray-700 text-xs">Expected Delivery</p>
                  <p className="text-gray-900">{formatDate(job.expectedDeliveryDate)}</p>
                </div>
              )}
              {job.actualDeliveryDate && (
                <div>
                  <p className="font-semibold text-gray-700 text-xs">Actual Delivery</p>
                  <p className="text-gray-900">{formatDate(job.actualDeliveryDate)}</p>
                </div>
              )}
            </div>
          </>
        )}
        {(job.workCompleted || job.testingNotes) && (
          <>
            <hr className="border-gray-300" />
            <div>
              {job.workCompleted && (
                <div className="mb-3">
                  <p className="font-semibold text-gray-700 text-xs">Work Completed</p>
                  <p className="text-gray-900">{job.workCompleted}</p>
                </div>
              )}
              {job.testingNotes && (
                <div>
                  <p className="font-semibold text-gray-700 text-xs">Testing Notes</p>
                  <p className="text-gray-900">{job.testingNotes}</p>
                </div>
              )}
            </div>
          </>
        )}
        <div className="mt-8 pt-4 border-t-2 border-gray-800 text-center text-xs text-gray-600">
          <p>Report Generated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
