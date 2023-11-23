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
    const user = await User.findOne({ where: { userId } });

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: `User with userId ${userId} does not exist`,
        }),
        {
          status: 404,
        },
      );
    }

    return new NextResponse(JSON.stringify({ user }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({
        message: "Something went wrong in the get all patients",
      }),
      {
        status: 500,
      },
    );
  }
}

type Params = {
  params: { userId: string };
};

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const data: Record<string, any> = await req.json();
    const userId = params.userId;
    const user = await User.findOne({ where: { userId } });

    if (!user) {
      return new Response(
        JSON.stringify({
          message: `User with userId ${userId} does not exist`,
        }),
        { status: 404 },
      );
    }
    let updatedUser = await user.update(data);
    return new Response(
      JSON.stringify({
        message: "User updated successfully",
        user: updatedUser,
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

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    let userId = params.userId;
    const user = await User.findOne({ where: { userId } });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: `User with Id ${userId} does not exist` }),
        {
          status: 404,
        },
      );
    }
    await user.destroy();
    return new NextResponse(
      JSON.stringify({ message: "User deleted successfully" }),
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
