"use client";

import {
  Box,
  CircularProgress,
  Grid,
  Avatar,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { PhotoCamera, Edit, SaveAlt } from "@mui/icons-material";
import { useState } from "react";
import Swal from "sweetalert2";
import { userAgent } from "next/server";

type PatientProfile = {
  patient: Patient;
  user: User;
};

interface PatientProfileProps {
  patient: PatientProfile;
  onRefetch: () => void;
}

// const updateUser = {
//   address: "123 Main Street",
//   contactNumber: "1234567890",
//   dateOfBirth: "31st August, 2023",
//   email: "kamaradennis36@gmail.com",
//   specialization: "bone specialist",
//   firstName: "Dennis",
//   bloodGroupName: "A+",
//   gender: "male",
//   lastName: "Kamara",
//   profileImage:
//     null ||
//     "https://www.bing.com/th?id=OIP.rq0bLboVfwhtwS9EnvZ0CAHaJl&w=76&h=100&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
//   role: "patient",
// };

const PatientProfileDetails: React.FC<PatientProfileProps> = ({
  patient,
  onRefetch,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(false);

  const [updatePatient, setUpdatePatient] = useState<{
    diagnosis: string;
    bloodGroupName: string;
  }>({
    diagnosis: "",
    bloodGroupName: "",
  });
  const [updateUser, setUpdateUser] = useState<{
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    gender: string;
    contactNumber: string;
    dateOfBirth: string;
    profileImage: string;
  }>({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    gender: "",
    contactNumber: "",
    dateOfBirth: "",
    profileImage: "",
  });

  const handleEdit = (patientprofile: PatientProfile) => {
    console.log(patientprofile);
    setIsEditing(true);
    // Initialize editedData with the current patient data
    setEditedData(updateUser);
    setUpdatePatient({
      diagnosis: patientprofile.patient.diagnosis,
      bloodGroupName: "",
    });
    setUpdateUser({
      userId: patientprofile?.user?.userId,
      firstName: patientprofile?.user?.firstName,
      lastName: patientprofile?.user?.lastName,
      email: patientprofile?.user?.email,
      address: patientprofile?.user?.address || "",
      gender: patientprofile?.user?.gender,
      contactNumber: patientprofile?.user?.contactNumber,
      dateOfBirth: patientprofile?.user?.dateOfBirth || "",
      profileImage: patientprofile?.user?.profileImage || "",
    });
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
  });

  ///// performs the put request//////
  async function handleUpdate(userId: string) {
    // Logic to update the appointment
    console.log(updateUser, updatePatient);
    try {
      setLoading(true);
      const request1 = await fetch(`/api/patients/${userId}`, {
        method: "PUT",
        body: JSON.stringify(updatePatient),
        headers: { "Content-Type": "application/json" },
      });
      const request2 = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(updateUser),
        headers: { "Content-Type": "application/json" },
      });
      const [response1, response2] = await Promise.all([request1, request2]);

      const data1 = await response1.json();
      const data2 = await response2.json();

      if (response1.status === 202 && response2.status === 202) {
        Toast.fire({
          icon: "success",
          iconColor: "green",
          text: `${data1?.message} ${data2?.message}`,
        });
      } else {
        Toast.fire({
          icon: "error",
          iconColor: "red",
          text: `${data1?.message} ${data2?.message}`,
        });
      }
    } catch (error: any) {
      console.log(error.message);
      Toast.fire({
        icon: "error",
        iconColor: "red",
        text: "An error occurred while updating.",
      });
    } finally {
      setLoading(false);
      onRefetch();
      setIsEditing(false);
    }
    // Update the appointments state after updating
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const file = event?.target?.files[0];
    // if (file) {
    //   setUpdateUser({...updateUser, pictureImage:"file"});
    // }
  };

  return (
    <Box className="p-4">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 3,
          }}
        >
          <Box sx={{ marginRight: 5 }}>
            {/* Avatar */}
            <div>
              {isEditing ? (
                <label htmlFor="avatar-input">
                  <Avatar
                    alt={`${updateUser.firstName} ${updateUser.lastName}'s profile`}
                    src={updateUser.profileImage}
                    sx={{
                      maxWidth: "200px",
                      minWidth: "160px",
                      marginTop: { xs: 0, sm: -28 },
                      width: "auto", // Make the width 100%
                      height: "auto",
                      borderRadius: "10px", // Rounded edges
                      cursor: "pointer",
                    }}
                  />
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatarChange}
                  />
                  <IconButton color="primary" component="span">
                    <PhotoCamera />
                  </IconButton>
                </label>
              ) : (
                <Avatar
                  alt={`${patient.user.firstName} ${patient.user.lastName}'s profile`}
                  src={patient.user.profileImage}
                  sx={{
                    maxWidth: "200px",
                    minWidth: "160px",
                    marginTop: { xs: 0, sm: -33 },
                    width: "auto", // Make the width 100%
                    height: "auto",
                    borderRadius: "10px", // Rounded edges
                    cursor: "pointer",
                  }}
                />
              )}
            </div>
          </Box>
          <Box sx={{ marginTop: 0 }}>
            <Typography variant="h5" fontFamily="PoppinsMedium">
              {isEditing ? (
                <TextField
                  name="firstName"
                  variant="outlined"
                  label="First Name"
                  sx={{ marginLeft: 2, marginTop: 1 }}
                  size="small"
                  value={updateUser.firstName}
                  onChange={(e) =>
                    setUpdateUser({ ...updateUser, firstName: e.target.value })
                  }
                />
              ) : (
                `Mr. ${patient?.user.firstName}`
              )}{" "}
              {isEditing ? (
                <TextField
                  variant="outlined"
                  name="lastName"
                  label="Last Name"
                  size="small"
                  sx={{ marginTop: 1, marginLeft: { xs: 2 } }}
                  value={updateUser.lastName}
                  onChange={(e) =>
                    setUpdateUser({ ...updateUser, lastName: e.target.value })
                  }
                />
              ) : (
                patient?.user.lastName
              )}
            </Typography>
            <Typography variant="subtitle1">
              {isEditing ? (
                <TextField
                  variant="outlined"
                  name="bloodGroupName"
                  label="Blood Group"
                  sx={{ marginTop: 2, marginLeft: 2 }}
                  size="small"
                  value={updatePatient.bloodGroupName}
                  onChange={(e) =>
                    setUpdatePatient({
                      ...updatePatient,
                      bloodGroupName: e.target.value,
                    })
                  }
                />
              ) : (
                `${patient?.patient?.bloodGroupName || ""}`
              )}{" "}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <List>
              <ListItem>
                {isEditing ? (
                  <TextField
                    variant="outlined"
                    name="diagnosis"
                    label="Diagonosis"
                    disabled
                    size="small"
                    value={patient?.patient?.diagnosis}
                    onChange={(e) =>
                      setUpdateUser({
                        ...updateUser,
                        contactNumber: e.target.value,
                      })
                    }
                  />
                ) : (
                  <ListItemText
                    primary="Diagnosis"
                    secondary={patient?.patient?.diagnosis}
                  />
                )}{" "}
              </ListItem>
              <ListItem>
                {isEditing ? (
                  <TextField
                    variant="outlined"
                    name="contactNumber"
                    label="Phone Number"
                    size="small"
                    value={updateUser.contactNumber}
                    onChange={(e) =>
                      setUpdateUser({
                        ...updateUser,
                        contactNumber: e.target.value,
                      })
                    }
                  />
                ) : (
                  <ListItemText
                    primary="Contact"
                    secondary={patient?.user?.contactNumber}
                  />
                )}{" "}
              </ListItem>
              <ListItem>
                {isEditing ? (
                  <TextField
                    variant="outlined"
                    name="email"
                    label="Email"
                    size="small"
                    value={updateUser.email}
                    onChange={(e) =>
                      setUpdateUser({ ...updateUser, email: e.target.value })
                    }
                  />
                ) : (
                  <ListItemText
                    primary="Address"
                    secondary={patient?.user?.email}
                  />
                )}{" "}
              </ListItem>
              <ListItem>
                {isEditing ? (
                  <TextField
                    variant="outlined"
                    name="gender"
                    label="Gender"
                    size="small"
                    value={updateUser.gender}
                    onChange={(e) =>
                      setUpdateUser({ ...updateUser, gender: e.target.value })
                    }
                  />
                ) : (
                  <ListItemText
                    primary="Gender"
                    secondary={patient?.user?.gender}
                  />
                )}{" "}
              </ListItem>
              <ListItem>
                {isEditing ? (
                  <TextField
                    variant="outlined"
                    name="dateOfBirth"
                    label="Date of Birth"
                    size="small"
                    value={updateUser.dateOfBirth}
                    onChange={(e) =>
                      setUpdateUser({
                        ...updateUser,
                        dateOfBirth: e.target.value,
                      })
                    }
                  />
                ) : (
                  <ListItemText
                    primary="Date of Birth"
                    secondary={new Date(
                      patient?.user?.dateOfBirth ?? "",
                    ).toLocaleDateString()}
                  />
                )}{" "}
              </ListItem>
              <ListItem>
                {isEditing ? (
                  <TextField
                    variant="outlined"
                    name="address"
                    label="Address"
                    size="small"
                    value={updateUser.address}
                    onChange={(e) =>
                      setUpdateUser({ ...updateUser, address: e.target.value })
                    }
                  />
                ) : (
                  <ListItemText
                    primary="Email"
                    secondary={patient?.user?.email}
                  />
                )}{" "}
              </ListItem>
            </List>
            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
              {isEditing ? (
                <LoadingButton
                  size="small"
                  variant="contained"
                  loading={loading}
                  disabled={loading}
                  sx={{ marginLeft: 2 }}
                  color="primary"
                  onClick={() => handleUpdate(patient.user.userId)}
                >
                  <SaveAlt />
                  <span style={{ marginLeft: 5 }}>Save</span>
                </LoadingButton>
              ) : (
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => handleEdit(patient)}
                >
                  <Edit /> <span style={{ marginLeft: 5 }}>Edit</span>
                </Button>
              )}
            </Box>
          </Box>
        </Box>
    </Box>
  );
};

export default PatientProfileDetails;
