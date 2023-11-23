import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/Users";
import Room from "@/models/Rooms";
import { Op } from "sequelize";

interface ReturnRoomType {
  roomId: string;
  recipientId: string;
  lastMessage: string;
  username: any;
  numberOfUnreadMessages: number;
  avatar: string;
  date: string | Date;
}

type RouteParams = {
  params: {
    userId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { searchParams } = request.nextUrl;
    const { userId } = params;
    const pageNumber = Number(searchParams.get("pageNumber") || 1);
    const numberOfRecords = Number(searchParams.get("numberOfRecords") || 20);
    const start = (pageNumber - 1) * numberOfRecords;
    console.log({ userId, pageNumber, numberOfRecords });

    let rooms = await Room.findAll({
      where: { [Op.or]: [{ userOneId: userId }, { userTwoId: userId }] },
      order: [["createdAt", "DESC"]],
      offset: start,
      limit: numberOfRecords,
    });

    console.log({ rooms });

    let newRooms = await Promise.all(
      rooms.map(async (room) => {
        let userOneId = room.getDataValue("userOneId");
        let userTwoId = room.getDataValue("userTwoId");
        let userOne = await User.findByPk(userOneId);
        let userTwo = await User.findByPk(userTwoId);
        let passiveUser = userOneId === userId ? userTwo : userOne;
        let newRoom: ReturnRoomType = {
          avatar: passiveUser?.getDataValue("profileImage") || "",
          recipientId: passiveUser?.getDataValue("userId") || "",
          username: passiveUser?.getFullname(),
          roomId: room.getDataValue("roomId"),
          numberOfUnreadMessages: room.getDataValue("numberOfUnreadMessages"),
          lastMessage: room.getDataValue("lastMessage"),
          date: room.getDataValue("createdAt"),
        };
        return newRoom;
      }),
    );

    return new NextResponse(JSON.stringify({ rooms: newRooms }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "server error", error: String(error) }),
      { status: 500 },
    );
  }
}
