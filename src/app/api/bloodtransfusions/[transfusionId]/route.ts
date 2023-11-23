import Donor from "@/models/Donors";
import Requirer from "@/models/Requirers";
import User from "@/models/Users";
import BloodGroup from "@/models/BloodGroups";
import BloodTransfusion from "@/models/BloodTransfusions";

type RouteParams = {
  params: { transfusionId: string };
};

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const transfusionId = params.transfusionId;
    const data = await req.json();
    const requirerId = data.requirerId as string;
    const donorEmail = data.donorEmail as string;

    const donor = await Donor.findOne({ where: { email: donorEmail } });
    const bloodGroup = await BloodGroup.findOne({
      where: { groupName: data.groupName },
    });

    const { groupName, donorEmail: de, ...newData } = data;
    const bloodTransfusion = await BloodTransfusion.update(
      {
        donorId: donor?.getDataValue("donorId") || null,
        bloodGroupId: bloodGroup?.getDataValue("bloodGroupId"),
        recipientId: requirerId,
        ...newData,
      },
      { where: { transfusionId } },
    );

    return new Response(
      JSON.stringify({ message: "updated successfully", bloodTransfusion }),
      { status: 202 },
    );
  } catch (error: any) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "server error", error: error.message }),
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const id = params.transfusionId;
    if (!id) {
      return new Response(JSON.stringify({ message: "Missing recording" }), {
        status: 404,
      });
    }

    const tranfusion = await BloodTransfusion.findOne({
      where: { transfusionId: id },
    });

    await tranfusion?.destroy();
    return new Response(JSON.stringify({ message: "Deleted successfully" }), {
      status: 203,
    });
  } catch (error: any) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "server error", error: error.message }),
      { status: 500 },
    );
  }
}
