import User from "@/models/Users";
import Requirer from "@/models/Requirers";
import BloodGroup from "@/models/BloodGroups";

export async function GET(req: Request) {
  try {
    const requirers = await Requirer.findAll();
    const requirerDetails = await Promise.all(
      requirers.map(async (requirer) => {
        const user = await User.findOne({ where: { userId: requirer.userId } });

        const bloodGroup = await BloodGroup.findOne({
          where: { bloodGroupId: requirer.bloodGroupId },
        });
        return {
          requirer,
          user,
          bloodGroup,
        };
      }),
    );
    return new Response(JSON.stringify({ requirers: requirerDetails }), {
      status: 200,
    });
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
    const email = data.email;
    const bloodGroup = data.bloodGroup;

    const user = await User.findOne({ where: {email} });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    const bloogGrp = await BloodGroup.findOne({where:{
      groupName: bloodGroup},
    });
    const { bloodGroupId } = bloogGrp?.dataValues;
    const requirer = await Requirer.create({
      userId:user.getDataValue("userId"),
      bloodGroupId,
    });

    return new Response(
      JSON.stringify({ message: "Request successfully made", requirer }),
      { status: 201 },
    );
  } catch (error: any) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "server error", error: error.message }),
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("requirerId");

    const requirer = await Requirer.findOne({ where: { requirerId: id } });
    await requirer?.destroy();
    return new Response(JSON.stringify({ message: "successfully deleted" }), {
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
