"use client";
import { Box, CircularProgress, Typography, Card } from "@mui/material";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/customHooks";
import { useRouter } from "next/navigation";
import { CompareAppointmentBarCharts } from "../charts/AppointmentPerMonthCharts";
import PatientAppointmentTable from "./subcomponents/PatientAppointmentTable";

type DoctorProfile = {
  doctor: Doctor;
  user: User;
  specialization: Specialization;
};

type AppointmentDetail = {
  doctor: DoctorProfile;
  appointment: Appointment;
  roomId: string;
};

const PatientAppointmentDisplay: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentDetail[]>([]);
  const [refresh, setRefresh] = useState<number>(0);
  const currentUser = useCurrentUser();
  const router = useRouter();

  const handleRefetch = async () => {
    try {
      const response = await fetch(
        `/api/appointments/patients/${
          currentUser?.userId
        }`,
        { cache: "no-cache" },
      );
      const data = await response.json();
      console.log(data);
      setAppointments(data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    if(currentUser){
       handleRefetch();
    }
  }, [currentUser]);

  if (!appointments) {
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

  ////
  return (
    <div className="grid grid-cols-1 gap-5 px-3">
      <Typography>Appointments</Typography>
      <div className="flex items-center justify-center m-auto">
        <PatientAppointmentTable
          refresh={() => router.refresh()}
          appointments={appointments}
        />
      </div>
    </div>
  );
};

export default PatientAppointmentDisplay;
