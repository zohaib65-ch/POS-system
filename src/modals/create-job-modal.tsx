"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { getTechnicians } from "@/app/actions/technician/actions";
import { addJobTicket, updateJobTicket } from "@/app/actions/jobs/actions";
import { JobStatus } from "@/models/Job";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobTicketFormData, jobTicketSchema } from "@/lib/validations/jobTicketValidation";
import type { JobTicket, Technician } from "@/types/jobTicket";

interface CreateJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (jobData: Omit<JobTicket, "_id" | "createdAt" | "updatedAt">) => void;
  jobToEdit?: JobTicket | null;
  mode?: "create" | "edit";
}
import { useMemo } from "react";
import { Brand, ScreenSize, ProblemCategory } from "@/lib/validations/jobTicketValidation";

const brands = ["samsung", "lg", "sony", "panasonic", "sharp"] as const;
const screenSizes = ["32", "42", "50", "55", "65"] as const;
const problemCategories = ["no-power", "no-picture", "no-sound", "screen-damage", "connectivity"] as const;
const statusOptions = [
  { value: JobStatus.PENDING, label: "Pending" },
  { value: JobStatus.IN_PROGRESS, label: "In Progress" },
  { value: JobStatus.DIAGNOSIS, label: "Diagnosis" },
  { value: JobStatus.PARTS_ORDERED, label: "Parts Ordered" },
  { value: JobStatus.REPAIRING, label: "Repairing" },
  { value: JobStatus.TESTING, label: "Testing" },
  { value: JobStatus.COMPLETED, label: "Completed" },
  { value: JobStatus.DELIVERED, label: "Delivered" },
  { value: JobStatus.CANCELLED, label: "Cancelled" },
];

export default function CreateJobModal({ open, onOpenChange, onSubmit, jobToEdit = null, mode = "create" }: CreateJobModalProps) {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTechnicians, setIsLoadingTechnicians] = useState(false);

  const defaultValues = useMemo(
    () => ({
      customerName: "",
      phoneNumber: "",
      email: "",
      address: "",
      brand: brands[0],
      tvModel: "",
      screenSize: screenSizes[0],
      serialNumber: "",
      accessories: "",
      problemCategory: problemCategories[0],
      problemDescription: "",
      technician: "unassigned",
      expectedDeliveryDate: "",
      estimatedCost: "",
      status: JobStatus.PENDING,
    }),
    []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<JobTicketFormData>({
    resolver: zodResolver(jobTicketSchema),
    defaultValues,
  });

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const data = await getTechnicians();
        setTechnicians(
          data.map((t) => ({
            _id: t._id || "",
            name: t.name || "",
            isActive: t.isActive || false,
          }))
        );
      } catch {
        toast.error("Failed to fetch technicians");
      } finally {
        setIsLoadingTechnicians(false);
      }
    };
    if (open) fetchTechnicians();
  }, [open]);

  useEffect(() => {
    if (mode === "edit" && jobToEdit) {
      reset({
        customerName: jobToEdit.customerName || "",
        phoneNumber: jobToEdit.phoneNumber || "",
        email: jobToEdit.email || "",
        address: jobToEdit.address || "",
        brand: (jobToEdit.brand?.toLowerCase() || brands[0]) as Brand,
        tvModel: jobToEdit.tvModel || "",
        screenSize: (jobToEdit.screenSize || screenSizes[0]) as ScreenSize,
        serialNumber: jobToEdit.serialNumber || "",
        accessories: jobToEdit.accessories || "",
        problemCategory: (jobToEdit.problemCategory?.toLowerCase() || problemCategories[0]) as ProblemCategory,
        problemDescription: jobToEdit.problemDescription || "",
        technician: jobToEdit.technician?._id || "unassigned",
        expectedDeliveryDate: jobToEdit.expectedDeliveryDate ? format(new Date(jobToEdit.expectedDeliveryDate), "yyyy-MM-dd") : "",
        estimatedCost: jobToEdit.estimatedCost?.toString() || "",
        status: jobToEdit.status || JobStatus.PENDING,
      });
      if (jobToEdit.expectedDeliveryDate) setSelectedDate(new Date(jobToEdit.expectedDeliveryDate));
    } else if (mode === "create") {
      reset(defaultValues);
      setSelectedDate(undefined);
    }
  }, [jobToEdit, mode, open, reset, defaultValues]);

  const onSubmitForm = async (data: JobTicketFormData) => {
    setIsSubmitting(true);
    try {
      const selectedTechnician = technicians.find((t) => t._id === data.technician);

      const jobData = {
        ...data,
        expectedDeliveryDate: data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate) : undefined,
        estimatedCost: data.estimatedCost ? parseFloat(data.estimatedCost) : undefined,
        technician: data.technician !== "unassigned" ? data.technician : undefined,
      };

      if (mode === "edit" && jobToEdit) {
        await updateJobTicket(jobToEdit._id, jobData);
        toast.success("Job updated successfully!");
      } else {
        await addJobTicket(jobData);
        toast.success("Job created successfully!");
      }

      // Transform data for the parent component to match JobTicket type
      const transformedData = {
        ...jobData,
        technician:
          selectedTechnician && data.technician !== "unassigned"
            ? {
                _id: selectedTechnician._id,
                name: selectedTechnician.name,
              }
            : undefined,
      };

      onSubmit(transformedData);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${mode === "edit" ? "update" : "create"} job`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-4xl!">
        <DialogHeader className="bg-primary text-primary-foreground p-4 rounded-lg">
          <DialogTitle>{mode === "edit" ? "Edit Job Ticket" : "Create Job Ticket"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 p-4">
          {/* Customer Info */}
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <div>
              <Label>Customer Name *</Label>
              <Input {...register("customerName")} placeholder="Enter name" />
              {errors.customerName && <p className="text-red-600 text-sm mt-1">{errors.customerName.message}</p>}
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input {...register("phoneNumber")} placeholder="Enter phone" />
              {errors.phoneNumber && <p className="text-red-600 text-sm mt-1">{errors.phoneNumber.message}</p>}
            </div>
            <div>
              <Label>Email</Label>
              <Input {...register("email")} placeholder="Enter email" />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label>Address</Label>
              <Input {...register("address")} placeholder="Enter address" />
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>}
            </div>
          </div>

          {/* TV Info */}
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <div>
              <Label>Brand *</Label>
              <Select value={watch("brand")} onValueChange={(val: Brand) => setValue("brand", val, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.brand && <p className="text-red-600 text-sm mt-1">{errors.brand.message}</p>}
            </div>
            <div>
              <Label>Model</Label>
              <Input {...register("tvModel")} placeholder="Enter model" />
              {errors.tvModel && <p className="text-red-600 text-sm mt-1">{errors.tvModel.message}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-4">
            <div>
              <Label>Screen Size *</Label>
              <Select value={watch("screenSize")} onValueChange={(val: ScreenSize) => setValue("screenSize", val, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Screen Size" />
                </SelectTrigger>
                <SelectContent>
                  {screenSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size} inch
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.screenSize && <p className="text-red-600 text-sm mt-1">{errors.screenSize.message}</p>}
            </div>
            <div>
              <Label>Problem Category *</Label>
              <Select value={watch("problemCategory")} onValueChange={(val: ProblemCategory) => setValue("problemCategory", val, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {problemCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.problemCategory && <p className="text-red-600 text-sm mt-1">{errors.problemCategory.message}</p>}
            </div>
          </div>

          <div className="mt-4">
            <Label>Problem Description *</Label>
            <Textarea {...register("problemDescription")} placeholder="Describe problem" />
            {errors.problemDescription && <p className="text-red-600 text-sm mt-1">{errors.problemDescription.message}</p>}
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-4">
            <div>
              <Label>Expected Delivery Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full text-left">
                    {selectedDate ? format(selectedDate, "yyyy-MM-dd") : "Select Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date || undefined);
                      setValue("expectedDeliveryDate", date ? format(date, "yyyy-MM-dd") : "", { shouldValidate: true });
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Assign Technician</Label>
              <Select value={watch("technician")} onValueChange={(val) => setValue("technician", val, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Technician" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {technicians
                    .filter((t) => t.isActive)
                    .map((t) => (
                      <SelectItem key={t._id} value={t._id}>
                        {t.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-4">
            <div>
              <Label>Job Status</Label>
              <Select value={watch("status")} onValueChange={(val) => setValue("status", val as JobStatus, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Estimated Cost (BDT)</Label>
              <Input type="number" {...register("estimatedCost")} placeholder="0.00" />
              {errors.estimatedCost && <p className="text-red-600 text-sm mt-1">{errors.estimatedCost.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (mode === "edit" ? "Updating..." : "Creating...") : mode === "edit" ? "Update Job Ticket" : "Create Job Ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
