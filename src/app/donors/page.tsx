"use client";

import {
  Box,
  CircularProgress,
  Grid,
  Avatar,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  IconButton,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { PhotoCamera, Edit, SaveAlt } from "@mui/icons-material";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { DonorComponent } from "@/components/DonorComponent";

const updateUser = {
  address: "123 Main Street",
  contactNumber: "1234567890",
  dateOfBirth: "31st August, 2023",
  email: "kamaradennis36@gmail.com",
  specialization: "bone specialist",
  firstName: "Dennis",
  bloodGroupName: "A+",
  gender: "male",
  groupName: "O+",
  volume: 20,
  lastName: "Kamara",
  profileImage:
    null ||
    "https://www.bing.com/th?id=OIP.rq0bLboVfwhtwS9EnvZ0CAHaJl&w=76&h=100&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
  role: "patient",
};

type DonorDetail = {
  donor: Donor;
  bloodGroup: BloodGroup;
};

function Donors() {
  const [donors, setDonors] = useState<DonorDetail[] | null>();
  const [isLoading, setIsLoading] = useState(false);

  const handleRefetch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/donors", { cache: "no-cache" });
      const data = await response.json();
      console.log(data);
      setDonors(data.donors);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleRefetch();
  }, []);

  if (!donors) {
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
      <Grid
        container
        spacing={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ marginTop: 15, marginBottom: 5 }}>
          List of Donors
        </Typography>
        <div className="py-5 px-2 mx-3 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {donors.map((item: DonorDetail, index: number) => {
            return <DonorComponent key={item.donor.donorId} {...item} />;
          })}
        </div>
      </Grid>
    </Box>
  );
}

export default Donors;
