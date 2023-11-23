import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";

export default function UserCard(props: {
  firstName: string;
  lastName: string;
  profileImage: string | null;
  contactNumber: string;
  gender: string;
  dateOfBirth: Date;
  address: string;
  email: string;
  role: string;
}) {
  const {
    firstName,
    lastName,
    profileImage,
    contactNumber,
    gender,
    dateOfBirth,
    address,
    email,
    role,
  } = props;

  return (
    <Card sx={{ maxWidth: 450 }}>
      <Box
        className="relative overflow-hidden rounded-sm pt-1"
        sx={{ height: "65vh" }}
      >
        {profileImage ? (
          <Image
            layout="fill"
            objectFit="cover"
            alt="Profile Image"
            src={profileImage}
          />
        ) : (
          <div
            style={{
              backgroundColor: "#f0f0f0",
              width: "100%",
              height: "100%",
            }}
          />
        )}
      </Box>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {firstName} {lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gender: {gender}
          <br />
          Date of Birth: {dateOfBirth.toDateString()}
          <br />
          Address: {address}
          <br />
          Contact: {contactNumber}
          <br />
          Email: {email}
          <br />
          Role: {role}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
