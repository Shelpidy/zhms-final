"use client";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {
  IconButton,
  useMediaQuery,
  useTheme,
  Link,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  FacebookOutlined,
  Twitter,
  Instagram,
  LinkedIn,
  GitHub,
} from "@mui/icons-material";

import AOS from "aos";
import "aos/dist/aos.css";
import { Just_Another_Hand } from "next/font/google";
import Image from "next/image";

type DonorProps = {
  id: number;
  imageUrl: string;
  position: string;
  media: MediaObject;
  name: string;
};

type MediaObject = {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  link?: string;
};

type DonorDetail = {
  donor: Donor;
  bloodGroup: BloodGroup;
};

export function DonorComponent(donor: DonorDetail) {
  const mytheme = useTheme();
  const lessThanTab = useMediaQuery(mytheme.breakpoints.down("md"));

  const aboutImgWidth = lessThanTab ? "66vw" : "22vw";

  React.useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);
  // style={{ overflowX: "scroll"}}
  return (
    <Card variant="elevation" data-aos="zoom-in">
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
          alt="Donor"
          className="rounded"
          style={{ width: aboutImgWidth, aspectRatio: "1" }}
          src={donor.donor.profileImage}
        />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              fontFamily="Poppins-Medium"
              className="font-poppinsLight text-center text-sm md:text-2md"
              gutterBottom
            >
              {donor.donor.firstName}
              {""}
              {donor.donor.middleName} {donor.donor.lastName}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

const DonorsComponent = () => {
  const [donors, setDonors] = useState<DonorDetail[] | null>(null);

  const getDonors = async () => {
    try {
      const response = await fetch("/api/donors", { cache: "no-cache" });
      const data = await response.json();
      console.log(data);
      setDonors(data.donors);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    getDonors();
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ marginTop: 4, marginBottom: 1 }}>
        <Typography variant="h4" color="primary">
          Blood Donors
        </Typography>
      </Box>
      <Divider sx={{ width: "80%" }} />
      <div className="py-5 px-2 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {donors.map((item: DonorDetail, index: number) => {
          return <DonorComponent key={item.donor.donorId} {...item} />;
        })}
      </div>
    </Box>
  );
};

export default DonorsComponent;
