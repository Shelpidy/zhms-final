"use client";

import { Box, CircularProgress, Typography, Card } from "@mui/material";
import { useState, useEffect } from "react";
import AdminDonorsTable from "./subcomponents/AdminDonorsTable";
import {
  BloodDonationsLineChart,
  CompareBloodGroupBarCharts,
} from "../charts/BloodGroupCharts";

type DonorDetail = {
  donor: Donor;
  bloodGroup: BloodGroup;
};

interface BloodDonationDataPoint {
  month: string;
  donation: number;
}

interface BloodGroupDataPoint {
  group: string;
  amount: number;
}

const AdminDonorsDisplay: React.FC = () => {
  const [donors, setDonors] = useState<DonorDetail[] | null>();
  const [isLoading, setIsLoading] = useState(false);

  const donationPerMonthData: BloodDonationDataPoint[] = [
    {
      month: "Jan",
      donation: 10,
    },
    {
      month: "Feb",
      donation: 20,
    },
    {
      month: "Mar",
      donation: 15,
    },
    {
      month: "Apr",
      donation: 5,
    },
    {
      month: "May",
      donation: 10,
    },
    {
      month: "Jun",
      donation: 8,
    },
    {
      month: "Jul",
      donation: 6,
    },
    {
      month: "Aug",
      donation: 21,
    },
    {
      month: "Sep",
      donation: 20,
    },
    {
      month: "Oct",
      donation: 19,
    },
    {
      month: "Nov",
      donation: 10,
    },
    {
      month: "Dec",
      donation: 25,
    },
  ];

  const totalBloodGroupData: BloodGroupDataPoint[] = [
    { group: "A-", amount: 45 },
    { group: "A+", amount: 70 },
    { group: "AB-", amount: 60 },
    { group: "AB+", amount: 30 },
    { group: "B-", amount: 60 },
    { group: "B+", amount: 45 },
    { group: "O-", amount: 40 },
    { group: "O+", amount: 50 },
  ];

  let chartsData = {
    data: donationPerMonthData,
    bloodGroupData: totalBloodGroupData,
  };

  const handleRefetch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/donors", { cache: "no-cache" });
      const data = await response.json();
      console.log(data);
      setDonors(data.donors);
    } catch (error) {
      console.error("Error fetching appointments:", error);
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
    <div className="grid grid-cols-1 gap-5 px-3">
      <Typography>Donors</Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card variant="outlined">
          <BloodDonationsLineChart {...chartsData} />
        </Card>
        <Card variant="outlined">
          <CompareBloodGroupBarCharts {...chartsData} />
        </Card>
      </div>
      <div className="flex items-center justify-center m-auto">
        <AdminDonorsTable donors={donors} onRefetch={handleRefetch} />
      </div>
    </div>
  );
};

export default AdminDonorsDisplay;
