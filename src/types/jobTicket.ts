import { JobStatus } from "@/models/Job";
export interface Technician {
  _id: string;
  name: string;
  isActive: boolean;
}
export interface JobTicket {
  _id: string;
  jobId?: string;
  status: JobStatus;
  priority?: string;
  customerName: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  brand: string;
  tvModel?: string;
  screenSize: string;
  serialNumber?: string;
  accessories?: string;
  problemCategory: string;
  problemDescription: string;
  technician?: {
    _id: string;
    name: string;
  };
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  estimatedCost?: number;
  actualCost?: number;
  diagnosis?: string;
  partsRequired?: string[];
  workCompleted?: string;
  testingNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  daysUntilDelivery?: number;
  isOverdue?: boolean;
}

export interface JobTicketDisplay {
  id: string;
  ticketNumber: string;
  customer: string;
  brand: string;
  model: string;
  status: string;
  technician: string;
  created: string;
}
