import Doctor from "@/models/Doctors";
import Specialization from "@/models/Specializations";
import User from "@/models/Users";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: {
    userId: string;
  };
};
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = params;
    const doctor = await Doctor.findOne({ where: { userId } });

    if (!doctor) {
      return new NextResponse(
        JSON.stringify({
          message: `Doctor with userId ${userId} does not exist`,
        }),
        {
          status: 404,
        },
      );
    }

    const specialization = await Specialization.findOne({
      where: { specializationId: doctor?.getDataValue("specializationId") },
      attributes: ["specializationId", "specializationName"],
    });

    const user = await User.findOne({
      where: { userId },
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

    const doctorsWithDetail = {
      doctor,
      specialization,
      user,
    };

    return new NextResponse(JSON.stringify({ doctor: doctorsWithDetail }), {
      status: 200,
    });
  } catch (error: any) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "server error", error: error.message }),
      { status: 500 },
    );
  }
}

type Params = {
  params: { userId: string };
};

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const data: Record<string, any> = await req.json();
    const newSpecialization = data.specialization as string;
    const userId = params.userId;
    const doctor = await Doctor.findOne({ where: { userId } });

    if (!doctor) {
      return new Response(
        JSON.stringify({
          message: `Doctor with userId ${userId} does not exist`,
        }),
        { status: 404 },
      );
    }
    const { specializationId } = doctor.dataValues;
    const updatedSpecialization = await Specialization.update(
      { specializationName: newSpecialization },
      { where: { specializationId } },
    );
    let updatedDoctor = "";

    return new Response(
      JSON.stringify({
        message: "Doctor updated successfully",
        doctor: updatedDoctor,
        specialization: updatedSpecialization,
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
