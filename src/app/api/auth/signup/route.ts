import bcrypt from "bcrypt";
import User from "@/models/Users";
import { NextRequest } from "next/server";
import { hashData } from "@/utils/data";

interface FormData {
  email: string;
  password: string;
  dateOfBirth: string | null;
  firstName: string;
  lastName: string;
  middleName: string | null;
  profileImage: string | null;
  gender: string | null;
  contactNumber: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const email: string = data.email;

    const password: string = data.password; // Assuming you include the password in the request body

    // Hash the password using bcrypt
    const hashedPassword: string = await bcrypt.hash(password, 10); // You can adjust the number of rounds as needed
    let userData = { ...data, password: hashedPassword };

    // Create a new user record with the hashed password
    const user = await User.create(userData);
    return new Response(JSON.stringify({ message: "New user added", user }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Creating user failed", error: String(error) }),
      { status: 400 },
    );
  }
}
