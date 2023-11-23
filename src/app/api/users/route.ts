import User from "@/models/Users";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    let users = await User.findAll();

    return new NextResponse(JSON.stringify({ users }), {
      status: 200,
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
}
