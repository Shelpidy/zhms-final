"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import AdminUsersTable from "./subcomponents/AdminUsersTable";

const AdminUsersDisplay: React.FC = () => {
  const [users, setUsers] = useState<User[] | null>();
  const [isLoading, setIsLoading] = useState(false);
  const handleRefetch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users", { cache: "no-cache" });
      const data = await response.json();
      console.log(data);
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    handleRefetch();
  }, []);

  if (!users) {
    return (
      <Box
        sx={{
          height: "95vh",
          minWidth: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <CircularProgress color="primary" size={30} />
        <Typography sx={{ fontWeight: "bold", color: "primary.main" }}>
          LOADING...
        </Typography>
      </Box>
    );
  }
  return (
    <Box>
      <Typography>All Users</Typography>
      <AdminUsersTable users={users} />
    </Box>
  );
};

export default AdminUsersDisplay;
