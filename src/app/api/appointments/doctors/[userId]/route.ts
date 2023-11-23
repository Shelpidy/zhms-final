import User from "@/models/Users";
import Doctor from "@/models/Doctors";
import Patient from "@/models/Patients";
import Appointment from "@/models/Appointments";
import BloodGroup from "@/models/BloodGroups";
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
    let doctorUserId = params.userId;
    const doctor = await Doctor.findOne({
      where: { userId: doctorUserId },
    });

    if (!doctor) {
      return new Response(
        JSON.stringify({
          message: `Doctor with userId ${doctorUserId} does not exist`,
        }),
        { status: 404 },
      );
    }

    const appointments = await Appointment.findAll({
      where: { doctorId: doctor.getDataValue("doctorId") },
    });

    const appointmentsWithDetails = await Promise.all(
      appointments.map(async (appointment: any) => {
        const patient = await Patient.findOne({
          where: { patientId: appointment.patientId },
        });

        const bloodGroup = await BloodGroup.findOne({
          where: { bloodGroupId: patient?.bloodGroupId },
        });

        const patientUser = await User.findOne({
          where: { userId: patient?.userId },
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
                  { userOneId: patientUser?.getDataValue("userId") },
                  { userTwoId: doctorUserId },
                ],
              },
              {
                [Op.or]: [
                  { userTwoId: patientUser?.getDataValue("userId") },
                  { userOneId: doctorUserId },
                ],
              },
            ],
          },
        });

        return {
          patient: {
            patient,
            bloodGroup,
            user: patientUser,
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
