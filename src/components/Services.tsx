import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import AOS from "aos";
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
      title: "Public Health 1 & 2",
      description: `Step into the realm of community well-being and disease prevention. Our Public Health Certificate equips you with the knowledge to assess health challenges, design effective interventions, and advocate for healthier societies. Dive into epidemiology, health policies, and health promotion strategies, positioning yourself as a force for positive change.`,
    },
    {
      id: 2,
      imageUrl: "/hospital/reproductive.gif",
      title: "Reproductive Health",
      description: `Empower yourself with the ability to promote informed reproductive choices. The Reproductive Health Diploma delves into topics of family planning, sexual education, and maternal health. Become a champion of reproductive rights, contributing to the advancement of comprehensive healthcare for all.`,
    },
    {
      id: 3,
      imageUrl: "/hospital/clinic.gif",
      title: "Clinical Health",
      description: `Embark on a transformative journey into the heart of patient care. Our Clinical Healthcare Diploma not only imparts medical knowledge but also nurtures the virtues of compassion and empathy. From medical ethics to diagnostic skills, this program prepares you to excel in the dynamic world of healthcare.`,
    },
    {
      id: 4,
      imageUrl: "/hospital/computer.gif",
      title: "Basic Computer Skills",
      description: `In an era defined by digital innovation, our Basic Computer Skills Certificate equips you with the essential tools for success. Gain fluency in software usage, data management, and effective internet navigation. This Service is designed to bridge the digital divide and empower you to harness technology for personal and professional growth.`,
    },
    {
      id: 5,
      imageUrl: "/hospital/driving.gif",
      title: "Driving School",
      description: `Open new horizons of independence with our comprehensive Driving School Certificate. Under the guidance of seasoned instructors, master the art of safe and responsible driving. Whether you're embarking on your first driving experience or seeking to enhance your skills, this Service ensures you hit the road with confidence`,
    },
  ];

  return (
    <div className="pt-5 px-2 grid grid-cols-1 gap-4 md:grid-cols-3">
      {Services.map((item: ServiceProps, index: number) => {
        return <ServiceComponent key={item.id} {...item} />;
      })}
    </div>
  );
}

export default ServicesSection;
