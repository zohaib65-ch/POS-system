"use server";

import dbConnect from "@/_components/db";
import Job, {
  IJob,
  JobStatus,
  JobPriority,
  TVBrand,
  ScreenSize,
  ProblemCategory,
} from "@/models/Job";
import Technician from "@/models/Technician";
import { Types } from "mongoose";

// Types for service functions
export interface CreateJobData {
  customerName: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  brand: string;
  tvModel?: string;
  screenSize?: string;
  serialNumber?: string;
  accessories?: string;
  problemCategory: string;
  problemDescription: string;
  technician?: string;
  expectedDeliveryDate?: Date;
  estimatedCost?: number;
  priority?: string;
}

export interface UpdateJobData {
  status?: string;
  priority?: string;
  customerName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  brand?: string;
  tvModel?: string;
  screenSize?: string;
  serialNumber?: string;
  accessories?: string;
  problemCategory?: string;
  problemDescription?: string;
  technician?: string;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  estimatedCost?: number;
  actualCost?: number;
  diagnosis?: string;
  partsRequired?: string[];
  workCompleted?: string;
  testingNotes?: string;
}

export interface JobFilters {
  status?: string;
  priority?: string;
  brand?: string;
  technician?: string;
  customerName?: string;
  phoneNumber?: string;
  jobId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  isOverdue?: boolean;
}

export interface JobStats {
  totalJobs: number;
  pendingJobs: number;
  inProgressJobs: number;
  completedJobs: number;
  overdueJobs: number;
  jobsByStatus: { [key: string]: number };
  jobsByPriority: { [key: string]: number };
  jobsByBrand: { [key: string]: number };
  averageCompletionTime: number;
  totalRevenue: number;
}

// Create a new job
export async function createJob(jobData: CreateJobData): Promise<IJob> {
  try {
    await dbConnect();
    console.log("Creating job with data:", jobData);

    // Generate unique jobId with retry logic
    let jobId: string;
    let attempts = 0;
    const maxAttempts = 5;

    do {
      const count = await Job.countDocuments();
      jobId = `JOB${String(count + 1 + attempts).padStart(6, "0")}`;

      // Check if jobId already exists
      const existingJob = await Job.findOne({ jobId });
      if (!existingJob) {
        break;
      }

      attempts++;
      if (attempts >= maxAttempts) {
        // Fallback to timestamp-based ID
        jobId = `JOB${Date.now().toString().slice(-6)}`;
        break;
      }
    } while (attempts < maxAttempts);

    console.log("Generated jobId:", jobId);

    // Helper function to safely convert to ObjectId
    const getValidTechnicianId = (technician: any) => {
      if (!technician) return undefined;

      // If it's already a valid ObjectId string
      if (
        typeof technician === "string" &&
        Types.ObjectId.isValid(technician)
      ) {
        return new Types.ObjectId(technician);
      }

      // If it's an object with _id
      if (
        typeof technician === "object" &&
        technician._id &&
        Types.ObjectId.isValid(technician._id)
      ) {
        return new Types.ObjectId(technician._id);
      }

      // If it's "unassigned" or invalid, return undefined
      return undefined;
    };

    const jobPayload = {
      ...jobData,
      jobId, // Explicitly set the jobId
      technician: getValidTechnicianId(jobData.technician),
    };
    const job = new Job(jobPayload);
    const savedJob = await job.save();

    // Return plain object instead of mongoose document
    return savedJob.toObject();
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
}

// Get all jobs with optional filtering and pagination
export async function getJobs(
  filters: JobFilters = {},
  page: number = 1,
  limit: number = 100,
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
): Promise<{ jobs: IJob[]; total: number; totalPages: number }> {
  await dbConnect();

  const query: any = {};

  // Apply filters
  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.brand) query.brand = filters.brand;
  if (filters.technician)
    query.technician = new Types.ObjectId(filters.technician);
  if (filters.customerName)
    query.customerName = { $regex: filters.customerName, $options: "i" };
  if (filters.phoneNumber)
    query.phoneNumber = { $regex: filters.phoneNumber, $options: "i" };
  if (filters.jobId) query.jobId = { $regex: filters.jobId, $options: "i" };

  // Date range filter
  if (filters.dateFrom || filters.dateTo) {
    query.createdAt = {};
    if (filters.dateFrom) query.createdAt.$gte = filters.dateFrom;
    if (filters.dateTo) query.createdAt.$lte = filters.dateTo;
  }

  // Overdue filter
  if (filters.isOverdue) {
    query.expectedDeliveryDate = { $lt: new Date() };
    query.status = { $nin: [JobStatus.COMPLETED, JobStatus.DELIVERED] };
  }

  const skip = (page - 1) * limit;
  const sortObj: any = {};
  sortObj[sortBy] = sortOrder === "asc" ? 1 : -1;

  const [jobs, total] = await Promise.all([
    Job.find(query)
      .populate("technician")
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean(),
    Job.countDocuments(query),
  ]);

  // Convert to plain objects to avoid serialization issues
  const plainJobs = jobs.map((job: any) => ({
    _id: job._id.toString(),
    jobId: job.jobId,
    status: job.status,
    priority: job.priority,
    customerName: job.customerName,
    phoneNumber: job.phoneNumber,
    email: job.email,
    address: job.address,
    brand: job.brand,
    tvModel: job.tvModel,
    screenSize: job.screenSize,
    serialNumber: job.serialNumber,
    accessories: job.accessories,
    problemCategory: job.problemCategory,
    problemDescription: job.problemDescription,
    technician: job.technician
      ? {
          _id: job.technician._id.toString(),
          name: job.technician.name,
          email: job.technician.email,
          specialization: job.technician.specialization,
        }
      : null,
    expectedDeliveryDate: job.expectedDeliveryDate,
    actualDeliveryDate: job.actualDeliveryDate,
    estimatedCost: job.estimatedCost,
    actualCost: job.actualCost,
    diagnosis: job.diagnosis,
    partsRequired: job.partsRequired,
    workCompleted: job.workCompleted,
    testingNotes: job.testingNotes,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    daysUntilDelivery: job.daysUntilDelivery,
    isOverdue: job.isOverdue,
  }));

  return {
    jobs: plainJobs as unknown as IJob[],
    total,
    totalPages: Math.ceil(total / limit),
  };
}

// Get a single job by ID
export async function getJobById(jobId: string): Promise<IJob | null> {
  await dbConnect();
  const job = await Job.findById(jobId).populate("technician").lean();
  return job as unknown as IJob | null;
}

// Get a single job by job ID (JOB000001)
export async function getJobByJobId(jobId: string): Promise<IJob | null> {
  await dbConnect();
  const job = await Job.findOne({ jobId }).populate("technician").lean();
  return job as unknown as IJob | null;
}

// Update a job
export async function updateJob(
  jobId: string,
  updateData: UpdateJobData
): Promise<IJob | null> {
  await dbConnect();

  // Helper function to safely convert to ObjectId
  const getValidTechnicianId = (technician: any) => {
    if (!technician) return undefined;

    // If it's already a valid ObjectId string
    if (typeof technician === "string" && Types.ObjectId.isValid(technician)) {
      return new Types.ObjectId(technician);
    }

    // If it's an object with _id
    if (
      typeof technician === "object" &&
      technician._id &&
      Types.ObjectId.isValid(technician._id)
    ) {
      return new Types.ObjectId(technician._id);
    }

    // If it's "unassigned" or invalid, return undefined
    return undefined;
  };

  const updatedJob = await Job.findByIdAndUpdate(
    jobId,
    {
      ...updateData,
      technician: getValidTechnicianId(updateData.technician),
    },
    { new: true, runValidators: true }
  ).populate("technician");

  return updatedJob;
}

// Update job status
export async function updateJobStatus(
  jobId: string,
  status: string
): Promise<IJob | null> {
  await dbConnect();

  const updateData: any = { status };

  // If marking as completed or delivered, set actual delivery date
  if (status === JobStatus.COMPLETED || status === JobStatus.DELIVERED) {
    updateData.actualDeliveryDate = new Date();
  }

  const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
    new: true,
    runValidators: true,
  }).populate("technician");

  return updatedJob;
}

// Delete a job
export async function deleteJob(jobId: string): Promise<boolean> {
  await dbConnect();
  const result = await Job.findByIdAndDelete(jobId);
  return !!result;
}

// Get jobs assigned to a specific technician
export async function getJobsByTechnician(
  technicianId: string,
  status?: string
): Promise<IJob[]> {
  await dbConnect();

  const query: any = { technician: new Types.ObjectId(technicianId) };
  if (status) query.status = status;

  const jobs = await Job.find(query)
    .populate("technician")
    .sort({ createdAt: -1 })
    .lean();

  return jobs as unknown as IJob[];
}

// Get overdue jobs
export async function getOverdueJobs(): Promise<IJob[]> {
  await dbConnect();

  const jobs = await Job.find({
    expectedDeliveryDate: { $lt: new Date() },
    status: { $nin: [JobStatus.COMPLETED, JobStatus.DELIVERED] },
  })
    .populate("technician")
    .sort({ expectedDeliveryDate: 1 })
    .lean();

  return jobs as unknown as IJob[];
}

// Get jobs by status
export async function getJobsByStatus(status: string): Promise<IJob[]> {
  await dbConnect();

  const jobs = await Job.find({ status })
    .populate("technician")
    .sort({ createdAt: -1 })
    .lean();

  return jobs as unknown as IJob[];
}

// Get jobs by priority
export async function getJobsByPriority(priority: string): Promise<IJob[]> {
  await dbConnect();

  const jobs = await Job.find({ priority })
    .populate("technician")
    .sort({ createdAt: -1 })
    .lean();

  return jobs as unknown as IJob[];
}

// Search jobs
export async function searchJobs(searchTerm: string): Promise<IJob[]> {
  await dbConnect();

  const searchRegex = { $regex: searchTerm, $options: "i" };

  const jobs = await Job.find({
    $or: [
      { jobId: searchRegex },
      { customerName: searchRegex },
      { phoneNumber: searchRegex },
      { email: searchRegex },
      { brand: searchRegex },
      { tvModel: searchRegex },
      { serialNumber: searchRegex },
      { problemDescription: searchRegex },
      { diagnosis: searchRegex },
    ],
  })
    .populate("technician")
    .sort({ createdAt: -1 })
    .lean();

  // Convert to plain objects to avoid serialization issues
  return jobs.map((job: any) => ({
    _id: job._id.toString(),
    jobId: job.jobId,
    status: job.status,
    priority: job.priority,
    customerName: job.customerName,
    phoneNumber: job.phoneNumber,
    email: job.email,
    address: job.address,
    brand: job.brand,
    tvModel: job.tvModel,
    screenSize: job.screenSize,
    serialNumber: job.serialNumber,
    accessories: job.accessories,
    problemCategory: job.problemCategory,
    problemDescription: job.problemDescription,
    technician: job.technician
      ? {
          _id: job.technician._id.toString(),
          name: job.technician.name,
          email: job.technician.email,
          specialization: job.technician.specialization,
        }
      : null,
    expectedDeliveryDate: job.expectedDeliveryDate,
    actualDeliveryDate: job.actualDeliveryDate,
    estimatedCost: job.estimatedCost,
    actualCost: job.actualCost,
    diagnosis: job.diagnosis,
    partsRequired: job.partsRequired,
    workCompleted: job.workCompleted,
    testingNotes: job.testingNotes,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    daysUntilDelivery: job.daysUntilDelivery,
    isOverdue: job.isOverdue,
  })) as unknown as IJob[];
}

// Get job statistics
export async function getJobStats(): Promise<JobStats> {
  await dbConnect();

  const [
    totalJobs,
    statusStats,
    priorityStats,
    brandStats,
    overdueJobs,
    completedJobs,
    revenueData,
  ] = await Promise.all([
    Job.countDocuments(),
    Job.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Job.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]),
    Job.aggregate([{ $group: { _id: "$brand", count: { $sum: 1 } } }]),
    Job.countDocuments({
      expectedDeliveryDate: { $lt: new Date() },
      status: { $nin: [JobStatus.COMPLETED, JobStatus.DELIVERED] },
    }),
    Job.find({ status: { $in: [JobStatus.COMPLETED, JobStatus.DELIVERED] } })
      .select("createdAt actualDeliveryDate actualCost")
      .lean(),
    Job.aggregate([
      {
        $match: { actualCost: { $exists: true, $ne: null } },
      },
      {
        $group: { _id: null, totalRevenue: { $sum: "$actualCost" } },
      },
    ]),
  ]);

  // Calculate averages
  let averageCompletionTime = 0;
  if (completedJobs.length > 0) {
    const totalDays = completedJobs.reduce((sum, job: any) => {
      if (job.actualDeliveryDate && job.createdAt) {
        const diffTime =
          new Date(job.actualDeliveryDate).getTime() -
          new Date(job.createdAt).getTime();
        return sum + Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
      return sum;
    }, 0);
    averageCompletionTime = totalDays / completedJobs.length;
  }

  // Format stats
  const jobsByStatus: { [key: string]: number } = {};
  statusStats.forEach((stat) => {
    jobsByStatus[stat._id] = stat.count;
  });

  const jobsByPriority: { [key: string]: number } = {};
  priorityStats.forEach((stat) => {
    jobsByPriority[stat._id] = stat.count;
  });

  const jobsByBrand: { [key: string]: number } = {};
  brandStats.forEach((stat) => {
    jobsByBrand[stat._id] = stat.count;
  });

  return {
    totalJobs,
    pendingJobs: jobsByStatus[JobStatus.PENDING] || 0,
    inProgressJobs: jobsByStatus[JobStatus.IN_PROGRESS] || 0,
    completedJobs: jobsByStatus[JobStatus.COMPLETED] || 0,
    overdueJobs,
    jobsByStatus,
    jobsByPriority,
    jobsByBrand,
    averageCompletionTime,
    totalRevenue: revenueData[0]?.totalRevenue || 0,
  };
}

// Get recent jobs
export async function getRecentJobs(limit: number = 10): Promise<IJob[]> {
  await dbConnect();

  const jobs = await Job.find()
    .populate("technician")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return jobs as unknown as IJob[];
}

// Update job diagnosis
export async function updateJobDiagnosis(
  jobId: string,
  diagnosis: string,
  partsRequired?: string[]
): Promise<IJob | null> {
  await dbConnect();

  const updateData: any = { diagnosis };
  if (partsRequired) updateData.partsRequired = partsRequired;

  const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
    new: true,
    runValidators: true,
  }).populate("technician");

  return updatedJob;
}

// Update job work progress
export async function updateJobWorkProgress(
  jobId: string,
  workCompleted: string,
  testingNotes?: string
): Promise<IJob | null> {
  await dbConnect();

  const updateData: any = { workCompleted };
  if (testingNotes) updateData.testingNotes = testingNotes;

  const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
    new: true,
    runValidators: true,
  }).populate("technician");

  return updatedJob;
}

// Assign technician to job
export async function assignTechnicianToJob(
  jobId: string,
  technicianId: string
): Promise<IJob | null> {
  await dbConnect();

  const updatedJob = await Job.findByIdAndUpdate(
    jobId,
    {
      technician: new Types.ObjectId(technicianId),
      status: JobStatus.IN_PROGRESS,
    },
    { new: true, runValidators: true }
  ).populate("technician");

  return updatedJob;
}

// Get jobs by date range
export async function getJobsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<IJob[]> {
  await dbConnect();

  const jobs = await Job.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  })
    .populate("technician")
    .sort({ createdAt: -1 })
    .lean();

  return jobs as unknown as IJob[];
}

// Get jobs requiring parts
export async function getJobsRequiringParts(): Promise<IJob[]> {
  await dbConnect();

  const jobs = await Job.find({
    status: JobStatus.PARTS_ORDERED,
    partsRequired: { $exists: true, $not: { $size: 0 } },
  })
    .populate("technician")
    .sort({ createdAt: -1 })
    .lean();

  return jobs as unknown as IJob[];
}

// Update job cost
export async function updateJobCost(
  jobId: string,
  estimatedCost?: number,
  actualCost?: number
): Promise<IJob | null> {
  await dbConnect();

  const updateData: any = {};
  if (estimatedCost !== undefined) updateData.estimatedCost = estimatedCost;
  if (actualCost !== undefined) updateData.actualCost = actualCost;

  const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
    new: true,
    runValidators: true,
  }).populate("technician");

  return updatedJob;
}

// Get jobs by customer
export async function getJobsByCustomer(
  customerName?: string,
  phoneNumber?: string
): Promise<IJob[]> {
  await dbConnect();

  const query: any = {};
  if (customerName)
    query.customerName = { $regex: customerName, $options: "i" };
  if (phoneNumber) query.phoneNumber = phoneNumber;

  const jobs = await Job.find(query)
    .populate("technician")
    .sort({ createdAt: -1 })
    .lean();

  return jobs as unknown as IJob[];
}

// Get job history for dashboard
export async function getJobHistoryForDashboard(): Promise<{
  todayJobs: number;
  weekJobs: number;
  monthJobs: number;
  dailyStats: { date: string; count: number }[];
}> {
  await dbConnect();

  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [todayJobs, weekJobs, monthJobs, dailyStats] = await Promise.all([
    Job.countDocuments({ createdAt: { $gte: startOfToday } }),
    Job.countDocuments({ createdAt: { $gte: startOfWeek } }),
    Job.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Job.aggregate([
      {
        $match: { createdAt: { $gte: startOfWeek } },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]),
  ]);

  const formattedDailyStats = dailyStats.map((stat) => ({
    date: `${stat._id.year}-${String(stat._id.month).padStart(2, "0")}-${String(
      stat._id.day
    ).padStart(2, "0")}`,
    count: stat.count,
  }));

  return {
    todayJobs,
    weekJobs,
    monthJobs,
    dailyStats: formattedDailyStats,
  };
}
