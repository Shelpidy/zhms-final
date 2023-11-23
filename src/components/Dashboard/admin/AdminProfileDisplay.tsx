"use client";

import { useCurrentUser } from "@/hooks/customHooks";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import AdminProfileDetails from "./subcomponents/AdminProfile";

type AdminProfile = {
  admin: Admin;
  user: User;
};

const AdminProfileDisplay: React.FC = () => {
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>();
  const [adminProfiles, setAdminProfiles] = useState<AdminProfile[] | null>();
  const currentUser = useCurrentUser();

  const handleRefetch = async () => {
    try {
      console.log(currentUser);
      /* Fetch the single admin by userId instead.. use the currentUser 
      object to get userId, Do the same for all profile  {userId,role,profilePicture,displayName} */
      const response = await fetch(`/api/admins/${currentUser?.userId}`);
      const data = await response.json();
      if (response.status === 200) {
        console.log(data.admin);
        setAdminProfile(data.admin);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };
  useEffect(() => {
    if(currentUser){
         handleRefetch();
    }
  }, [currentUser]);

  const handleRefetchProfiles = async () => {
    try {
      /* Fetch the single admin by userId instead.. use the currentUser 
      object to get userId, Do the same for all profile  {userId,role,profilePicture,displayName} */
      const response = await fetch(`/api/admins/`, {
        cache: "no-cache",
      });
      const data = await response.json();
      if (response.status === 200) {
        console.log(data.admins);
        setAdminProfiles(data.admins);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };
  useEffect(() => {
    handleRefetchProfiles();
  }, []);

  if (!adminProfile || !adminProfiles) {
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
      <AdminProfileDetails
        admins={adminProfiles}
        onRefetchAdmins={handleRefetchProfiles}
        admin={adminProfile}
        onRefetch={handleRefetch}
      />
    </Box>
  );
};

export default AdminProfileDisplay;
