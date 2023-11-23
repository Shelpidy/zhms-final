"use client";
import React, { useState } from "react";
import {
  Button,
  Container,
  TextField,
  Box,
  Typography,
  Grid,
  Divider,
  Card,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import CustomButton from "@/components/CustomButton";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import ZHLogo from "@/components/Logo/Logo";
import { LoadingButton } from "@mui/lab";
import { LocalDiningSharp } from "@mui/icons-material";
const Toast = Swal.mixin({
  toast: true,
  position: "center",
  timer: 3000,
  timerProgressBar: true,
  showConfirmButton: false,
});

export const metadata = {
  title: "SLMS | Signin",
  description: "Digital Learning Platform",
};

const SignInPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [cookie, setCookie] = useCookies(["token"]);
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async () => {
    setLoading(true);
    try {
      console.log(formData);
      let reponse = await fetch("/api/auth/signin/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      let data = await reponse.json();
      if (reponse.status === 201) {
        setCookie("token", String(data.token));
        window.location.assign("/");
      } else {
        Toast.fire({
          icon: "error",
          iconColor: "red",
          text: data.message,
        });
      }
      setLoading(false);
    } catch (error) {
      console.log({ error });
      Toast.fire({
        icon: "error",
        iconColor: "red",
        text: "Login failed. Check your connection and try gain",
      });
      setLoading(false);
    }
    // Perform sign-in logic here
    // Make a fetch request to long
    // Set the returned token to cookie
  };

  const handleSignInWithGoogle = () => {
    // Implement sign-in with Google logic
    console.log("Signing in with Google");
  };

  const handleSignInWithFacebook = () => {
    // Implement sign-in with Facebook logic
    console.log("Signing in with Facebook");
  };

  return (
    <Container
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          maxWidth: "400px",
          padding: "25px",
          minHeight: "45vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          mb="10px"
        >
          <ZHLogo fill="#f49d37" width={56} height={41} />
        </Box>
        <TextField
          size="small"
          required
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          size="small"
          required
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <LoadingButton
          variant="contained"
          loading={loading}
          disabled={loading}
          color="primary"
          size="medium"
          onClick={handleFormSubmit}
        >
          Sign In
        </LoadingButton>
      </Card>
    </Container>
  );
};

export default SignInPage;
