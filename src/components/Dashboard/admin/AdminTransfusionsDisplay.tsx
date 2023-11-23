"use client";

import { Box, CircularProgress, Typography, Card } from "@mui/material";
import { useState, useEffect } from "react";
import AdminTransfionsTable from "./subcomponents/AdminTransfusionTable";
import {
  CompareTransfusionBarCharts,
  TransfusionsBarChart,
  TransfusionsLineChart,
} from "../charts/TransfusionPerMonthCharts";

type BloodTransfusionDetail = {
  donor?: Donor;
  requirer: RequirerDetails;
  transfusion: BloodTransfusion;
  bloodGroup: BloodGroup;
};

type RequirerDetails = {
  requirer: Requirer;
  user: User;
  bloodGroup: BloodGroup;
};

interface TransfusionDataPoint {
  month: string;
  transfusion: number;
  transfusionRequest: number;
}

const AdminBloodTransfusionsDisplay: React.FC = () => {
  const [transfusions, setBloodTransfusions] = useState<
    BloodTransfusionDetail[] | null
  >();
  const [isLoading, setIsLoading] = useState(false);

  const appointmentPerMonthData: TransfusionDataPoint[] = [
    {
      month: "Jan",
      transfusionRequest: 10,
      transfusion: 20,
    },
    {
      month: "Feb",
      transfusionRequest: 20,
      transfusion: 10,
    },
    {
      month: "Mar",
      transfusionRequest: 30,
      transfusion: 20,
    },
    {
      month: "Apr",
      transfusionRequest: 15,
      transfusion: 22,
    },
    {
      month: "May",
      transfusionRequest: 18,
      transfusion: 20,
    },
    {
      month: "Jun",
      transfusionRequest: 20,
      transfusion: 20,
    },
    {
      month: "Jul",
      transfusionRequest: 10,
      transfusion: 26,
    },
    {
      month: "Aug",
      transfusionRequest: 10,
      transfusion: 20,
    },
    {
      month: "Sep",
      transfusionRequest: 5,
      transfusion: 20,
    },
    {
      month: "Oct",
      transfusionRequest: 10,
      transfusion: 20,
    },
    {
      month: "Nov",
      transfusionRequest: 30,
      transfusion: 26,
    },
    {
      month: "Dec",
      transfusionRequest: 10,
      transfusion: 20,
    },
  ];

  let chartsData = {
    data: appointmentPerMonthData,
  };
  const handleRefetch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/bloodtransfusions", {
        cache: "no-cache",
      });
      // Check for 200 or required status
      const data = await response.json();
      console.log(data);
      setBloodTransfusions(data.transfusions);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleRefetch();
  }, []);

  if (!transfusions) {
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
      <Typography>All Transfusions</Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card variant="outlined">
          <TransfusionsLineChart {...chartsData} />
        </Card>
        <Card variant="outlined">
          <TransfusionsBarChart {...chartsData} />
        </Card>
      </div>
      <div>
        <Card variant="outlined">
          <CompareTransfusionBarCharts {...chartsData} />
        </Card>
      </div>
      <div className="flex items-center justify-center m-auto gap-2">
        <AdminTransfionsTable
          transfusions={transfusions}
          onRefetch={handleRefetch}
        />
      </div>
    </div>
  );
};

export default AdminBloodTransfusionsDisplay;
