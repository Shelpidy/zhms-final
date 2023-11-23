"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import AdminPatientsTable from "./subcomponents/AdminPatientsTable";

type PatientProfile = {
  patient: Patient;
  user: User;
  bloodGroup: BloodGroup;
};

const AdminPatientDisplay: React.FC = () => {
  const [patients, setPatients] = useState<PatientProfile[] | null>();
  const [isLoading, setIsLoading] = useState(false);

  const handleRefetch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/patients", { cache: "no-cache" });
      const data = await response.json();
      console.log(data);
      setPatients(data.patients);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    handleRefetch();
  }, []);

  if (!patients) {
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
      <Typography>All Patients</Typography>
      <AdminPatientsTable patients={patients} onRefetch={handleRefetch} />
    </Box>
  );
};

export default AdminPatientDisplay;
