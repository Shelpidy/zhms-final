import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/Users";
import Message from "@/models/Messages";

interface ReturnMessageType {
  messageId: string;
  userId: string;
  avatar: string;
  message: string;
  roomId?: string;
  username: string;
  alignment: "left" | "right";
  date: string | Date;
}

type RouteParams = {
  params: {
    roomId: string;
    userId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { searchParams } = request.nextUrl;
    const { roomId, userId } = params;
    const pageNumber = Number(searchParams.get("pageNumber") || 1);
    const numberOfRecords = Number(searchParams.get("numberOfRecords") || 20);
    const start = (pageNumber - 1) * numberOfRecords;
    console.log({ roomId, pageNumber, numberOfRecords });

    let messages = await Message.findAll({
      where: { roomId },
      order: [["createdAt", "DESC"]],
      offset: start,
      limit: numberOfRecords,
    });

    let newMessages = await Promise.all(
      messages.map(async (message) => {
        let senderId = message.getDataValue("senderId");
        let sender = await User.findByPk(senderId);
        let newMessage: ReturnMessageType = {
          avatar: sender?.getDataValue("profileImage") || "",
          username: String(sender?.getFullname()),
          messageId: message.getDataValue("messageId"),
          message: message.getDataValue("message"),
          roomId: String(roomId),
          userId: senderId,
          alignment: senderId === userId ? "right" : "left",
          date: message.getDataValue("createdAt"),
        };
        return newMessage;
      }),
    );
    console.log({ newMessages });
    return new NextResponse(JSON.stringify({ messages: newMessages }), {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "server error", error: String(error) }),
      { status: 500 },
    );
  }
}
