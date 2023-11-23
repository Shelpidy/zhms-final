"use client";
import React from "react";
import { Box, useTheme, Avatar, Typography } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import moment from "moment";

interface RoomProps {
  roomId: string;
  recipientId: string;
  username: string;
  lastMessage: string;
  numberOfUnreadMessages: number;
  avatar: string;
  handleClick: (roomId: string) => void;
  date: string | Date;
}

const MessageRoom: React.FC<RoomProps> = ({
  avatar,
  roomId,
  numberOfUnreadMessages,
  lastMessage,
  username,
  recipientId,
  handleClick,
  date,
}) => {
  const theme = useTheme();
  return (
    <>
      <ListItem onClick={() => handleClick(roomId)} alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={username} src={avatar} />
        </ListItemAvatar>
        <ListItemText
          primary={username}
          secondary={
            <React.Fragment>
              {lastMessage}
              <Typography
                sx={{ display: "inline", marginLeft: "10px" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {numberOfUnreadMessages}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
};

export default MessageRoom;
