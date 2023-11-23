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

type DoctorProps = {
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

export function DoctorComponent(doctor: DoctorProfile) {
  const mytheme = useTheme();
  const lessThanTab = useMediaQuery(mytheme.breakpoints.down("md"));

  const aboutImgWidth = lessThanTab ? "100vw" : "50vw";

  React.useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  return (
    <Card data-aos="zoom-in">
      <CardContent>
        <img
          alt="Doctor"
          className="rounded"
          style={{ width: aboutImgWidth, aspectRatio: "1" }}
          src={doctor.user.profileImage}
        />
        <div className="flex flex-row justify-center items-center pb-3">
          <Link target="_blank" href="/">
            <IconButton aria-label="link to facebook">
              <FacebookOutlined />
            </IconButton>
          </Link>

          <Link target="_blank" href="/">
            <IconButton aria-label="link to twitter">
              <Twitter />
            </IconButton>
          </Link>

          <Link target="_blank" href="/">
            <IconButton aria-label="link to instagram">
              <Instagram />
            </IconButton>
          </Link>

          <Link target="_blank" href="/">
            <IconButton aria-label="link to face book">
              <LinkedIn />
            </IconButton>
          </Link>
        </div>
        <Typography
          fontFamily="Poppins-Medium"
          className="font-poppinsMedium text-center text-sm md:text-2md"
          gutterBottom
        >
          {doctor.user.firstName} {doctor.user.middleName}{" "}
          {doctor.user.lastName}
        </Typography>

        <Typography
          fontFamily="Poppins-Light"
          className="font-poppinsLight text-center text-sm md:text-2md"
        >
          {doctor.specialization.specializationName}
        </Typography>
      </CardContent>
    </Card>
  );
}

type DoctorProfile = {
  doctor: Doctor;
  user: User;
  specialization: Specialization;
};

function DoctorsComponent() {
  const [doctors, setDoctors] = useState<DoctorProfile[] | null>(null);

  // Fetch Doctor and Patient Here

  const getDoctors = async () => {
    try {
      const response = await fetch("/api/doctors", { cache: "no-cache" });
      const data = await response.json();
      console.log(data);
      setDoctors(data.doctors);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  if (!doctors) {
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

  // const Doctors: DoctorProps[] = [
  //   {
  //     id: 1,
  //     imageUrl: "/hospital/about.png",
  //     position: "Chief Executive Officer",
  //     name: "Isaac Johnson",
  //     media: {
  //       facebook: "https://www.facebook.com/profile.php?id=100015138280039",
  //       twitter: "https://twitter.com/IsaacCEJohnson2",
  //       instagram: "https://www.instagram.com/super_jay06",
  //       linkedin: "https://www.linkedin.com/in/isaac-johnson-b50875167/",
  //       github: "https://github.com/ICEJ-jr",
  //     },
  //   },
  //   {
  //     id: 2,
  //     imageUrl: "/hospital/about.png",
  //     position: "Chief Operating Officer",
  //     name: "Mohamed Shelpidy Kamara",
  //     media: {
  //       facebook: "https://www.facebook.com/profile.php?id=100008312778585",
  //       twitter: "https://twitter.com/medshelpidy",
  //       instagram: "https://www.instagram.com/shelpidy/",
  //       linkedin: "https://www.linkedin.com/in/mohamed-kamara-6894b1230/",
  //       github: "https://github.com/Shelpidy",
  //     },
  //   },
  //   {
  //     id: 3,
  //     imageUrl: "/hospital/about.png",
  //     position: "Lead UI/UX Designer",
  //     name: "Afanwi Pearl",
  //     media: {
  //       facebook: " https://www.facebook.com/afanwi.pearl.9",
  //       twitter: " https://twitter.com/AfanwiPearl",
  //       instagram: "https://instagram.com/afanwi_pearl?igshid=YmMyMTA2M2Y=",
  //       linkedin: " https://www.linkedin.com/in/afanwi-pearl-94112a1aa/",
  //       github: "",
  //     },
  //   },
  //   {
  //     id: 4,
  //     imageUrl: "/hospital/about.png",
  //     position: "Lead Mobile Developer",
  //     name: "Hamed Kemokai",
  //     media: {
  //       facebook: " https://www.facebook.com/hamedkemokai1",
  //       twitter: "https://twitter.com/Ing_hamed",
  //       instagram: "",
  //       linkedin: "https://www.linkedin.com/in/hamed-idriss-kemokai-57299b104/",
  //       github: "",
  //     },
  //   },
  // ];

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
          Meet Our Doctors
        </Typography>
      </Box>
      <Divider sx={{ width: "80%" }} />
      <div className="py-5 px-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {doctors.map((item: DoctorProfile, index: number) => {
          return <DoctorComponent key={item.doctor.doctorId} {...item} />;
        })}
      </div>
    </Box>
  );
}

export default DoctorsComponent;
