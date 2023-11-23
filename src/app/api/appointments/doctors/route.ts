import User from "@/models/Users";
import Doctor from "@/models/Doctors";
import Patient from "@/models/Patients";
import Appointment from "@/models/Appointments";

import { NextRequest } from "next/server";
import Room from "@/models/Rooms";


export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const appointmentId = data.appointmentId as string;
    const appointmentStatus = data.appointmentStatus as string;
    const appointment = await Appointment.update(
      {
        appointmentStatus,
      },
      { where: { appointmentId } },
    );

    return new Response(
      JSON.stringify({
        message: "appointment updated successfully",
        appointment,
      }),
      { status: 202 },
    );
  } catch (error: any) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Server Error", error: error.message }),
      { status: 500 },
    );
  }
}