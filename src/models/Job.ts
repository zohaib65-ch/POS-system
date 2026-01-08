import mongoose, { Schema, Document } from "mongoose";

// Job Status Enum
export enum JobStatus {
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  DIAGNOSIS = "diagnosis",
  PARTS_ORDERED = "parts-ordered",
  REPAIRING = "repairing",
  TESTING = "testing",
  COMPLETED = "completed",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

// Job Priority Enum
export enum JobPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

// TV Brand Enum
export enum TVBrand {
  SAMSUNG = "samsung",
  LG = "lg",
  SONY = "sony",
  PANASONIC = "panasonic",
  SHARP = "sharp",
}

// Screen Size Enum
export enum ScreenSize {
  SIZE_32 = "32",
  SIZE_42 = "42",
  SIZE_50 = "50",
  SIZE_55 = "55",
  SIZE_65 = "65",
}

// Problem Category Enum
export enum ProblemCategory {
  NO_POWER = "no-power",
  NO_PICTURE = "no-picture",
  NO_SOUND = "no-sound",
  SCREEN_DAMAGE = "screen-damage",
  CONNECTIVITY = "connectivity",
}

export interface IJob extends Document {
  // Job tracking
  jobId: string;
  status: string;
  priority: string;

  // Customer Information
  customerName: string;
  phoneNumber: string;
  email?: string;
  address?: string;

  // TV Information
  brand: string;
  tvModel?: string;
  screenSize?: string;
  serialNumber?: string;
  accessories?: string;

  // Problem Information
  problemCategory: string;
  problemDescription: string;

  // Assignment and Timeline
  technician?: {
    type: mongoose.Types.ObjectId;
    ref: "Technician";
  };
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  estimatedCost?: number;
  actualCost?: number;

  // Job Progress
  diagnosis?: string;
  partsRequired?: string[];
  workCompleted?: string;
  testingNotes?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: Object.values(JobStatus),
      default: JobStatus.PENDING,
      lowercase: true,
    },
    priority: {
      type: String,
      enum: Object.values(JobPriority),
      default: JobPriority.MEDIUM,
      lowercase: true,
    },

    // Customer Information
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      maxlength: [100, "Customer name cannot exceed 100 characters"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[0-9+\-\s()]+$/, "Please enter a valid phone number"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, "Address cannot exceed 500 characters"],
    },

    // TV Information
    brand: {
      type: String,
      required: [true, "Brand is required"],
      enum: Object.values(TVBrand),
      lowercase: true,
    },
    tvModel: {
      type: String,
      trim: true,
      maxlength: [100, "Model cannot exceed 100 characters"],
    },
    screenSize: {
      type: String,
      enum: Object.values(ScreenSize),
    },
    serialNumber: {
      type: String,
      trim: true,
      maxlength: [100, "Serial number cannot exceed 100 characters"],
    },
    accessories: {
      type: String,
      trim: true,
      maxlength: [200, "Accessories description cannot exceed 200 characters"],
    },

    // Problem Information
    problemCategory: {
      type: String,
      required: [true, "Problem category is required"],
      enum: Object.values(ProblemCategory),
      lowercase: true,
    },
    problemDescription: {
      type: String,
      required: [true, "Problem description is required"],
      trim: true,
      minlength: [10, "Problem description must be at least 10 characters"],
      maxlength: [2000, "Problem description cannot exceed 2000 characters"],
    },

    // Assignment and Timeline
    technician: {
      type: Schema.Types.ObjectId,
      ref: "Technician",
    },
    expectedDeliveryDate: {
      type: Date,
    },
    actualDeliveryDate: {
      type: Date,
    },
    estimatedCost: {
      type: Number,
      min: [0, "Estimated cost cannot be negative"],
    },
    actualCost: {
      type: Number,
      min: [0, "Actual cost cannot be negative"],
    },

    // Job Progress
    diagnosis: {
      type: String,
      trim: true,
      maxlength: [1000, "Diagnosis cannot exceed 1000 characters"],
    },
    partsRequired: [
      {
        type: String,
        trim: true,
      },
    ],
    workCompleted: {
      type: String,
      trim: true,
      maxlength: [
        2000,
        "Work completed description cannot exceed 2000 characters",
      ],
    },
    testingNotes: {
      type: String,
      trim: true,
      maxlength: [1000, "Testing notes cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
  }
);

// Auto-generate job ID before saving (fallback if not provided)
JobSchema.pre("save", async function (next) {
  if (this.isNew && !this.jobId) {
    try {
      const count = await mongoose.models.Job.countDocuments();
      this.jobId = `JOB${String(count + 1).padStart(6, "0")}`;
    } catch (error) {
      console.error("Error generating jobId in pre-save hook:", error);
      // Fallback to timestamp-based ID
      this.jobId = `JOB${Date.now().toString().slice(-6)}`;
    }
  }
  next();
});

// Virtual for days until delivery
JobSchema.virtual("daysUntilDelivery").get(function () {
  if (!this.expectedDeliveryDate) return null;
  const today = new Date();
  const diffTime = this.expectedDeliveryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for checking if job is overdue
JobSchema.virtual("isOverdue").get(function () {
  if (
    !this.expectedDeliveryDate ||
    this.status === JobStatus.COMPLETED ||
    this.status === JobStatus.DELIVERED
  ) {
    return false;
  }
  return new Date() > this.expectedDeliveryDate;
});

const Job = mongoose.models?.Job || mongoose.model<IJob>("Job", JobSchema);

export default Job;
