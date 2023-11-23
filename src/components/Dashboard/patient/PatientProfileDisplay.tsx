"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/customHooks";
import PatientProfileDetails from "./subcomponents/PatientProfile";

type PatientProfile = {
  patient: Patient;
  user: User;
};

interface PatientProfileProps {
  patient: PatientProfile;
  onRefetch: () => void;
}

const PatientProfileDisplay: React.FC = () => {
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>();

  const currentUser = useCurrentUser();

  const handleRefetch = async () => {
    try {
      /* Fetch the single doctor by userId instead.. use the currentUser 
      object to get userId, Do the same for all profile  {userId,role,profilePicture,displayName} */
      const response = await fetch(
        `/api/patients/${
          currentUser?.userId
        } `,
        {
          cache: "no-cache",
        },
      );
      const data = await response.json();
      if (response.status === 200) {
        console.log(data);
        setPatientProfile(data.patient);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error fetching Doctors:", error);
    }
  };
  useEffect(() => {
    if(currentUser){
      handleRefetch();
    }
  }, [currentUser]);
  
  if (!patientProfile) {
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
      <PatientProfileDetails
        patient={patientProfile}
        onRefetch={handleRefetch}
      />
    </Box>
  );
};

export default PatientProfileDisplay;
