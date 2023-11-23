import Appointment from "@/models/Appointments";
import { NextRequest } from "next/server";

type Params = {
  params: { appointmentId: string };
};

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const data: Record<string, any> = await req.json();
    const appointmentId = params.appointmentId;
    const appointment = await Appointment.findOne({ where: { appointmentId } });

    if (!appointment) {
      return new Response(
        JSON.stringify({
          message: `Appointment with Id ${appointmentId} does not exist`,
        }),
        { status: 404 },
      );
    }
    let updatedAppointment = await appointment.update(data);

    return new Response(
      JSON.stringify({
        message: "Appointment updated successfully",
        appointment: updatedAppointment,
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
