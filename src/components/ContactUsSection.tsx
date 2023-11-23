"use client";
import React from "react";
import { Typography, Box } from "@mui/material";
import { CustomMapComponent } from "./GoogleMapComponent";
import ContactForm from "./ContactForm";
import { Divider } from "@mui/material";

function ContactUs() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        flexDirection: "column", // Ensure content is stacked vertically
        width: "95vw",
      }}
    >
      <Box sx={{ marginTop: 4, marginBottom: 1 }}>
        <Typography variant="h4" color="primary">
          Contact Us
        </Typography>
      </Box>
      <Divider sx={{ width: "80%" }} />
      <CustomMapComponent center={{ lng: -13.22992, lat: 8.483802 }} />
      <Box>
        <ContactForm />
      </Box>
    </Box>
  );
}

export default ContactUs;
