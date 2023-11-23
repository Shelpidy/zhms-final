import User from "@/models/Users";
import Doctor from "@/models/Doctors";
import Patient from "@/models/Patients";
import Appointment from "@/models/Appointments";
import Specialization from "@/models/Specializations";
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
    let adminUserId = params.userId;

    console.log({ AminUserId: adminUserId });
    const appointments = await Appointment.findAll();

    const appointmentsWithDetails = await Promise.all(
      appointments.map(async (appointment: any) => {
        const doctor = await Doctor.findOne({
          where: { doctorId: appointment.doctorId },
        });
        const specialization = await Specialization.findOne({
          where: { specializationId: doctor?.specializationId },
        });

        const patient = await Patient.findOne({
          where: { patientId: appointment.patientId },
        });

        const bloodGroup = await BloodGroup.findOne({
          where: { bloodGroupId: patient?.bloodGroupId },
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

        let doctorRoom = await Room.findOne({
          where: {
            [Op.or]: [
              {
                [Op.and]: [
                  { userOneId: doctorUser?.getDataValue("userId") },
                  { userTwoId: adminUserId },
                ],
              },
              {
                [Op.and]: [
                  { userTwoId: doctorUser?.getDataValue("userId") },
                  { userOneId: adminUserId },
                ],
              },
            ],
          },
        });
        let patientRoom = await Room.findOne({
          where: {
            [Op.or]: [
              {
                [Op.and]: [
                  { userOneId: patientUser?.getDataValue("userId") },
                  { userTwoId: adminUserId },
                ],
              },
              {
                [Op.and]: [
                  { userTwoId: patient?.getDataValue("userId") },
                  { userOneId: adminUserId },
                ],
              },
            ],
          },
        });

        return {
          doctor: {
            doctor,
            specialization,
            user: doctorUser,
            roomId: doctorRoom?.getDataValue("roomId"),
          },
          patient: {
            patient,
            bloodGroup,
            user: patientUser,
            roomId: patientRoom?.getDataValue("roomId"),
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
