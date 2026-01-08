import mongoose from "mongoose";
import Technician from "../models/Technician";
import dbConnect from "@/_components/db";

// Check if we have a database connection configuration

const technicianData = [
  {
    name: "আবুল কালাম (Abul Kalam)",
    email: "abul.kalam@electronics.com",
    phone: "+880-1712-345678",
    specialization: ["LED TV", "Smart TV", "Display Panels"],
    experience: 8,
    isActive: true,
  },
  {
    name: "মোহাম্মদ রহিম (Mohammad Rahim)",
    email: "mohammad.rahim@electronics.com",
    phone: "+880-1823-456789",
    specialization: ["LCD TV", "Power Supply", "Motherboards"],
    experience: 6,
    isActive: true,
  },
  {
    name: "আবদুর রহমান (Abdur Rahman)",
    email: "abdur.rahman@electronics.com",
    phone: "+880-1934-567890",
    specialization: ["Plasma TV", "Audio Systems", "Remote Controls"],
    experience: 10,
    isActive: true,
  },
  {
    name: "নাজমুল হাসান (Nazmul Hasan)",
    email: "nazmul.hasan@electronics.com",
    phone: "+880-1645-678901",
    specialization: ["Smart TV", "LED TV", "Display Panels"],
    experience: 4,
    isActive: true,
  },
  {
    name: "মাহবুবুর রহমান (Mahbubur Rahman)",
    email: "mahbubur.rahman@electronics.com",
    phone: "+880-1756-789012",
    specialization: ["LCD TV", "Plasma TV", "Power Supply"],
    experience: 12,
    isActive: true,
  },
  {
    name: "ফরিদুল ইসলাম (Faridul Islam)",
    email: "faridul.islam@electronics.com",
    phone: "+880-1867-890123",
    specialization: ["Audio Systems", "Smart TV", "Motherboards"],
    experience: 7,
    isActive: true,
  },
  {
    name: "সাইফুল ইসলাম (Saiful Islam)",
    email: "saiful.islam@electronics.com",
    phone: "+880-1978-901234",
    specialization: ["LED TV", "Remote Controls", "Display Panels"],
    experience: 5,
    isActive: true,
  },
  {
    name: "হাবিবুর রহমান (Habibur Rahman)",
    email: "habibur.rahman@electronics.com",
    phone: "+880-1589-012345",
    specialization: ["Power Supply", "Motherboards", "LCD TV"],
    experience: 9,
    isActive: true,
  },
  {
    name: "আশরাফুল আলম (Ashraful Alam)",
    email: "ashraful.alam@electronics.com",
    phone: "+880-1690-123456",
    specialization: ["Smart TV", "Plasma TV", "Audio Systems"],
    experience: 6,
    isActive: true,
  },
  {
    name: "তানভীর আহমেদ (Tanvir Ahmed)",
    email: "tanvir.ahmed@electronics.com",
    phone: "+880-1701-234567",
    specialization: ["LED TV", "Display Panels", "Remote Controls"],
    experience: 3,
    isActive: true,
  },
];

export async function seedTechnicians() {
  try {
    await dbConnect();

    // Check if technicians already exist
    const existingCount = await Technician.countDocuments();
    if (existingCount > 0) {
      console.log(
        `${existingCount} technicians already exist. Skipping seeding.`
      );
      return;
    }

    // Insert new technicians
    const insertedTechnicians = await Technician.insertMany(technicianData);
    console.log(
      `Successfully inserted ${insertedTechnicians.length} technicians:`
    );

    insertedTechnicians.forEach((tech, index) => {
      console.log(
        `${index + 1}. ${tech.name} - ${tech.email} (${
          tech.experience
        } years exp.)`
      );
    });

    console.log("\nTechnicians seeded successfully!");
  } catch (error) {
    console.error("Error seeding technicians:", error);
  }
}
