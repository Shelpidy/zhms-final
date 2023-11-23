import User from "@/models/Users";
import Admin from "@/models/Admins";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: {
    userId: string;
  };
};
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = params;
    // will have to change the Model to Admin so take note
    const admin = await Admin.findOne({ where: { userId } });

    if (!admin) {
      return new NextResponse(
        JSON.stringify({
          message: `Admin with userId ${userId} does not exist`,
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

    const adminsWithDetail = {
      admin,
      user,
    };

    return new NextResponse(JSON.stringify({ admin: adminsWithDetail }), {
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

//// need to create the logic for the put
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const id = params.userId;
    if (!id) {
      return new Response(JSON.stringify({ message: "missing parameters" }), {
        status: 404,
      });
    }
    const data = await req.json();
    const username = data.username as string;
    const updatedAdmin = await Admin.update(
      {
        username,
      },
      { where: { userId: id } },
    );

    return new Response(
      JSON.stringify({ message: "admin updated successfully", updatedAdmin }),
      { status: 202 },
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "something went wrong in the PUT request" }),
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const id = params.userId;
    if (!id) {
      return new Response(JSON.stringify({ message: "Missing parameter id" }), {
        status: 404,
      });
    }
    const admin = await Admin.findOne({ where: { userId: id } });
    if (!admin) {
      return new Response(JSON.stringify({ message: "missing admin" }), {
        status: 404,
      });
    }
    await User.update({role:"user"},{where:{userId:id}})
    await admin.destroy();
    return new Response(JSON.stringify({ message: "admin deleted" }), {
      status: 203,
    });
  } catch (error: any) {
    console.log(error);
    return new Response(
      JSON.stringify({
        message: "something went wrong in the DELETE request",
        error: error.message,
      }),
      { status: 500 },
    );
  }
}
