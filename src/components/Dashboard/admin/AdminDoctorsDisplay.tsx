"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import AdminDoctorsTable from "./subcomponents/AdminDoctorsTable";

type DoctorProfile = {
  doctor: Doctor;
  user: User;
  specialization: Specialization;
};

const AdminDoctorsDisplay: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorProfile[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefetch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/doctors", { cache: "no-cache" });
      const data = await response.json();
      console.log(data);
      setDoctors(data.doctors);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    handleRefetch();
  }, []);

  if (!doctors) {
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
      <Typography>All Doctors</Typography>
      <AdminDoctorsTable doctors={doctors} onRefetch={handleRefetch} />
    </Box>
  );
};

export default AdminDoctorsDisplay;
