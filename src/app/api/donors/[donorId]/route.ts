import Donor from "@/models/Donors";
import BloodGroup from "@/models/BloodGroups";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: {
    donorId: string;
  };
};
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    let donorId = params.donorId;
    const donor = await Donor.findOne({ where: { donorId } });
    const bloodGroup = await BloodGroup.findOne({
      where: { bloodGroupId: donor?.getDataValue("bloodGroupId") },
      attributes: ["bloodGroupId", "groupName"],
    });
    const donorDetail = {
      donor,
      bloodGroup,
    };
    return new Response(JSON.stringify({ donor: donorDetail }), {
      status: 200,
    });
  } catch (error: any) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "server error", error: error.message }),
      { status: 400 },
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const donorId = params.donorId;
    const data: Record<string, any> = await req.json();
    const donor = await Donor.findOne({ where: { donorId: donorId } });

    if (!donor) {
      return new NextResponse(JSON.stringify({ message: "Donor not found" }), {
        status: 404,
      });
    }
    let updatedDonor = await donor.update(data);
    if (data.volume) {
      let bloodGroup = await BloodGroup.findOne({
        where: { bloodGroupId: updatedDonor.getDataValue("bloodGroupId") },
      });
      if (bloodGroup) {
        await bloodGroup.decrement("volume", { by: Number(data.volume) });
        await bloodGroup.increment("volume", {
          by: Number(updatedDonor.getDataValue("volume")),
        });
      }
    }

    return new NextResponse(JSON.stringify({ message: "donor updated" }), {
      status: 202,
    });
  } catch (error: any) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "server error", error: error.message }),
      { status: 400 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    let donorId = params.donorId;
    const donor = await Donor.findOne({ where: { donorId } });
    if (!donor) {
      return new NextResponse(
        JSON.stringify({ message: `Donor with Id ${donorId} does not exist` }),
        {
          status: 404,
        },
      );
    }
    const { bloodGroupId } = donor?.dataValues;
    const bloodGroup = await BloodGroup.findOne({ where: { bloodGroupId } });
    if (bloodGroup) {
      await bloodGroup?.decrement("volume", {
        by: Number(donor.getDataValue("volume")),
      });
    }
    await donor.destroy();
    return new NextResponse(
      JSON.stringify({ message: "Donor deleted successfully" }),
      {
        status: 203,
      },
    );
  } catch (error: any) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "server error", error: error.message }),
      { status: 500 },
    );
  }
}
