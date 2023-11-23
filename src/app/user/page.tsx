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
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { PhotoCamera, Edit, SaveAlt } from "@mui/icons-material";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useCurrentUser } from "@/hooks/customHooks";

interface UserProfileProps {
  user: User;
  onRefetch: () => void;
}

const updateUser = {
  address: "123 Main Street",
  contactNumber: "1234567890",
  dateOfBirth: "31st August, 2023",
  email: "kamaradennis36@gmail.com",
  specialization: "bone specialist",
  firstName: "Dennis",
  bloodGroupName: "A+",
  gender: "male",
  lastName: "Kamara",
  profileImage:
    null ||
    "https://www.bing.com/th?id=OIP.rq0bLboVfwhtwS9EnvZ0CAHaJl&w=76&h=100&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
  role: "patient",
};

const UserProfile = () => {
  const theme = useTheme();
  const [userProfile, setUserProfile] = useState<User | null>();

  const currentUser = useCurrentUser();

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(false);

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

  const handleRefetch = async () => {
    try {
      /* Fetch the single doctor by userId instead.. use the currentUser 
          object to get userId, Do the same for all profile  {userId,role,profilePicture,displayName} */
      const response = await fetch(
        `/api/users/${
          currentUser?.userId || "97cc8142-a01e-45b6-a363-a5e5b2ab69b3"
        } `,
        {
          cache: "no-cache",
        },
      );
      const data = await response.json();
      if (response.status === 200) {
        console.log(data);
        setUserProfile(data.user);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error fetching Doctors:", error);
    }
  };
  useEffect(() => {
    handleRefetch();
  }, []);

  if (!userProfile) {
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

  const handleEdit = (userprofile: User) => {
    console.log(userprofile);
    setIsEditing(true);
    // Initialize editedData with the current user data
    setEditedData(updateUser);

    setUpdateUser({
      userId: userprofile?.userId,
      firstName: userprofile?.firstName,
      lastName: userprofile?.lastName,
      email: userprofile?.email,
      address: userprofile?.address || "",
      gender: userprofile?.gender,
      contactNumber: userprofile?.contactNumber,
      dateOfBirth: userprofile?.dateOfBirth || "",
      profileImage: userprofile?.profileImage || "",
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
    console.log(updateUser);
    try {
      setLoading(true);
      const request = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(updateUser),
        headers: { "Content-Type": "application/json" },
      });

      const data = await request.json();
      if (request.status === 202) {
        Toast.fire({
          icon: "success",
          iconColor: "green",
          text: `${data?.message}`,
        });
      } else {
        Toast.fire({
          icon: "error",
          iconColor: "red",
          text: `${data?.message}`,
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
      handleRefetch();
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
    <Box>
      <Paper elevation={3} className="p-4">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 12,
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
                  alt={`${userProfile.firstName} ${userProfile.lastName}'s profile`}
                  src={userProfile.profileImage || "/default-avatar.png"}
                  sx={{
                    maxWidth: "200px",
                    minWidth: "160px",
                    marginTop: { xs: 0, sm: -30 },
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
            <Typography variant="h4" component="div">
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
                `Mr. ${userProfile.firstName}`
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
                userProfile.lastName
              )}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <List>
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
                    secondary={userProfile?.contactNumber}
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
                    secondary={userProfile?.email}
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
                    secondary={userProfile?.gender}
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
                      userProfile?.dateOfBirth ?? "",
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
                    secondary={userProfile?.email}
                  />
                )}{" "}
              </ListItem>
              <ListItem>
                {isEditing ? (
                  <LoadingButton
                    size="large"
                    variant="contained"
                    loading={loading}
                    disabled={loading}
                    color="inherit"
                    onClick={() => handleUpdate(userProfile.userId)}
                  >
                    <SaveAlt />
                    <span style={{ marginLeft: 5 }}>Save</span>
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    size="large"
                    variant="contained"
                    color="inherit"
                    onClick={() => handleEdit(userProfile)}
                  >
                    <Edit /> <span style={{ marginLeft: 5 }}>Edit</span>
                  </LoadingButton>
                )}
              </ListItem>
            </List>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserProfile;
