"use server";

import {
  getAllTechnicians,
  TechnicianData,
} from "@/services/technicianService";

export async function getTechnicians(): Promise<TechnicianData[]> {
  const technicians = await getAllTechnicians();
  return technicians;
}
