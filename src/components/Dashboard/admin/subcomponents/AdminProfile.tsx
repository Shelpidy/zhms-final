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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  InputLabel,
  TableCell,
  TableHead,
  Button,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  PhotoCamera,
  Edit,
  SaveAlt,
  Search,
  Add,
  Delete,
} from "@mui/icons-material";
import { useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import CloseIcon from "@mui/icons-material/Close";

type AdminProfile = {
  admin: Admin;
  user: User;
};

interface AdminProfileProps {
  admin: AdminProfile;
  admins: AdminProfile[];
  onRefetch: () => void;
  onRefetchAdmins: () => void;
}

const updateUserDemo = {
  address: "123 Main Street",
  contactNumber: "1234567890",
  dateOfBirth: "31st August, 2023",
  email: "kamaradennis36@gmail.com",
  specialization: "bone specialist",
  firstName: "Dennis",
  username: "denno1000",
  gender: "male",
  lastName: "Kamara",
  profileImage:
    null ||
    "https://www.bing.com/th?id=OIP.rq0bLboVfwhtwS9EnvZ0CAHaJl&w=76&h=100&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
  role: "patient",
};

const style = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: "500px",
  maxHeight: "88vh",
  p: 4,
  overflow: "auto",
};

const AdminProfileDetails: React.FC<AdminProfileProps> = ({
  admin,
  admins,
  onRefetchAdmins,
  onRefetch,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [expand, setExpand] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminProfile | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [newAdmin, setNewAdmin] = useState<{
    username: string;
  }>({
    username: ""
  });

  const [updateAdmin, setUpdateAdmin] = useState<{
    username: string;
    email: string;
  }>({
    username: "",
    email: "",
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

  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
  });

  const handleExpand = (admin: AdminProfile) => {
    console.log(admin);
    setSelectedAdmin(admin);
    setExpand(true);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAdmin(null);
  };

  async function handleAdd() {
    try {
      setLoading(true);
      console.log("New Admin", newAdmin);
      // Logic to add a new appointment
      const request = await fetch("/api/admins", {
        method: "POST",
        body: JSON.stringify(newAdmin),
        headers: { "Content-Type": "application/json" },
      });
      const data = await request.json();
      if (request.status === 201) {
        console.log(JSON.stringify(data));
        Toast.fire({
          icon: "success",
          iconColor: "green",
          text: data?.message,
        });
      } else {
        Toast.fire({
          icon: "error",
          iconColor: "red",
          text: data?.message,
        });
      }
      setLoading(false);
      onRefetchAdmins();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    // Update the appointments state after adding
    handleClose();
    newAdmin.username = "";
  }
  async function handleDelete(userId: string) {

    try {
      setLoading(true);

      const request = await fetch(`/api/admins/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await request.json();
      if (request.status === 203) {
        Toast.fire({
          icon: "success",
          iconColor: "green",
          text: data?.message,
        });
      } else {
        Toast.fire({
          icon: "error",
          iconColor: "red",
          text: data?.message,
        });
      }
      setLoading(false);
      onRefetch();
      // Update the appointments state after deletion
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewAdmin((prevAdmin) => ({
      ...prevAdmin,
      [name]: value,
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleEdit = (adminprofile: AdminProfile) => {
    console.log(adminprofile);
    setIsEditing(true);
    // Initialize editedData with the current Admin data
    setEditedData(updateUser);
    setUpdateAdmin({
      email: adminprofile?.user?.email,
      username: adminprofile?.admin?.username,
    });
    setUpdateUser({
      userId: adminprofile?.user?.userId,
      firstName: adminprofile.user?.firstName,
      lastName: adminprofile.user?.lastName,
      email: adminprofile.user?.email,
      address: adminprofile.user?.address || "",
      gender: adminprofile.user?.gender,
      contactNumber: adminprofile.user?.contactNumber,
      dateOfBirth: adminprofile.user?.dateOfBirth || "",
      profileImage: adminprofile.user?.profileImage || "",
    });
  };

  ///// performs the put request//////
  async function handleUpdate(adminId: string, userId: string) {
    // Logic to update the appointment
    console.log(updateUser, updateAdmin);
    let {userId:_,...newUser} = updateUser;

    try {
      setLoading(true);
      const request1 = await fetch(`/api/admins/${userId}`, {
        method: "PUT",
        body: JSON.stringify(updateAdmin),
        headers: { "Content-Type": "application/json" },
      });
      const request2 = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(newUser),
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
    } catch (error) {
      console.log(error);
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
            textAlign: "center",
            marginTop: 3,
            marginLeft: -20,
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
                  alt={`${updateUser.firstName} ${updateUser.lastName}'s profile`}
                  src={admin.user.profileImage}
                  sx={{
                    maxWidth: "200px",
                    minWidth: "200px",
                    marginTop: "8px",
                    width: "auto", // Make the width 100%
                    height: "auto",
                    borderRadius: "10px", // Rounded edges
                    cursor: "pointer",
                  }}
                />
              )}
            </div>
          </Box>
          <Box sx={{ marginTop: -2 }}>
          <Typography variant="h5" fontFamily='Poppins-Medium'>
              {isEditing ? (
                <TextField
                  variant="outlined"
                  name="username"
                  label="User Name"
                  sx={{ marginBottom: 2 }}
                  size="small"
                  value={updateAdmin.username}
                  onChange={(e) =>
                    setUpdateAdmin({
                      ...updateAdmin,
                      username: e.target.value,
                    })
                  }
                />
              ) : (
                `${admin.admin.username}`
              )}{" "}
            </Typography>
            <Typography variant="subtitle1" component="div">
              {isEditing ? (
                <TextField
                  name="firstName"
                  variant="outlined"
                  label="First Name"
                  size="small"
                  value={updateUser.firstName}
                  onChange={(e) =>
                    setUpdateUser({ ...updateUser, firstName: e.target.value })
                  }
                />
              ) : (
                `${admin.user.firstName}`
              )}{" "}
              {isEditing ? (
                <TextField
                  variant="outlined"
                  name="lastName"
                  label="Last Name"
                  size="small"
                  sx={{ marginTop: { xs: 1, sm: 1, md: 0, lg: 0 } }}
                  value={updateUser.lastName}
                  onChange={(e) =>
                    setUpdateUser({ ...updateUser, lastName: e.target.value })
                  }
                />
              ) : (
                admin.user.lastName
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
                    secondary={admin.user.contactNumber}
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
                    secondary={admin.user.gender}
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
                      admin.user.dateOfBirth!
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
                    primary="Address"
                    secondary={admin.user.address}
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
                  <ListItemText primary="Email" secondary={admin.user.email} />
                )}{" "}
              </ListItem>
            </List>
            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
              {isEditing ? (
                <LoadingButton
                  size="small"
                  loading={loading}
                  disabled={loading}
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleUpdate(admin.admin.adminId, admin.user.userId)
                  }
                >
                  <SaveAlt />
                  <span style={{ marginLeft: 5 }}>Save</span>
                </LoadingButton>
              ) : (
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => handleEdit(admin)}
                >
                  <Edit /> <span style={{ marginLeft: 5 }}>Edit</span>
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 7,
          marginBottom: 2,
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button
          size="small"
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpen}
        >
          New
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Admin</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date Added</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {admins
              .filter(
                (admin) =>
                  admin.user.email.includes(searchQuery) ||
                  admin.admin.username.includes(searchQuery),
              )
              .map((admin, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Avatar
                      sx={{ width: "25px", height: "25px" }}
                      alt={admin.user.firstName}
                      src={admin.user.profileImage}
                    />
                  </TableCell>
                  <TableCell>
                    {admin.user.firstName} {" "} {admin.user.middleName} {" "} {admin.user.lastName}
                  </TableCell>
                  <TableCell>{admin?.admin.username}</TableCell>
                  <TableCell>
                    {moment(admin.admin.createdAt).fromNow()}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleExpand(admin)}>
                      <ExpandCircleDownIcon />
                    </IconButton>
                    <IconButton
                      
                      onClick={() => handleDelete(admin.user.userId)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Dialog open={expand} onClose={() => setExpand(false)}>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: -5,
                marginRight: -5,
              }}
            >
              <IconButton onClick={() => setExpand(false)}>
                <CloseIcon color="primary" />
              </IconButton>
            </Box>
            <Box sx={{ marginTop: -1, textAlign: "center" }}>
              <DialogTitle>Admin Details</DialogTitle>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 2,
                }}
              >
                <DialogContent sx={{ minWidth: "500px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignContent: "center",
                      marginTop: -2,
                      marginBottom: 2,
                    }}
                  >
                    <Avatar
                      alt={selectedAdmin?.user.firstName}
                      sx={{ width: "150px", height: "150px" }}
                      src={selectedAdmin?.user.profileImage}
                    />
                  </Box>
                  <div>
                    <Typography variant="h6">
                      <strong>Admin Name:</strong>{" "}
                      {selectedAdmin?.user.firstName}{" "}
                      {selectedAdmin?.user.middleName}{" "}
                      {selectedAdmin?.user.lastName}
                    </Typography>
                    <Typography variant="h6">
                      <strong>Username:</strong> {selectedAdmin?.admin.username}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Email:</strong> {selectedAdmin?.user?.email}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Contact Number:</strong>{" "}
                      {selectedAdmin?.user?.contactNumber}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Gender:</strong> {selectedAdmin?.user?.gender}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Address:</strong> {selectedAdmin?.user?.address}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Birth Date:</strong>{" "}
                      {selectedAdmin?.user?.dateOfBirth?.toString()}
                    </Typography>
                  </div>
                </DialogContent>
              </Box>
            </Box>
          </Box>
        </Dialog>
        <Box>
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            sx={{
              maxWidth: "lg",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: -5,
                marginRight: -5,
              }}
            >
              <IconButton onClick={() => setExpand(false)}>
                <CloseIcon color="primary" />
              </IconButton>
            </Box>
            <DialogTitle>Add Admin</DialogTitle>
            <DialogContent sx={{ minWidth: "500px" }}>
              <InputLabel>User Email</InputLabel>
              <TextField
                fullWidth
                name="email"
                onChange={handleInputChange}
                margin="normal"
              />
              <InputLabel>User Name</InputLabel>
              <TextField
                fullWidth
                name="username"
                onChange={handleInputChange}
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <LoadingButton
                onClick={handleAdd}
                disabled={loading}
                loading={loading}
              >
                Add
              </LoadingButton>
            </DialogActions>
          </Dialog>
        </Box>
        {/* <Dialog
          open={openUpdate}
          onClose={() => setOpenUpdate(false)}
          sx={{ maxWidth: "md" }}
        >
          <DialogTitle>Update Doctor</DialogTitle>
          <DialogContent>
            <InputLabel>Doctor Email</InputLabel>
            <TextField
              fullWidth
              name="doctorEmail"
              disabled
              value={updateDoctor.doctorEmail}
              onChange={handleUpdateInputChange}
              margin="normal"
            />
            <InputLabel>Specialization</InputLabel>
            <TextField
              fullWidth
              name="specialization"
              value={updateDoctor.specialization}
              onChange={handleUpdateInputChange}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpdateClose}>Cancel</Button>
            <Button onClick={handleUpdate} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog> */}
      </TableContainer>
    </Box>
  );
};

export default AdminProfileDetails;
