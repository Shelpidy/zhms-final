import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/Users";
import Room from "@/models/Rooms";
import { Op } from "sequelize";

interface RoomType {
  recipientId: string;
  lastMessage: string;
  numberOfUnreadMessages: number;
  userOneId: string;
  userTwoId: string;
}

export async function POST(request: NextRequest) {
  try {
    const roomObj: RoomType = await request.json();
    let newRoom = await Room.create({ ...roomObj });
    return new NextResponse(JSON.stringify({ createdRoom: newRoom }), {
      status: 201,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "server error", error: String(error) }),
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    let rooms = await Room.findAll();

    return new NextResponse(JSON.stringify({ rooms }), {
      status: 200,
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
}
