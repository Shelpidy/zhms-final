"use client";
import {
  Divider,
  Card,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  Container,
  Box,
} from "@mui/material";
import React from "react";
import Image from "next/image";

type AboutProps = {
  imageUrl: string;
  missionText?: string;
  backgroundText?: string;
  vissionText?: string;
};

function AboutSection({
  imageUrl,
  missionText,
  vissionText,
  backgroundText,
}: AboutProps) {
  const [activeTab, setActiveTab] = React.useState<number>(0);

  // useEffect(()=>{
  //     AOS.init({duration:1000})
  // },[])

  return (
    <Box
      className="mb-8 mt-5"
      sx={{
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        flexDirection: "column", // Ensure content is stacked vertically
      }}
    >
      <Box sx={{ marginTop: 4, marginBottom: 1 }}>
        <Typography variant="h4" color="primary">
          About ZeeHealth
        </Typography>
      </Box>
      <Divider sx={{ width: "80%" }} />
      <Box
        className="grid w-full gird-cols-1 gap-5 md:grid-cols-2"
        sx={{ marginTop: 3 }}
      >
        <Box
          className="relative overflow-hidden rounded-sm pt-1"
          sx={{ height: "65vh" }}
        >
          <Image fill priority alt="About Image" src={imageUrl} />
        </Box>
        <Box className="px-4">
                <Typography fontFamily="PoppinsLight">
                 
Welcome to ZeeHealth, where we are transforming the landscape of healthcare and blood donation management. Our platform is designed with a mission to make the interaction between patients and healthcare providers more seamless and to streamline the blood donation process.
                  <br />
                  At ZeeHealth, we are driven by a patient-centric approach. Our user-friendly interface prioritizes the needs and convenience of patients, making appointment scheduling a breeze. We believe that by simplifying the process, we contribute to a more positive and accessible healthcare experience.
                  <br />
                  What sets us apart is our commitment to empowering healthcare providers. We offer a comprehensive system that not only facilitates efficient appointment management but also reduces administrative burdens, allowing providers to focus on what matters most – delivering quality care.
                  {/* <br/>
                  Beyond appointments, we are dedicated to building a community around blood donation. Our platform serves as a hub for donors and those in need, fostering connections and creating a culture of giving. We believe that everyone can play a part in saving lives. */}
                  <br/>
                  <i>
                    <b>
                  Key features of our platform include easy appointment scheduling, real-time availability tracking for healthcare providers, and a blood donation hub that connects donors with local events. We invite you to join us in making a difference – whether you are a patient seeking timely care or an individual looking to contribute to the noble cause of blood donation, ZeeHealth is here for you.
                </b>
                  </i>
                </Typography>
                {/* <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae, odit. Expedita voluptates a, voluptatibus fugit vel nihil ut quidem reprehenderit iste alias aperiam quaerat rem dolorum modi velit id natus?</p> */}
              </Box>
      </Box>
    </Box>
  );
}

export default AboutSection;
