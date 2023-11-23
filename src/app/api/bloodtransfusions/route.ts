import Donor from "@/models/Donors";
import Requirer from "@/models/Requirers";
import User from "@/models/Users";
import BloodGroup from "@/models/BloodGroups";
import BloodTransfusion from "@/models/BloodTransfusions";

export async function GET(req: Request) {
  try {
    const bloodTransfusions = await BloodTransfusion.findAll();
    const bloodTransfusionsDetails = await Promise.all(
      bloodTransfusions.map(async (transfusion) => {
        const donor = await Donor.findOne({
          where: { donorId: transfusion.getDataValue("donorId") },
          attributes: [
            "firstName",
            "lastName",
            "middleName",
            "gender",
            "dateOfBirth",
            "address",
            "contactNumber",
            "email",
          ],
        });

        const requirer = await Requirer.findOne({
          where: { requirerId: transfusion.getDataValue("recipientId") },
        });
        const { userId } = requirer?.dataValues;
        const user = await User.findOne({
          where: { userId: userId },
        });

        const bloodGroup = await BloodGroup.findOne({
          where: { bloodGroupId: transfusion.getDataValue("bloodGroupId") },
        });

        return {
          transfusion,
          donor,
          requirer: { user, requirer },
          bloodGroup,
        };
      }),
    );
    return new Response(
      JSON.stringify({ transfusions: bloodTransfusionsDetails }),
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "server error", error: error.message }),
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const donorEmail = data.donorEmail as string;
    const requirerId = data.requirerId as string;

    const bloodGroup = await BloodGroup.findOne({
      where: { groupName: data.groupName },
    });
    const donor = await Donor.findOne({ where: { email: donorEmail } });
    const { groupName, donorEmail: de, ...transfusionData } = data;
    const bloodTransfusion = await BloodTransfusion.create({
      donorId: donor?.getDataValue("donorId"),
      recipientId: requirerId,
      bloodGroupId: bloodGroup?.getDataValue("bloodGroupId"),
      ...transfusionData,
    });

    await bloodGroup?.decrement("volume", {
      by: Number(data.volume || donor?.getDataValue("volume")),
    });

    return new Response(
      JSON.stringify({
        message: "blood transfusion created",
        bloodTransfusion,
      }),
      { status: 201 },
    );
  } catch (error: any) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "server error", error: error.message }),
      { status: 400 },
    );
  }
}
