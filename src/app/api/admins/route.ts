import User from "@/models/Users";
import Admin from "@/models/Admins";

export async function GET(req: Request) {
  try {
    const admins = await Admin.findAll();

    const adminsWithDetails = await Promise.all(
      admins.map(async (admin: any) => {
        const user = await User.findOne({
          where: { userId: admin.userId },
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

        return {
          admin,
          user,
        };
      }),
    );

    return new Response(JSON.stringify({ admins: adminsWithDetails }));
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
    const username = data.username as string;
    const email = data.email as string;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }));
    }
    const { userId } = user?.dataValues;
    const singleAdmin = await Admin.create({
      username,
      userId,
    });
    // updating the role
    await User.update({ role: "admin" }, { where: { userId } });

    return new Response(
      JSON.stringify({ message: "new Admin created", singleAdmin }),
      { status: 201 },
    );
  } catch (error: any) {
    console.log(error);
    return new Response(
      JSON.stringify({
        message: "something went wrong in the POST request",
        errror: error.message,
      }),
      { status: 500 },
    );
  }
}
