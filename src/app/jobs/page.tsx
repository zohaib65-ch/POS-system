"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import DataTable from "@/components/ui/DataTable";
import CreateJobModal from "@/modals/create-job-modal";
import ViewJobModal from "@/modals/ViewJobModal";
import DeleteModal from "@/modals/DeleteModal";
import QRCodeModal from "@/modals/QRCodeModal"; 
import type { JobTicket } from "@/types/jobTicket";
import { createJobColumns } from "@/components/columns/jobColumns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getTechnicians } from "../actions/technician/actions";
import { getAllJobs, searchJobsAction, deleteJobAction } from "../actions/jobs/actions";
import { TechnicianData } from "@/services/technicianService";
import { JobFilters } from "@/services/jobService";
import DateRangeField from "@/components/ui/DateRangeField";
import { DateRange } from "react-day-picker";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "diagnosis", label: "Diagnosis" },
  { value: "parts-ordered", label: "Parts Ordered" },
  { value: "repairing", label: "Repairing" },
  { value: "testing", label: "Testing" },
  { value: "completed", label: "Completed" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const brandOptions = [
  { value: "samsung", label: "Samsung" },
  { value: "lg", label: "LG" },
  { value: "sony", label: "Sony" },
  { value: "panasonic", label: "Panasonic" },
  { value: "sharp", label: "Sharp" },
];

export default function JobsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobTicket | null>(null);
  const [editingJob, setEditingJob] = useState<JobTicket | null>(null);
  const [jobToDelete, setJobToDelete] = useState<JobTicket | null>(null);
  const [selectedJobForQR, setSelectedJobForQR] = useState<JobTicket | null>(null); 
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [statusFilter, setStatusFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [technicianFilter, setTechnicianFilter] = useState("all");
  const [jobs, setJobs] = useState<JobTicket[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianData[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const jobsPerPage = 20;
  const fetchTechnicians = async () => {
    try {
      const data = await getTechnicians();
      setTechnicians(data);
    } catch (e) {
      console.error("Failed to fetch technicians:", e);
    }
  };

  const fetchJobs = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    else setFetching(true);

    try {
      setError(null);

      if (searchTerm.trim()) {
        const res = await searchJobsAction(searchTerm.trim());
        if (res.success) {
          setJobs(res.jobs as JobTicket[]);
          setTotalJobs(res.jobs.length);
          setTotalPages(Math.ceil(res.jobs.length / jobsPerPage));
        }
        return;
      }

      const filters: JobFilters = {};
      if (statusFilter !== "all") filters.status = statusFilter;
      if (brandFilter !== "all") filters.brand = brandFilter;
      if (technicianFilter !== "all") {
        if (technicianFilter === "unassigned") {
          filters.technician = undefined;
        } else {
          const tech = technicians.find((t) => t.name === technicianFilter);
          if (tech) filters.technician = tech._id!;
        }
      }
      if (dateRange?.from) filters.dateFrom = dateRange.from;
      if (dateRange?.to) filters.dateTo = dateRange.to;

      const res = await getAllJobs(filters, currentPage, jobsPerPage, "createdAt", "desc");
      if (res.success) {
        setJobs(res.jobs as JobTicket[]);
        setTotalJobs(res.total);
        setTotalPages(res.totalPages);
      } else {
        setError("Failed to fetch jobs");
      }
    } catch (e) {
      console.error(e);
      setError("Failed to fetch jobs");
    } finally {
      if (isInitial) setLoading(false);
      else setFetching(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
    fetchJobs(true);
  }, []);

  useEffect(() => {
    const needTech = technicianFilter !== "all" && technicianFilter !== "unassigned";
    if (!needTech || technicians.length > 0) fetchJobs(false);
  }, [searchTerm, statusFilter, brandFilter, technicianFilter, currentPage, dateRange]);

  useEffect(() => setCurrentPage(1), [searchTerm, statusFilter, brandFilter, technicianFilter, dateRange]);
  const handleRetryFetch = () => fetchJobs();
  const handleSearch = (v: string) => setSearchTerm(v);
  const handlePageChange = (p: number) => setCurrentPage(p);

  const handleViewJob = (job: JobTicket) => {
    setSelectedJob(job);
    setIsViewModalOpen(true);
  };

  const handleEditJob = (job: JobTicket) => {
    setEditingJob(job);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingJob(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleDeleteJob = (job: JobTicket) => {
    setJobToDelete(job);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;
    const res = await deleteJobAction(jobToDelete._id);
    if (res.success) {
      fetchJobs();
      setJobToDelete(null);
      setIsDeleteModalOpen(false);
    } else {
      alert("Failed to delete job: " + res.error);
    }
  };

  const handleQRCode = (job: JobTicket) => {
    setSelectedJobForQR(job);
    setIsQRModalOpen(true);
  };

  const jobColumns = createJobColumns(handleViewJob, handleEditJob, handleQRCode, handleDeleteJob);

  const LoadingSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-6">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) return <LoadingSkeleton />;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Job Tickets</h1>
            <p className="text-gray-600 mt-1 sm:mt-2">Manage TV repair jobs from start to finish</p>
            <p className="text-sm text-gray-500 mt-1">Total: {totalJobs} jobs</p>
          </div>
          <Button onClick={openCreateModal} className="w-full sm:w-auto">
            Create New Job
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label>Search</Label>
              <Input placeholder="Job ID, Customer, Phone..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Brand</Label>
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brandOptions.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Technician</Label>
              <Select value={technicianFilter} onValueChange={setTechnicianFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technicians</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {technicians
                    .filter((t) => t.isActive)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((t) => (
                      <SelectItem key={t._id} value={t.name}>
                        {t.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <DateRangeField value={dateRange} onChange={setDateRange} />
            </div>
          </div>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <Button variant="outline" size="sm" onClick={handleRetryFetch} className="mt-2">
              Retry
            </Button>
          </div>
        )}
        <Card className="space-y-4 gap-0 relative">
          {fetching && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
              <p className="text-gray-600 text-sm">Updating...</p>
            </div>
          )}

          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Job Ticket History</h3>
            </div>
          </CardHeader>

          <CardContent>
            <DataTable columns={jobColumns} data={jobs} />
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <CreateJobModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={async () => {
          await fetchJobs(false);
        }}
        jobToEdit={editingJob}
        mode={modalMode}
      />

      <ViewJobModal open={isViewModalOpen} onOpenChange={setIsViewModalOpen} job={selectedJob} />
      <DeleteModal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} onConfirm={confirmDeleteJob} title="Delete Job?" description="Do you want to delete this job" />
      <QRCodeModal open={isQRModalOpen} onOpenChange={setIsQRModalOpen} job={selectedJobForQR} />
    </div>
  );
}
