import User from "@/models/Users";
import { jwtEncode, matchWithHashedData } from "@/utils/data";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    let { password, email } = await request.json();
    console.log({ password });
    let userInfo = await User.findOne({
      where: { email },
    });

    if (userInfo) {
      let hashedPassword = userInfo.getDataValue("password");
      console.log({ hashedPassword });
      let isMatch = await matchWithHashedData(password, hashedPassword);
      console.log({ isMatch, password, hashedPassword });
      if (isMatch) {
        let loginToken = await jwtEncode({
          userId: userInfo.getDataValue("userId"),
          profilePicture: userInfo.getDataValue("profileImage"),
          role: userInfo.getDataValue("role"),
          displayName: userInfo.getFullname(),
        });

        return new Response(
          JSON.stringify({
            message: `Login successfully`,
            token: loginToken,
          }),
          { status: 201 },
        );
      } else {
        return new Response(
          JSON.stringify({
            message: "Password is incorrect.",
          }),
          { status: 401 },
        );
      }
    } else {
      return new Response(
        JSON.stringify({
          message: "Email does not exist.",
        }),
        { status: 404 },
      );
    }
  } catch (err) {
    console.log(err);
    return new Response(
      JSON.stringify({
        message: String(err),
      }),
      { status: 400 },
    );
  }
}
