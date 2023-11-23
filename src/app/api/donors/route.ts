import Donor from "@/models/Donors";
import BloodGroup from "@/models/BloodGroups";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const donors = await Donor.findAll();
    const donorDetails = await Promise.all(
      donors.map(async (donor) => {
        const bloodGroup = await BloodGroup.findOne({
          where: { bloodGroupId: donor.getDataValue("bloodGroupId") },
          attributes: ["bloodGroupId", "groupName"],
        });

        return {
          donor,
          bloodGroup,
        };
      }),
    );
    return new NextResponse(JSON.stringify({ donors: donorDetails }), {
      status: 200,
    });
  } catch (error: any) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "server error", error: error.message }),
      { status: 400 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data: Record<string, any> = await req.json();

    const bloodGrp = await BloodGroup.findOne({
      where: {
        groupName: data.bloodGroupName,
      },
    });
    const { bloodGroupId } = bloodGrp?.dataValues;

    const donor = await Donor.create({
      ...data,
      bloodGroupId,
    });

    await bloodGrp?.increment("volume", { by: Number(data.volume) });

    return new NextResponse(
      JSON.stringify({ message: "Donor created successfully", donor }),
      { status: 201 },
    );
  } catch (error: any) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "server error", error: error.message }),
      { status: 500 },
    );
  }
}
