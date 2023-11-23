import Patient from "@/models/Patients";
import BloodGroup from "@/models/BloodGroups";
import User from "@/models/Users";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: {
    userId: string;
  };
};
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    let { userId } = params;
    const patient = await Patient.findOne({ where: { userId } });

    if (!patient) {
      return new NextResponse(
        JSON.stringify({
          message: `Patient with userId ${userId} does not exist`,
        }),
        {
          status: 404,
        },
      );
    }
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
    const bloodGroup = await BloodGroup.findOne({
      where: { bloodGroupId: patient?.getDataValue("bloodGroupId") },
    });
    const patientsWithDetail = {
      patient,
      bloodGroup,
      user,
    };

    return new NextResponse(JSON.stringify({ patient: patientsWithDetail }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({
        message: "Something went wrong in the patients routes",
      }),
      {
        status: 500,
      },
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = params;

    const data = await req.json();
    const email = data.patientEmail as string;
    const patientId = data.patientId as string;
    const diagnosis = data.diagnosis as string;
    const bloodGrp = data.bloodGroup as string;

    const patient = await Patient.findOne({ where: { userId } });
    if (!patient) {
      return new Response(JSON.stringify({ message: "Patient not found" }), {
        status: 404,
      });
    }
    const { bloodGroupId } = patient.dataValues;
    const bloodGrpTable = await BloodGroup.findOne({
      where: { bloodGroupId },
    });
    // if(!bloodGrpTable) {
    //     return new Response(JSON.stringify({message: "BloodGroup not found"}))
    // }
    await BloodGroup.update(
      {
        groupName: bloodGrp,
        bloodGroupId,
      },
      { where: { bloodGroupId: bloodGroupId } },
    );

    await patient.update(
      {
        patientId,
        userId,
        diagnosis,
        bloodGroupId,
      },
      { where: { patientId } },
    );

    // const updatedPatient = await Patient.findOne({ where: { patientId: patientId } });

    return new Response(
      JSON.stringify({ message: "User updated successfully" }),
      {
        status: 202,
      },
    );
  } catch (error: any) {
    console.log(error);
    return new Response(
      JSON.stringify({
        message: "Something went wrong in PUT",
        error: error.message,
      }),
      {
        status: 500,
      },
    );
  }
}
