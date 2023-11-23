"use client";
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

interface DoctorData {
  email: string;
  specialization: string;
}

const DoctorForm: React.FC = () => {
  const [DoctorData, setDoctorData] = useState<DoctorData>({
    email: "",
    specialization: "",
  });

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setDoctorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function handleAddDoctor(): Promise<void> {
    await handleFormSubmitGeneral(DoctorData, "/api/doctors");
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box>
          <Typography variant="h5">Add Doctor</Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={DoctorData.email}
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
          label="Specialization"
          variant="outlined"
          fullWidth
          value={DoctorData.specialization}
          onChange={handleInputChange}
          name="specialization"
        />
      </Grid>
      <Grid item xs={12}>
        <CustomButton onClick={handleAddDoctor}>submit</CustomButton>
      </Grid>
    </Grid>
  );
};

export default DoctorForm;
