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
// Sample blood groups fetched from the database
const sampleBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Interface for Patient data
interface PatientData {
  email: string;
  diagnosis: string;
  bloodGroup: string;
}

const PatientForm: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    email: "",
    diagnosis: "",
    bloodGroup: "",
  });
  const [bloodGroupsList, setBloodGroupsList] = useState<string[]>([]);
  const [emailVerification, setEmailVerification] = useState<string>("");

  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let emailVerification = emailPattern.test(email);
    if (!emailVerification) {
      setEmailVerification("Invalid email address");
    } else {
      setEmailVerification("");
    }
  };
  // Simulate fetching blood groups from the database
  useEffect(() => {
    setBloodGroupsList(sampleBloodGroups);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPatientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function handleAddPatient(): Promise<void> {
    await handleFormSubmitGeneral(patientData, "/api/patients");
    console.log("Patient Data:", patientData);
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box>
          <Typography variant="h5">Add Patient</Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={patientData.email}
          onChange={(e) => {
            handleInputChange(e);
            validateEmail(e.target.value);
          }}
          name="email"
        />
        <Box
          sx={{ marginTop: 1 }}
          color={emailVerification ? (emailVerification ? "red" : "green") : ""}
        >
          {emailVerification ? (
            <ul>
              <li>{emailVerification}</li>
            </ul>
          ) : null}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Diagnosis"
          variant="outlined"
          fullWidth
          value={patientData.diagnosis}
          onChange={handleInputChange}
          name="diagnosis"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Blood Group</InputLabel>
          <Select
            value={patientData.bloodGroup}
            onChange={(e: any) => handleInputChange(e)}
            label="Blood Group"
            name="bloodGroup"
          >
            {bloodGroupsList.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <CustomButton onClick={handleAddPatient}>submit</CustomButton>
      </Grid>
    </Grid>
  );
};

export default PatientForm;
