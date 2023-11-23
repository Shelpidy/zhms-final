"use client";
import React from "react";
import { Box, useTheme, Avatar, Typography } from "@mui/material";
import moment from "moment";

export interface BubbleProps {
  messageId: string;
  userId: string;
  avatar: string;
  message: string;
  roomId?: string;
  username: string;
  alignment: "left" | "right";
  date: string | Date;
}

const MessageBubble: React.FC<BubbleProps> = ({
  avatar,
  message,
  username,
  alignment,
  userId,
  date,
}) => {
  const theme = useTheme();
  let bgColor =
    alignment === "left"
      ? theme.palette.primary.light
      : theme.palette.primary.main;
  let color =
    alignment === "left"
      ? theme.palette.primary.main
      : theme.palette.primary.light;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: alignment === "left" ? "flex-start" : "flex-end",
        gap: "3px",
        margin: "5px",
        padding: "5px",
      }}
    >
      {alignment === "left" && (
        <Avatar
          sx={{ width: "30px", height: "30px" }}
          alt={username}
          src={avatar}
        />
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: bgColor,
          width: "fit-content",
          maxWidth: "400px",
          padding: "8px",
          borderRadius: "4px",
        }}
      >
        <Typography color={color} variant="body2" gutterBottom>
          {message}
        </Typography>
        <Typography color="grey" variant="caption">
          {moment(date).fromNow()}
        </Typography>
      </Box>
      {alignment === "right" && (
        <Avatar
          sx={{ width: "30px", height: "30px" }}
          alt={username}
          src={avatar}
        />
      )}
    </Box>
  );
};

export default MessageBubble;
