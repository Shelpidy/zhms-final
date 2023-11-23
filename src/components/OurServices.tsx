"use client";
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import AOS from "aos";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import "aos/dist/aos.css";

type ServiceProps = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};

function ServiceComponent({ title, description, imageUrl }: ServiceProps) {
  React.useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  return (
    <div data-aos="zoom-in" className="shadow-md rounded-md dark:shadow-lg">
      <CardMedia
        component="img"
        height="50"
        image={imageUrl}
        // image="../../src/assets/constellation-bg.svg"
        alt="Image of the member"
      />
      <CardContent>
        <Typography fontFamily="Poppins-Medium" gutterBottom variant="h6">
          {title}
        </Typography>

        <p className="font-poppinsLight text-md text-justify">{description}</p>
      </CardContent>
    </div>
  );
}

function ServicesSection() {
  const Services: ServiceProps[] = [
    {
      id: 1,
      imageUrl: "/hospital/public.gif",
      title: "Doctor Appointment Service",
      description: `Step into the realm of community well-being and disease prevention. Our Public Health Certificate equips you with the knowledge to assess health challenges, design effective interventions, and advocate for healthier societies. Dive into epidemiology, health policies, and health promotion strategies, positioning yourself as a force for positive change.`,
    },
    {
      id: 2,
      imageUrl: "/hospital/reproductive.gif",
      title: "Blood Donation & Transfusion",
      description: `Empower yourself with the ability to promote informed reproductive choices. The Reproductive Health Diploma delves into topics of family planning, sexual education, and maternal health. Become a champion of reproductive rights, contributing to the advancement of comprehensive healthcare for all.`,
    },
    {
      id: 3,
      imageUrl: "/hospital/clinic.gif",
      title: "Medical Analytics",
      description: `Embark on a transformative journey into the heart of patient care. Our Clinical Healthcare Diploma not only imparts medical knowledge but also nurtures the virtues of compassion and empathy. From medical ethics to diagnostic skills, this program prepares you to excel in the dynamic world of healthcare.`,
    },
  ];

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
          Our Services
        </Typography>
      </Box>
      <Divider sx={{ width: "80%" }} />

      <div className="pt-5 px-2 grid grid-cols-1 gap-4 md:grid-cols-3">
        {Services.map((item: ServiceProps, index: number) => {
          return <ServiceComponent key={item.id} {...item} />;
        })}
      </div>
    </Box>
  );
}

export default ServicesSection;
