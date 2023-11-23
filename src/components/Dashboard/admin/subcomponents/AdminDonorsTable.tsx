"use client"
import React, { useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  SelectChangeEvent,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Avatar,
  CardMedia,
  Card,
} from "@mui/material";
import {
  Delete,
  Edit,
  Add,
  Search,
  AddAPhotoOutlined,
} from "@mui/icons-material";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { LoadingButton } from "@mui/lab";
import moment from "moment";
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


type DonorProfile = {
  donor: Donor;
  bloodGroup: BloodGroup;
};

interface AdminDonorTableProps {
  donors: DonorProfile[];
  onRefetch: () => void;
}

const dummyDonor = {
  address: "123 Main Street",
  contactNumber: "1234567890",
  dateOfBirth: "31st August, 2023",
  email: "kamaradennis36@gmail.com",
  firstName: "Dennis",
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
  maxWidth: "70vw",
  maxHeight: "88vh",
  bgcolor: "background.paper",
  p: 4,
  overflow: "auto",
};

const AdminDonorsTable: React.FC<AdminDonorTableProps> = ({
  donors,
  onRefetch,
}) => {
  const [expand, setExpand] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<DonorProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openUpdate, setOpenUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [newDonor, setNewDonor] = useState<{
    donorId: string;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    volume: number;
    address: string;
    gender: string;
    bloodGroupName: string;
    contactNumber: string;
    dateOfBirth: string;
    profileImage: string;
  }>({
    donorId: "",
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    bloodGroupName: "",
    volume: 0,
    address: "",
    gender: "",
    contactNumber: "",
    dateOfBirth: "",
    profileImage: "",
  });

  const [updateDonor, setUpdateDonor] = useState<{
    donorId: string;
    firstName: string;
    lastName: string;
    email: string;
    middleName: string;
    address: string;
    volume: number;
    bloodGroupName: string;
    gender: string;
    contactNumber: string;
    dateOfBirth: string;
    profileImage: string;
  }>({
    donorId: "",
    firstName: "",
    lastName: "",
    bloodGroupName: "",
    middleName: "",
    email: "",
    address: "",
    volume: 0,
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

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDonor(null);
  };

  const handleUpdateClose = () => {
    setOpenUpdate(false);
  };

  const handleExpand = (donors: DonorProfile) => {
    console.log(donors);
    setSelectedDonor(donors);
    setExpand(true);
  };

  const handleEdit = (donor: DonorProfile) => {
    console.log(donor.donor);
    setOpenUpdate(true);
    setSelectedDonor(donor);

    setUpdateDonor({
      donorId: donor.donor.donorId,
      firstName: donor.donor.firstName || "",
      lastName: donor.donor.lastName || "",
      middleName: donor?.donor?.middleName || "",
      dateOfBirth: donor?.donor?.dateOfBirth || "",
      email: donor?.donor?.email || "",
      address: donor?.donor.address || "",
      gender: donor?.donor?.gender || "",
      contactNumber: donor?.donor.contactNumber,
      bloodGroupName: donor?.bloodGroup?.groupName || "",
      volume: donor?.bloodGroup?.volume || 0,
      profileImage: donor?.donor.profileImage || "",
    });
    setOpenUpdate(true);
  };
  const handleSelectInputChange = (event: SelectChangeEvent<any>) => {
    const { name, value } = event.target;
    setNewDonor((prevDonor) => ({
      ...prevDonor,
      [name]: value,
    }));
  };

  const handleSelectUpdateInputChange = (event: SelectChangeEvent<any>) => {
    const { name, value } = event.target;
    setUpdateDonor((prevDonor) => ({
      ...prevDonor,
      [name]: value,
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewDonor((prevDonor) => ({
      ...prevDonor,
      [name]: value,
    }));
  };

  const handleProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    let imageFiles = e.target.files;
    if (imageFiles) {
      let urlImage = URL.createObjectURL(imageFiles[0]);
      setNewDonor((prevData: any) => ({
        ...prevData,
        profileImage: urlImage,
      }));
      setImage(urlImage);

      console.log({ ProfileImage: urlImage });
    }
  };

  const handleUpdateInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setUpdateDonor((prevDonor) => ({
      ...prevDonor,
      [name]: value,
    }));
  };

  async function handleDelete(donorId: string) {
    console.log(donorId);
    try {
      setLoading(true);
      // Logic to delete the appointment
      console.log(donorId);
      const request = await fetch(`/api/donors/${donorId}`, {
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

  async function handleUpdate() {
    // Logic to update the appointment
    console.log(updateDonor);
    try {
      setLoading(true);
      const request = await fetch("/api/donors", {
        method: "PUT",
        body: JSON.stringify(updateDonor),
        headers: { "Content-Type": "application/json" },
      });
      const data = await request.json();
      if (request.status === 202) {
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
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    // Update the appointments state after updating
    handleUpdateClose();
  }

  async function handleAdd() {
    try {
      setLoading(true);
      console.log("New Donor", newDonor);
      const {donorId:_,...donorWithoutId} = newDonor
      let response = await fetch(newDonor.profileImage);
      let blob = await response.blob();
      let profileImage = await uploadFileToFirebase({
        blob,
        folderName: "ProfileImage",
        userId: newDonor.email,
      });
      // Logic to add a new appointment
      const request = await fetch("/api/donors", {
        method: "POST",
        body: JSON.stringify({ ...donorWithoutId, profileImage }),
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
      onRefetch();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    // Update the appointments state after adding
    handleClose();
  }
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
        <Table sx={{ minWidth: "65vw" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }} color="primary.main">
                Donors
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} color="primary.main">
                Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} color="primary.main">
                Blood Type
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} color="primary.main">
                Address
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} color="primary.main">
                Date Added
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} color="primary.main">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donors
              .filter(
                (donor) =>
                  donor?.donor.email?.includes(searchQuery) ||
                  donor?.donor.address?.includes(searchQuery),
              )
              .map((donor, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Avatar
                      sx={{ width: "25px", height: "25px" }}
                      alt={donor.donor.firstName}
                      src={donor.donor.profileImage}
                    />
                  </TableCell>
                  <TableCell>
                    {donor.donor.firstName +
                      " " +
                      donor.donor.middleName +
                      " " +
                      donor.donor.lastName}
                  </TableCell>
                  <TableCell>
                    {donor.bloodGroup.groupName}
                  </TableCell>
                  
                  <TableCell>{donor?.donor.address}</TableCell>
                  <TableCell>
                    {moment(donor?.donor?.createdAt).fromNow()}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleExpand(donor)}>
                      <ExpandCircleDownIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(donor)}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Dialog open={expand} onClose={() => setExpand(false)}>
          <Box sx={style}>
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
              <Typography variant="h5">Donor Details</Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 2,
                }}
              >
                <Avatar
                  alt={selectedDonor?.donor.firstName}
                  src={selectedDonor?.donor.profileImage}
                  sx={{ width: "200px", height: "200px" }}
                ></Avatar>
                <div>
                  <Typography variant="h6">
                    <strong>Donor Name:</strong>{" "}
                    {selectedDonor?.donor.firstName}{" "}
                    {selectedDonor?.donor.lastName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Blood Group:</strong>{" "}
                    {selectedDonor?.bloodGroup?.groupName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {selectedDonor?.donor.email}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Contact Number:</strong>{" "}
                    {selectedDonor?.donor.contactNumber}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Gender:</strong> {selectedDonor?.donor.gender}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Address:</strong> {selectedDonor?.donor.address}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Birth Date:</strong>{" "}
                    {selectedDonor?.donor.dateOfBirth?.toString()}
                  </Typography>
                </div>
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
            <DialogTitle>Add Donor</DialogTitle>
            <DialogContent sx={{ minWidth: "500px" }}>
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
              <InputLabel>FirstName</InputLabel>
              <TextField
                fullWidth
                name="firstName"
                value={newDonor.firstName}
                onChange={handleInputChange}
                margin="normal"
              />
              <InputLabel>LastName</InputLabel>
              <TextField
                fullWidth
                name="lastName"
                value={newDonor.lastName}
                onChange={handleInputChange}
                margin="normal"
              />
              <InputLabel>MiddleName</InputLabel>
              <TextField
                fullWidth
                name="middleName"
                value={newDonor.middleName}
                onChange={handleInputChange}
                margin="normal"
              />
              <InputLabel>Email</InputLabel>
              <TextField
                fullWidth
                name="email"
                value={newDonor.email}
                onChange={handleInputChange}
                margin="normal"
              />
              <InputLabel>Phone Number</InputLabel>
              <TextField
                fullWidth
                name="contactNumber"
                value={newDonor.contactNumber}
                onChange={handleInputChange}
                margin="normal"
              />
              <InputLabel>Address</InputLabel>
              <TextField
                fullWidth
                name="address"
                value={newDonor.address}
                onChange={handleInputChange}
                margin="normal"
              />
              <InputLabel>Blood Group</InputLabel>
              <Select
                fullWidth
                name="bloodGroupName"
                value={newDonor.bloodGroupName}
                onChange={handleSelectInputChange}
                margin="dense"
              >
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (group) => (
                    <MenuItem key={group} value={group}>
                      {group}
                    </MenuItem>
                  ),
                )}
              </Select>
              <InputLabel>Volume of Blood</InputLabel>
              <TextField
                fullWidth
                type="number"
                name="volume"
                value={newDonor.volume}
                onChange={handleInputChange}
                margin="normal"
              />
              <InputLabel>Gender</InputLabel>
              <Select
                fullWidth
                name="gender"
                value={newDonor.gender}
                onChange={handleSelectInputChange}
                margin="dense"
              >
                {["Male", "Female"].map((group) => (
                  <MenuItem key={group} value={group}>
                    {group}
                  </MenuItem>
                ))}
              </Select>
              <InputLabel>Date of Birth</InputLabel>
              <TextField
                fullWidth
                type="date"
                name="dateOfBirth"
                value={newDonor.dateOfBirth}
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
        <Dialog
          open={openUpdate}
          onClose={() => setOpenUpdate(false)}
          sx={{ maxWidth: "md" }}
        >
          <DialogTitle>Update Donor</DialogTitle>
          <DialogContent sx={{ minWidth: "500px" }}>
            <InputLabel>FirstName</InputLabel>
            <TextField
              fullWidth
              name="firstName"
              value={updateDonor.firstName}
              onChange={handleUpdateInputChange}
              margin="normal"
            />
            <InputLabel>LastName</InputLabel>
            <TextField
              fullWidth
              name="lastName"
              value={updateDonor.lastName}
              onChange={handleUpdateInputChange}
              margin="normal"
            />
            <InputLabel>MiddleName</InputLabel>
            <TextField
              fullWidth
              name="middleName"
              value={updateDonor.middleName}
              onChange={handleUpdateInputChange}
              margin="normal"
            />
            <InputLabel>Email</InputLabel>
            <TextField
              fullWidth
              name="email"
              value={updateDonor.email}
              onChange={handleUpdateInputChange}
              margin="normal"
            />
            <InputLabel>Phone Number</InputLabel>
            <TextField
              fullWidth
              name="contactNumber"
              value={updateDonor.contactNumber}
              onChange={handleUpdateInputChange}
              margin="normal"
            />
            <InputLabel>Address</InputLabel>
            <TextField
              fullWidth
              name="address"
              value={updateDonor.address}
              onChange={handleUpdateInputChange}
              margin="normal"
            />
            <InputLabel>Blood Group</InputLabel>
            <Select
              fullWidth
              name="bloodGroupName"
              value={updateDonor.bloodGroupName}
              onChange={handleSelectUpdateInputChange}
              margin="dense"
            >
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (group) => (
                  <MenuItem key={group} value={group}>
                    {group}
                  </MenuItem>
                ),
              )}
            </Select>
            <InputLabel>Volume of Blood</InputLabel>
            <TextField
              fullWidth
              type="number"
              name="volume"
              value={updateDonor.volume}
              onChange={handleUpdateInputChange}
              margin="normal"
            />
            <InputLabel>Gender</InputLabel>
            <Select
              fullWidth
              name="gender"
              value={updateDonor.gender}
              onChange={handleSelectUpdateInputChange}
              margin="dense"
            >
              {["male", "female"].map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </Select>
            <InputLabel>Date of Birth</InputLabel>
            <TextField
              fullWidth
              type="date"
              name="dateOfBirth"
              value={updateDonor.dateOfBirth.split("T")[0]}
              onChange={handleUpdateInputChange}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpdateClose}>Cancel</Button>
            <LoadingButton
              loading={loading}
              disabled={loading}
              onClick={handleUpdate}
              color="primary"
            >
              Update
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </TableContainer>
    </Box>
  );
};

export default AdminDonorsTable;
