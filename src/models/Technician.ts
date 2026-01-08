import mongoose, { Schema, Document } from "mongoose";

export interface ITechnician extends Document {
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  experience: number; // years of experience
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TechnicianSchema = new Schema<ITechnician>(
  {
    name: {
      type: String,
      required: [true, "Technician name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[0-9+\-\s()]+$/, "Please enter a valid phone number"],
    },
    specialization: [
      {
        type: String,
        enum: [
          "LED TV",
          "LCD TV",
          "Plasma TV",
          "Smart TV",
          "Audio Systems",
          "Display Panels",
          "Power Supply",
          "Motherboards",
          "Remote Controls",
        ],
      },
    ],
    experience: {
      type: Number,
      required: [true, "Experience is required"],
      min: [0, "Experience cannot be negative"],
      max: [50, "Experience cannot exceed 50 years"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,

    toObject: { virtuals: true },
  }
);

const Technician =
  mongoose.models?.Technician ||
  mongoose.model<ITechnician>("Technician", TechnicianSchema);

export default Technician;
