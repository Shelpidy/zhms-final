import BloodGroup from "@/models/BloodGroups";
import Doctor from "@/models/Doctors";
import Specialization from "@/models/Specializations";
import User from "@/models/Users";

export async function GET(req: Request) {
  try {
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

    const doctor = await BloodGroup.create({
      groupName: data.groupName,
      volume: data.volume,
    });

    return new Response(
      JSON.stringify({ message: "New Bloodgroup added", doctor }),
      { status: 201 },
    );
  } catch (error: any) {
    console.log(error);
    return new Response(
      JSON.stringify({
        message: "Something went wrong in POSTing",
        error: error.message,
      }),
      { status: 500 },
    );
  }
}
