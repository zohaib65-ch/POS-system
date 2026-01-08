"use server";

import {
  createJob,
  CreateJobData,
  updateJob,
  UpdateJobData,
  getJobs,
  getJobById,
  getJobByJobId,
  getJobsByStatus,
  getJobsByTechnician,
  getOverdueJobs,
  getRecentJobs,
  getJobStats,
  searchJobs,
  deleteJob, // <-- make sure your service exports this
  JobFilters,
} from "@/services/jobService";

// Add a new job
export async function addJobTicket(jobData: CreateJobData) {
  try {
    console.log("Action received job data:", jobData);
    const createdJob = await createJob(jobData);
    console.log("Action created job:", createdJob.jobId);
    return { success: true };
  } catch (error) {
    console.error("Error in addJobTicket action:", error);
    throw error;
  }
}

// Update an existing job
export async function updateJobTicket(jobId: string, jobData: UpdateJobData) {
  try {
    console.log("Action received update data for job:", jobId, jobData);
    const updatedJob = await updateJob(jobId, jobData);
    console.log("Action updated job:", updatedJob?.jobId);
    return { success: true };
  } catch (error) {
    console.error("Error in updateJobTicket action:", error);
    throw error;
  }
}

// Get all jobs with optional filtering and pagination
export async function getAllJobs(
  filters: JobFilters = {},
  page: number = 1,
  limit: number = 100,
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
) {
  try {
    const result = await getJobs(filters, page, limit, sortBy, sortOrder);
    return {
      success: true,
      jobs: result.jobs,
      total: result.total,
      totalPages: result.totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error in getAllJobs action:", error);
    throw error;
  }
}

// Get a single job by MongoDB ID
export async function getJobByIdAction(jobId: string) {
  try {
    const job = await getJobById(jobId);
    return { success: true, job };
  } catch (error) {
    console.error("Error in getJobByIdAction:", error);
    throw error;
  }
}

// Get a single job by job ID (e.g., JOB000001)
export async function getJobByJobIdAction(jobId: string) {
  try {
    const job = await getJobByJobId(jobId);
    return { success: true, job };
  } catch (error) {
    console.error("Error in getJobByJobIdAction:", error);
    throw error;
  }
}

// Get jobs by status
export async function getJobsByStatusAction(status: string) {
  try {
    const jobs = await getJobsByStatus(status);
    return { success: true, jobs };
  } catch (error) {
    console.error("Error in getJobsByStatusAction:", error);
    throw error;
  }
}

// Get jobs assigned to a specific technician
export async function getJobsByTechnicianAction(
  technicianId: string,
  status?: string
) {
  try {
    const jobs = await getJobsByTechnician(technicianId, status);
    return { success: true, jobs };
  } catch (error) {
    console.error("Error in getJobsByTechnicianAction:", error);
    throw error;
  }
}

// Get overdue jobs
export async function getOverdueJobsAction() {
  try {
    const jobs = await getOverdueJobs();
    return { success: true, jobs };
  } catch (error) {
    console.error("Error in getOverdueJobsAction:", error);
    throw error;
  }
}

// Get recent jobs
export async function getRecentJobsAction(limit: number = 10) {
  try {
    const jobs = await getRecentJobs(limit);
    return { success: true, jobs };
  } catch (error) {
    console.error("Error in getRecentJobsAction:", error);
    throw error;
  }
}

// Get job statistics
export async function getJobStatsAction() {
  try {
    const stats = await getJobStats();
    return { success: true, stats };
  } catch (error) {
    console.error("Error in getJobStatsAction:", error);
    throw error;
  }
}

// Search jobs
export async function searchJobsAction(searchTerm: string) {
  try {
    const jobs = await searchJobs(searchTerm);
    return { success: true, jobs };
  } catch (error) {
    console.error("Error in searchJobsAction:", error);
    throw error;
  }
}

// Delete a job
export async function deleteJobAction(jobId: string) {
  try {
    const result = await deleteJob(jobId);
    return { success: true, deletedId: jobId };
  } catch (error) {
    console.error("Error in deleteJobAction:", error);
    return { success: false, error: (error as Error).message };
  }
}
