import User from "@/models/Users";
import Doctor from "@/models/Doctors";
import Patient from "@/models/Patients";
import Appointment from "@/models/Appointments";
import Specialization from "@/models/Specializations";
import { Op } from "sequelize";
import { NextRequest } from "next/server";
import Room from "@/models/Rooms";

type RouteParams = {
  params: {
    userId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    let patientUserId = params.userId;
    const patient = await Patient.findOne({
      where: { userId: patientUserId },
    });

    if (!patient) {
      return new Response(
        JSON.stringify({
          message: `Patient with userId ${patientUserId} does not exist`,
        }),
        { status: 404 },
      );
    }

    const appointments = await Appointment.findAll({
      where: { patientId: patient.patientId },
    });

    const appointmentsWithDetails = await Promise.all(
      appointments.map(async (appointment: any) => {
        const doctor = await Doctor.findOne({
          where: { doctorId: appointment.doctorId },
        });

        const doctorUser = await User.findOne({
          where: { userId: doctor?.userId },
          attributes: [
            "userId",
            "firstName",
            "lastName",
            "profileImage",
            "contactNumber",
            "gender",
            "dateOfBirth",
            "address",
            "email",
            "role",
          ],
        });

        let room = await Room.findOne({
          where: {
            [Op.and]: [
              {
                [Op.or]: [
                  { userOneId: doctorUser?.getDataValue("userId") },
                  { userTwoId: patientUserId },
                ],
              },
              {
                [Op.or]: [
                  { userTwoId: doctorUser?.getDataValue("userId") },
                  { userOneId: patientUserId },
                ],
              },
            ],
          },
        });

        const specialization = await Specialization.findOne({
          where: { specializationId: doctor?.specializationId },
        });

        return {
          doctor: {
            doctorId: doctor?.doctorId,
            specialization,
            user: doctorUser,
            roomId: room?.getDataValue("roomId"),
          },
          appointment: {
            appointmentId: appointment.appointmentId,
            appointmentStatus: appointment.appointmentStatus,
            reason: appointment.reason,
            note: appointment.note,
            appointmentDate: appointment.appointmentDate,
          },
        };
      }),
    );
    return new Response(
      JSON.stringify({ appointments: appointmentsWithDetails }),
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Server error", error: error }),
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const data: Record<string, any> = await req.json();
    const userId = params.userId;

    const patient = await Patient.findOne({ where: { userId } });

    if (!patient) {
      return new Response(
        JSON.stringify({
          message: `Patient with userId ${userId} does not exist`,
        }),
        { status: 404 },
      );
    }
    let updatedPatient = await patient.update(data);

    return new Response(
      JSON.stringify({
        message: "User updated successfully",
        patient: updatedPatient,
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
