"use client";
import { Box, CircularProgress, Typography, Card } from "@mui/material";
import { useEffect, useState } from "react";
import DoctorAppointmentTable from "./subcomponents/DoctorAppointmentTable";
import { useCurrentUser } from "@/hooks/customHooks";
import { useRouter } from "next/navigation";
import { CompareAppointmentBarCharts } from "../charts/AppointmentPerMonthCharts";

type DoctorProfile = {
  doctor: Doctor;
  user: User;
  specialization: Specialization;
};

type PatientProfile = {
  patient: Patient;
  user: User;
  bloodGroup: BloodGroup;
};

type AppointmentDetail = {
  patient: PatientProfile;
  appointment: Appointment;
  roomId: string;
};

interface TotalAppointmentDataPoint {
  year: string;
  totalPending: number;
  totalCompleted: number;
}

const DoctorAppointmentDisplay: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentDetail[] | null>(null);
  const [plotData, setPlotData] = useState<TotalAppointmentDataPoint[]>([]);
  const currentUser = useCurrentUser();
 

  const handleRefetch = async () => {
    try {
      const totalAppointmentData: TotalAppointmentDataPoint[] = [
        { year: "2023", totalCompleted: 70, totalPending: 50 },
      ];
      setPlotData(totalAppointmentData);
      const response = await fetch(
        `/api/appointments/doctors/${currentUser?.userId}`,
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
      <div className="grid grid-cols-1 my-3">
        <Card variant="outlined">
          <CompareAppointmentBarCharts totalData={plotData} />
        </Card>
      </div>
      <div className="flex items-center justify-center m-auto">
        <DoctorAppointmentTable
          refresh={handleRefetch}
          appointments={appointments}
        />
      </div>
    </div>
  );
};

export default DoctorAppointmentDisplay;
