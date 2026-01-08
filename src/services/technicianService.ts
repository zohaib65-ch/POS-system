import Technician, { ITechnician } from "@/models/Technician";
import connectDB from "@/_components/db";

export interface TechnicianData {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  experience: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTechnicianInput {
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  experience: number;
  isActive?: boolean;
}

export interface UpdateTechnicianInput {
  name?: string;
  email?: string;
  phone?: string;
  specialization?: string[];
  experience?: number;
  isActive?: boolean;
}

/**
 * Create a new technician
 */
export async function createTechnician(
  data: CreateTechnicianInput
): Promise<TechnicianData> {
  try {
    await connectDB();

    const technician = new Technician(data);
    const savedTechnician = await technician.save();

    // Convert to plain object
    return {
      _id: savedTechnician._id.toString(),
      name: savedTechnician.name,
      email: savedTechnician.email,
      phone: savedTechnician.phone,
      specialization: savedTechnician.specialization,
      experience: savedTechnician.experience,
      isActive: savedTechnician.isActive,
      createdAt: savedTechnician.createdAt,
      updatedAt: savedTechnician.updatedAt,
    };
  } catch (error) {
    throw new Error(
      `Failed to create technician: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get all technicians
 */
export async function getAllTechnicians(): Promise<TechnicianData[]> {
  try {
    await connectDB();

    const technicians = await Technician.find({}).sort({ createdAt: -1 });

    // Convert to plain objects
    return technicians.map((technician) => ({
      _id: technician._id.toString(),
      name: technician.name,
      email: technician.email,
      phone: technician.phone,
      specialization: technician.specialization,
      experience: technician.experience,
      isActive: technician.isActive,
      createdAt: technician.createdAt,
      updatedAt: technician.updatedAt,
    }));
  } catch (error) {
    throw new Error(
      `Failed to get technicians: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get a technician by ID
 */
export async function getTechnicianById(
  id: string
): Promise<TechnicianData | null> {
  try {
    await connectDB();

    const technician = await Technician.findById(id);

    if (!technician) {
      return null;
    }

    // Convert to plain object
    return {
      _id: technician._id.toString(),
      name: technician.name,
      email: technician.email,
      phone: technician.phone,
      specialization: technician.specialization,
      experience: technician.experience,
      isActive: technician.isActive,
      createdAt: technician.createdAt,
      updatedAt: technician.updatedAt,
    };
  } catch (error) {
    throw new Error(
      `Failed to get technician: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Update a technician by ID
 */
export async function updateTechnician(
  id: string,
  data: UpdateTechnicianInput
): Promise<TechnicianData | null> {
  try {
    await connectDB();

    const updatedTechnician = await Technician.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedTechnician) {
      return null;
    }

    // Convert to plain object
    return {
      _id: updatedTechnician._id.toString(),
      name: updatedTechnician.name,
      email: updatedTechnician.email,
      phone: updatedTechnician.phone,
      specialization: updatedTechnician.specialization,
      experience: updatedTechnician.experience,
      isActive: updatedTechnician.isActive,
      createdAt: updatedTechnician.createdAt,
      updatedAt: updatedTechnician.updatedAt,
    };
  } catch (error) {
    throw new Error(
      `Failed to update technician: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Delete a technician by ID
 */
export async function deleteTechnician(id: string): Promise<boolean> {
  try {
    await connectDB();

    const deletedTechnician = await Technician.findByIdAndDelete(id);

    return deletedTechnician !== null;
  } catch (error) {
    throw new Error(
      `Failed to delete technician: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get active technicians only
 */
export async function getActiveTechnicians(): Promise<TechnicianData[]> {
  try {
    await connectDB();

    const technicians = await Technician.find({ isActive: true }).sort({
      createdAt: -1,
    });

    // Convert to plain objects
    return technicians.map((technician) => ({
      _id: technician._id.toString(),
      name: technician.name,
      email: technician.email,
      phone: technician.phone,
      specialization: technician.specialization,
      experience: technician.experience,
      isActive: technician.isActive,
      createdAt: technician.createdAt,
      updatedAt: technician.updatedAt,
    }));
  } catch (error) {
    throw new Error(
      `Failed to get active technicians: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get technicians by specialization
 */
export async function getTechniciansBySpecialization(
  specialization: string
): Promise<TechnicianData[]> {
  try {
    await connectDB();

    const technicians = await Technician.find({
      specialization: { $in: [specialization] },
      isActive: true,
    }).sort({ experience: -1 });

    // Convert to plain objects
    return technicians.map((technician) => ({
      _id: technician._id.toString(),
      name: technician.name,
      email: technician.email,
      phone: technician.phone,
      specialization: technician.specialization,
      experience: technician.experience,
      isActive: technician.isActive,
      createdAt: technician.createdAt,
      updatedAt: technician.updatedAt,
    }));
  } catch (error) {
    throw new Error(
      `Failed to get technicians by specialization: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Soft delete - deactivate a technician instead of deleting
 */
export async function deactivateTechnician(
  id: string
): Promise<TechnicianData | null> {
  try {
    await connectDB();

    const updatedTechnician = await Technician.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true, runValidators: true }
    );

    if (!updatedTechnician) {
      return null;
    }

    // Convert to plain object
    return {
      _id: updatedTechnician._id.toString(),
      name: updatedTechnician.name,
      email: updatedTechnician.email,
      phone: updatedTechnician.phone,
      specialization: updatedTechnician.specialization,
      experience: updatedTechnician.experience,
      isActive: updatedTechnician.isActive,
      createdAt: updatedTechnician.createdAt,
      updatedAt: updatedTechnician.updatedAt,
    };
  } catch (error) {
    throw new Error(
      `Failed to deactivate technician: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
