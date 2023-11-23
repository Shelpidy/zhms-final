import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Container,
  makeStyles,
  TextField,
  Grid,
} from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import CustomButton from "./CustomButton";
import { handleFormSubmitGeneral } from "@/utils/data";

// Interface for Patient data
interface AppointmentData {
  patientemail: string;
  doctoremail: string;
  reasons: string;
  note: string;
  date: string;
}

const AppointmentForm: React.FC = () => {
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    patientemail: "",
    doctoremail: "",
    reasons: "",
    note: "",
    date: "",
  });
  const [patientEmailVerification, setPatientEmailVerification] =
    useState<string>("");
  const [doctorEmailVerification, setDoctorEmailVerification] =
    useState<string>("");
  const validateEmail = (email: string, people: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let emailVerification = emailPattern.test(email);
    if (!emailVerification && people !== "doctor") {
      setDoctorEmailVerification("Invalid Email");
    } else if (!emailVerification && people !== "patient") {
      setPatientEmailVerification("Invalid Email");
    } else {
      setPatientEmailVerification("");
      setDoctorEmailVerification("");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setAppointmentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function handleAddAppointment(): Promise<void> {
    await handleFormSubmitGeneral(appointmentData, "/api/appointments");
  }
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box>
          <Typography variant="h5">Add Appoinment</Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Doctor-Email"
          variant="outlined"
          fullWidth
          value={appointmentData.doctoremail}
          onChange={(e) => {
            handleInputChange(e);
            validateEmail(e.target.value, "doctor");
          }}
          name="doctoremail"
        />
        <Box
          sx={{ marginTop: 1 }}
          color={
            patientEmailVerification
              ? patientEmailVerification
                ? "red"
                : "green"
              : ""
          }
        >
          {patientEmailVerification ? (
            <ul>
              <li>{patientEmailVerification}</li>
            </ul>
          ) : null}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Patient-Email"
          variant="outlined"
          fullWidth
          value={appointmentData.patientemail}
          onChange={(e) => {
            handleInputChange(e);
            validateEmail(e.target.value, "patient");
          }}
          name="patientemail"
        />
        <Box
          sx={{ marginTop: 1 }}
          color={
            doctorEmailVerification
              ? doctorEmailVerification
                ? "red"
                : "green"
              : ""
          }
        >
          {doctorEmailVerification ? (
            <ul>
              <li>{doctorEmailVerification}</li>
            </ul>
          ) : null}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Appointment Date"
          name="date"
          type="date"
          value={appointmentData.date}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Reasons"
          variant="outlined"
          fullWidth
          value={appointmentData.reasons}
          onChange={handleInputChange}
          name="reasons"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Notes"
          variant="outlined"
          multiline
          rows={5}
          fullWidth
          value={appointmentData.note}
          onChange={handleInputChange}
          name="note"
        />
      </Grid>
      <Grid item xs={12}>
        <CustomButton onClick={handleAddAppointment}>submit</CustomButton>
      </Grid>
    </Grid>
  );
};

export default AppointmentForm;
