"use client";
import React, { useState, useEffect } from "react";
import {
  Avatar,
  Container,
  Grid,
  Typography,
  Card,
  Box,
  IconButton,
  useTheme,
  TextField,
  List,
} from "@mui/material";
import {
  MessageBox,
  MessageList,
  Input,
  MessageType,
} from "react-chat-elements";
import { SendOutlined } from "@mui/icons-material";
import { io, Socket } from "socket.io-client";
import MessageBubble, { BubbleProps } from "@/components/chats/Bubble";
import MessageDisplay from "@/components/chats/MessageDisplay";
import Room from "@/models/Rooms";
import MessageRoom from "@/components/chats/Room";
import { useCurrentUser } from "@/hooks/customHooks";

const SERVER_URL = "http://127.0.0.1:8080/"; // Replace with your server's URL

interface RoomType {
  roomId: string;
  recipientId: string;
  username: string;
  lastMessage: string;
  numberOfUnreadMessages: number;
  avatar: string;
  date: string | Date;
}

const dummyData: RoomType[] = [
  {
    roomId: "1",
    recipientId: "user1",
    username: "John Doe",
    lastMessage: "Hello there!",
    numberOfUnreadMessages: 2,
    avatar: "https://picsum.photos/200/200", // Avatar URL with HTTPS
    date: "2023-09-23",
  },
  {
    roomId: "2",
    recipientId: "user2",
    username: "Alice Smith",
    lastMessage: "Hi John, how are you?",
    numberOfUnreadMessages: 0,
    avatar: "https://picsum.photos/200/200", // Avatar URL with HTTPS
    date: "2023-09-22",
  },
  {
    roomId: "3",
    recipientId: "user3",
    username: "Bob Johnson",
    lastMessage: "Meeting at 2 PM.",
    numberOfUnreadMessages: 1,
    avatar: "https://picsum.photos/200/200", // Avatar URL with HTTPS
    date: "2023-09-21",
  },
  // ... (other data entries)
];

type ChatScreenProps = {
  params: { roomId: string };
};
const ChatScreen: React.FC<ChatScreenProps> = ({ params }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeRoom, setActiveRoom] = useState<string>(params.roomId);
  const [room, setRoom] = useState<RoomType | null>(null);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const currentUser = useCurrentUser();

  let ref = React.useRef(null);

  const theme = useTheme();

  useEffect(() => {
    setActiveRoom(params.roomId);
    let room = rooms.find((room) => room.roomId === params.roomId);
    if (room) {
      setRoom(room);
    }
  }, [rooms]);

  useEffect(() => {
    // Connect to the socket.io server
    const socketIo = io(SERVER_URL);
    setSocket(socketIo);

    // Clean up on unmount
    return () => {
      socketIo.disconnect();
    };
  }, []);

  useEffect(() => {
    async function getRooms() {
      try {
        let response = await fetch(`/api/rooms/${currentUser?.userId}`, {
          next: { revalidate: 0 },
          method: "GET",
        });
        let data = await response.json();
        if (response.status === 200) {
          setRooms(data.rooms);
          console.log({ rooms: data.rooms });
        } else {
          console.log(data);
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (currentUser) {
      getRooms();
    }
  }, [currentUser]);

  return (
    <main
      style={{ paddingTop: "10vh", gap: 5, justifyContent: "center" }}
      className="min-h-screen grid grid-cols-dashboard md:px-40"
    >
      <Box className="w-full sticky top-[10vh] mx5 md:w-[30vw]">
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {rooms.map((room) => {
            if (room.lastMessage)
              return (
                <MessageRoom
                  handleClick={() => {
                    setActiveRoom(room.roomId);
                    setRoom(room);
                  }}
                  key={room.roomId}
                  {...room}
                />
              );
          })}
        </List>
      </Box>
      {activeRoom && socket && (
        <Box sx={{ marginBottom: "20px" }}>
          <MessageDisplay socket={socket} roomId={activeRoom} room={room} />
        </Box>
      )}
      {!activeRoom && (
        <Box marginTop={10} sx={{ width: "100%", textAlign: "center" }}>
          <Typography>No Chat Selected</Typography>
        </Box>
      )}
    </main>
  );
};

export default ChatScreen;
