import { z } from "zod";
import { JobStatus } from "@/models/Job";

const BrandEnum = z.enum(["samsung", "lg", "sony", "panasonic", "sharp"]);
const ScreenSizeEnum = z.enum(["32", "42", "50", "55", "65"]);
const ProblemCategoryEnum = z.enum(["no-power", "no-picture", "no-sound", "screen-damage", "connectivity"]);

export const jobTicketSchema = z.object({
  customerName: z.string().min(3, "Customer name must be at least 3 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  brand: BrandEnum,
  tvModel: z.string().optional().or(z.literal("")),
  screenSize: ScreenSizeEnum,
  serialNumber: z.string().optional().or(z.literal("")),
  accessories: z.string().optional().or(z.literal("")),
  problemCategory: ProblemCategoryEnum,
  problemDescription: z.string().min(10, "Problem description must be at least 10 characters"),
  technician: z.string().optional().or(z.literal("")),
  expectedDeliveryDate: z.string().optional().or(z.literal("")),
  estimatedCost: z.string().optional().or(z.literal("")),
  status: z.nativeEnum(JobStatus),
});

export type Brand = z.infer<typeof BrandEnum>;
export type ScreenSize = z.infer<typeof ScreenSizeEnum>;
export type ProblemCategory = z.infer<typeof ProblemCategoryEnum>;
export type JobTicketFormData = z.infer<typeof jobTicketSchema>;
