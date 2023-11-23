"use client";
import MessageBubble, { BubbleProps } from "@/components/chats/Bubble";
import { useCurrentUser } from "@/hooks/customHooks";
import { SendOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface RoomType {
  roomId: string;
  recipientId: string;
  username: string;
  lastMessage: string;
  numberOfUnreadMessages: number;
  avatar: string;
  date: string | Date;
}

interface MessageDisplayProps {
  roomId: string;
  socket: Socket;
  room: RoomType | null;
}

interface BubbleMessage {
  senderId: string;
  recipientId: string;
  message: string;
  roomId: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({
  roomId,
  socket,
  room,
}) => {
  const [typing, setTyping] = useState<boolean>(false);
  const [online, setOnline] = useState<boolean>(false);
  const [messages, setMessages] = useState<BubbleProps[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const currentUser = useCurrentUser();
  let ref = React.useRef(null);

  const theme = useTheme();

  useEffect(() => {
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("typing", (data: { typing: boolean }) => {
      setTyping(data.typing);
    });

    socket.on("online", (data: { online: boolean }) => {
      setOnline(data.online);
    });
    socket.on("msg", (message: BubbleProps) => {
      console.log({ message });
      if(currentUser){
        let alignment:"right"|"left" = message.userId == currentUser?.userId ? "right" : "left";
        let newMessage = {...message,alignment}
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }

    });

    socket.on("message", (message: BubbleProps) => {
      // setMessages((prevMessages) => [...prevMessages, message]);
      console.log(message)
    });

    // Clean up on unmount
    // return () => {
    //   socket.disconnect();
    // };
  }, [socket,currentUser]);


  useEffect(() => {
    async function getMessages() {
      try {
        let response = await fetch(
          `/api/messages/${roomId}/${currentUser?.userId}`,
          { next: { revalidate: 0 }, method: "GET" },
        );
        let data = await response.json();
        if (response.status === 200) {
          setMessages(data.messages.reverse());
          console.log({ messages: data.messages });
        } else {
          console.log(data);
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (currentUser) {
      getMessages();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      socket.emit("activeRoom", { roomId: roomId, userId: currentUser.userId });
    }
  }, [socket, roomId, currentUser]);

  const handleSendMessage = () => {
    if (currentUser?.userId && room?.recipientId && messageInput) {
      let msg: BubbleMessage = {
        senderId: currentUser.userId as string,
        roomId: roomId,
        recipientId: room.recipientId,
        message: messageInput,
      };
      console.log({ msg });
      socket.emit("msg", msg);
      setMessageInput("");
    }
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        marginLeft: "12px",
        backgroundColor: "#f6f6f6",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
          minWidth: "50vw",
          width: "inherit",
          backgroundColor: theme.palette.primary.main,
          padding: "8px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 1,
            padding: "8px",
            borderRadius: "2px",
          }}
        >
          <Avatar
            alt="Profile Image"
            src={room?.avatar}
            sx={{ width: 30, height: 30 }}
          />
          <Typography variant="body1" color="primary.light">
            {room?.username}
          </Typography>
        </Box>
        <Typography color="primary.light" variant="body2">
          {typing && <span>typing...</span>}
        </Typography>
        <Typography className="mx-5" color="primary.light" variant="body2">
          {online && <span>online</span>}
        </Typography>
      </Box>
      <Box
        // className="hide-scrollbar"
        sx={{
          minWidth: "50vw",
          width: "inherit",
          overFlowY: "scroll",
        }}
      >
        {messages.map((message) => {
          return <MessageBubble key={message.messageId} {...message} />;
        })}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 3,
          justifyContent: "center",
          marginTop: "8px",
        }}
      >
        <Box sx={{ marginBottom: "10px" }}>
          <TextField
            onChange={(e) => setMessageInput(e.target.value)}
            variant="filled"
            value={messageInput}
            InputProps={{
              style: {
                borderRadius: "2%",
                minWidth: "25vw",
                borderBottom: "none",
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSendMessage}>
                    <SendOutlined />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            multiline
            size="small"
            placeholder="Type a message..."
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MessageDisplay;
