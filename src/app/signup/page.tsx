"use client";
import React, { useState } from "react";
import {
  Button,
  Container,
  TextField,
  FormControlLabel,
  Box,
  Grid,
  Typography,
  Radio,
  RadioGroup,
  Divider,
  Card,
  useTheme,
  IconButton,
  CardMedia,
} from "@mui/material";

import Link from "next/link";
import CustomButton from "@/components/CustomButton";
import { useRouter } from "next/navigation";
import ZHLogo from "@/components/Logo/Logo";
import { LoadingButton } from "@mui/lab";
import Swal from "sweetalert2";
import { AddAPhotoOutlined } from "@mui/icons-material";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface AudioUpload {
  blob: Blob;
  userId: string;
  folderName: string;
}

const generateRandomFilename = (userId: string): string => {
  const timestamp = new Date().getTime();
  const uniqueIdentifier = Math.random().toString(36).substring(2);
  return `${timestamp}_${uniqueIdentifier}`;
};

const uploadFileToFirebase = async ({
  blob,
  userId,
  folderName,
}: AudioUpload): Promise<string> => {
  const storage = getStorage(); // Initialize Firebase Storage

  const filename = generateRandomFilename(userId);

  // Create a reference to the storage location
  const storageRef = ref(storage, `${folderName}/${filename}`);
  try {
    // Upload the blob to Firebase Storage
    await uploadBytes(storageRef, blob);

    // Get the download URL of the uploaded file
    const downloadURL = await getDownloadURL(storageRef);

    console.log("File uploaded successfully. Download URL:", downloadURL);

    return downloadURL; // Return the download URL for further use
  } catch (error) {
    console.error("Error uploading file to Firebase Storage:", error);
    throw error; // Rethrow the error for handling at a higher level
  }
};


const Toast = Swal.mixin({
  toast: true,
  position: "center",
  timer: 3000,
  timerProgressBar: true,
  showConfirmButton: false,
});

export const metadata = {
  title: "SLMS | Register",
  description: "Digital Learning Platform",
};

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    address: "",
    firstName: "",
    lastName: "",
    middleName: "",
    profileImage:
      "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=740",
    gender: "",
    contactNumber: "",
  });

  const [passwordStrength, setPasswordStrength] = useState<string>("");
  const [validatePhoneNum, setValidPhoneNum] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [emailVerification, setEmailVerification] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);


  const { ...dataWithoutRole } = formData;
  const isSubmitButtonDisabled = Object.values(dataWithoutRole).some(
    (value) => value === "" || value === null,
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    let imageFiles = e.target.files;
    if (imageFiles) {
      let urlImage = URL.createObjectURL(imageFiles[0]);
      setFormData((prevData: any) => ({
        ...prevData,
        profileImage: urlImage,
      }));
      setImage(urlImage);

      console.log({ ProfileImage: urlImage });
    }
  };

  async function handleFormSubmit(): Promise<void> {
    setLoading(true);
    const { confirmPassword, ...userData } = formData;
    let response = await fetch(formData.profileImage);
    let blob = await response.blob();
    let profileImage = await uploadFileToFirebase({
      blob,
      folderName: "ProfileImages",
      userId: formData.email,
    });
    console.log({ ...userData, profileImage });
    try {
      // let roles = ["admin", "user", "doctor", "patient"];
      // let index = Math.round(Math.random() * 10) % 3;
      const response = await fetch("/api/auth/signup/", {
        method: "POST",
        body: JSON.stringify({ ...userData, profileImage, role: "user" }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.status === 201) {
        console.log(JSON.stringify(data));
        Toast.fire({
          icon: "success",
          iconColor: "green",
          text: data?.message,
        });
        // router.push("/signin");
      } else {
        console.log(data?.message);
        Toast.fire({
          icon: "error",
          iconColor: "red",
          text: "Failed to register, please try again.",
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let emailVerification = emailPattern.test(email);
    if (!emailVerification) {
      setEmailVerification("Invalid email address");
    } else {
      setEmailVerification("");
    }
  };

  const validatePassword = (password: string) => {
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const isValidLength = password.length >= 8;

    if (!isValidLength) {
      return "Password should be at least 8 characters long.";
    }

    if (!hasLetters || !hasNumbers) {
      return "Password should contain letters and numbers.";
    }

    return "";
  };

  const validatePhoneNumber = (number: string) => {
    const phoneNumberPattern = /^\+?\d+$/;

    const cleanNumber = number.replace(/\D/g, "");

    let validPhoneNum = phoneNumberPattern.test(cleanNumber);
    if (!validPhoneNum) {
      setValidPhoneNum("Invalid phone number");
    } else {
      setValidPhoneNum("");
    }
  };

  const confirmPasswordChecker = (password: string) => {
    if (password !== formData.password) {
      setConfirmPassword("Password do no match");
    } else {
      setConfirmPassword("");
    }
  };

  const checkPasswordStrength = (password: string) => {
    const validationMsg = validatePassword(password);
    setPasswordStrength(validationMsg);
  };

  return (
    <Container
      sx={{
        display: "flex",
        width: "100vw",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "12vh",
      }}
    >
      <Card sx={{ padding: "25px", maxWidth: "800px", marginBottom: "15px" }}>
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
        <Card
          className="hide-scrollbar"
          variant="outlined"
          sx={{ width: "100%" }}
        >
          <Box>
            {image && (
              <Box
                key={image}
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1",
                  marginTop: "5px",
                }}
              >
                <CardMedia
                  component="img"
                  height="100"
                  image={image}
                  alt="Profile Image"
                />
              </Box>
            )}
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "20vh",
                width: "100%",
              }}
              htmlFor="avatar-input"
            >
              <input
                id="avatar-input"
                type="file"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleProfileImage}
              />

              <IconButton color="primary" component="span">
                <AddAPhotoOutlined />
              </IconButton>
              <Typography variant="caption">
                Click here to upload profile image
              </Typography>
            </label>
          </Box>
        </Card>
       
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
            <TextField
              required
              fullWidth
              size="small"
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
            <TextField
              size="small"
              required
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
            <TextField
              required
              size="small"
              fullWidth
              label="Middle Name"
              name="middleName"
              value={formData.middleName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
            <TextField
              required
              size="small"
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={(e: any) => {
                handleInputChange(e);
                validateEmail(e.target.value);
              }}
            />
            <Box
              sx={{ marginTop: 1 }}
              color={
                emailVerification ? (emailVerification ? "red" : "green") : ""
              }
            >
              {emailVerification ? (
                <ul>
                  <li>{emailVerification}</li>
                </ul>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginTop: 2 }}>
            <TextField
              size="small"
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={(e: any) => {
                handleInputChange(e);
                checkPasswordStrength(e.target.value);
              }}
            />
            <Box
              sx={{ marginTop: 1 }}
              color={
                passwordStrength ? (passwordStrength ? "red" : "green") : ""
              }
            >
              {passwordStrength ? (
                <ul>
                  <li>{passwordStrength}</li>
                </ul>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginTop: 2 }}>
            <TextField
              required
              size="small"
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e: any) => {
                handleInputChange(e);
                confirmPasswordChecker(e.target.value);
              }}
            />
            <Box
              sx={{ marginTop: 1 }}
              color={confirmPassword ? (confirmPassword ? "red" : "green") : ""}
            >
              {confirmPassword ? (
                <ul>
                  <li>{confirmPassword}</li>
                </ul>
              ) : null}
            </Box>
          </Grid>
          {/* <Grid item xs={12} sm={6} sx={{ marginTop: 2 }}>
            <TextField
              required
              size="small"
              fullWidth
              type="file"
              label="User-Image"
              name="profileImage"
              id="profileImage"
              value={formData.profileImage}
              onChange={handleInputChange}
            />
          </Grid> */}
          <Grid item xs={12} sm={6} sx={{ marginTop: 2 }}>
            <TextField
              required
              size="small"
              fullWidth
              label="Phone Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={(e: any) => {
                handleInputChange(e);
                validatePhoneNumber(e.target.value);
              }}
            />
            <Box
              sx={{ marginTop: 1 }}
              color={
                validatePhoneNum ? (validatePhoneNum ? "red" : "green") : ""
              }
            >
              {validatePhoneNum ? (
                <ul>
                  <li>{validatePhoneNum}</li>
                </ul>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginTop: 2 }}>
            <TextField
              required
              fullWidth
              size="small"
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
            <TextField
              required
              size="small"
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 2 }}>
            <Typography variant="body1" component="div">
              Gender
            </Typography>
            <RadioGroup
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              sx={{ flexDirection: "row" }}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
            </RadioGroup>
          </Grid>
          <Divider className="my-2" />
        </Grid>
        <LoadingButton
          color="primary"
          variant="contained"
          loading={loading}
          disabled={loading}
          onClick={handleFormSubmit}
        >
          Sign Up
        </LoadingButton>

        <Box className="my-5">
          <Typography className="text-center">
            Already have an account ?{" "}
            <Link href="/signin" className="mx-2">
              Signin
            </Link>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
};

export default SignUpPage;
