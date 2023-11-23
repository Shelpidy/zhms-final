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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Modal,
  Avatar,
  Typography,
} from "@mui/material";
import { Delete, Edit, Add, Search } from "@mui/icons-material";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import moment from "moment";
import { LoadingButton } from "@mui/lab";

type PatientProfile = {
  patient: Patient;
  user: User;
  bloodGroup: BloodGroup;
};

interface AdminPatientTableProps {
  patients: PatientProfile[];
  onRefetch: () => void;
}

const dummyUser = {
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
  minWidth: "500px",
  maxHeight: "88vh",
  bgcolor: "background.paper",
  p: 4,
};

const AdminPatientsTable: React.FC<AdminPatientTableProps> = ({
  patients,
  onRefetch,
}) => {
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [expand, setExpand] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [newPatient, setNewPatient] = useState<{
    patientEmail: string;
    bloodGroup: string;
    diagnosis: string;
  }>({
    patientEmail: "",
    bloodGroup: "",
    diagnosis: "",
  });

  const [updatePatient, setUpdatePatient] = useState<{
    patientEmail: string;
    bloodGroup: string;
    diagnosis: string;
    patientId: string;
  }>({
    patientId: "",
    patientEmail: "",
    bloodGroup: "",
    diagnosis: "",
  });

  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
  const handleExpand = (patients: PatientProfile) => {
    console.log(patients);
    setSelectedPatient(patients);
    setExpand(true);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPatient(null);
  };

  const handleUpdateClose = () => {
    setOpenUpdate(false);
  };

  const handleEdit = (patient: PatientProfile) => {
    console.log(patient);
    setSelectedPatient(patient);
    setUpdatePatient({
      patientId: patient.patient.patientId,
      patientEmail: patient.user.email,
      bloodGroup: patient.bloodGroup?.groupName,
      diagnosis: patient.patient?.diagnosis,
    });
    setOpenUpdate(true);
  };
  async function handleDelete(patientId: string) {
    console.log(patientId);
    try {
      // Logic to delete the appointment
      console.log(patientId);
      const request = await fetch(`/api/patients/patientId=${patientId}`, {
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
        onRefetch();
      } else {
        Toast.fire({
          icon: "error",
          iconColor: "red",
          text: data?.message,
        });
      }
     
      // Update the appointments state after deletion
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdate() {
    // Logic to update the appointment
    console.log(updatePatient);
    try {
      const request = await fetch(`/api/patients`, {
        method: "PUT",
        body: JSON.stringify(updatePatient),
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
      onRefetch();
    } catch (error) {
      console.log(error);
    }
    // Update the appointments state after updating
    handleUpdateClose();
  }

  async function handleAdd() {
    try {
      setLoading(true);
      console.log("New Appointment", newPatient);
      // Logic to add a new appointment
      const request = await fetch("/api/patients", {
        method: "POST",
        body: JSON.stringify(newPatient),
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
        onRefetch();
      } else {
        Toast.fire({
          icon: "error",
          iconColor: "red",
          text: data?.message,
        });
      }
      setLoading(false);
    
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    // Update the appointments state after adding
    handleClose();
    newPatient.patientEmail = "";
    newPatient.diagnosis = "";
    newPatient.bloodGroup = "";
  }

  const handleSelectInputChange = (event: SelectChangeEvent<any>) => {
    const { name, value } = event.target;
    setNewPatient((prevPatient) => ({
      ...prevPatient,
      [name]: value,
    }));
  };
  const handleSelectUpdateInputChange = (event: SelectChangeEvent<any>) => {
    const { name, value } = event.target;
    setUpdatePatient((prevPatient) => ({
      ...prevPatient,
      [name]: value,
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewPatient((prevPatient) => ({
      ...prevPatient,
      [name]: value,
    }));
  };
  const handleUpdateInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setUpdatePatient((prevPatient) => ({
      ...prevPatient,
      [name]: value,
    }));
  };
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>BloodGroup</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date Added</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {patients
              .filter(
                (patient) =>
                  patient.user.email.includes(searchQuery) ||
                  patient.bloodGroup.groupName.includes(searchQuery),
              )
              .map((patient, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Avatar
                      sx={{ width: "25px", height: "25px" }}
                      alt={patient.user.firstName}
                      src={patient.user.profileImage}
                    />
                  </TableCell>
                  <TableCell>
                    {patient.user.firstName}{" "}
                      {patient.user.middleName}{" "}
                      
                      {patient.user.lastName}
                  </TableCell>
                  <TableCell>{patient?.bloodGroup?.groupName}</TableCell>
                  <TableCell>{patient?.patient.createdAt.toString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleExpand(patient)}>
                      <ExpandCircleDownIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(patient)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(patient.patient.patientId)}
                    >
                      <Delete />
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
            <Box sx={{ marginTop: -4, textAlign: "center" }}>
              <DialogTitle>Patient Details</DialogTitle>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 0,
                }}
              >
                <Avatar
                  alt={selectedPatient?.user.firstName}
                  sx={{ width: "200px", height: "200px" }}
                  src={selectedPatient?.user.profileImage}
                />
                <div>
                  <Typography variant="h6">
                    <strong>Patient Name:</strong>{" "}
                    {selectedPatient?.user.firstName}{" "}
                    {selectedPatient?.user.middleName}{" "}
                    {selectedPatient?.user.lastName}
                  </Typography>
                  <Typography variant="h6">
                    <strong>Diagnosis:</strong>{" "}
                    {selectedPatient?.patient?.diagnosis}
                  </Typography>
                  <Typography variant="h6">
                    <strong>BloodGroup:</strong>{" "}
                    {selectedPatient?.bloodGroup?.groupName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {selectedPatient?.user.email}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Contact Number:</strong>{" "}
                    {selectedPatient?.user.contactNumber}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Gender:</strong> {selectedPatient?.user.gender}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Address:</strong> {selectedPatient?.user.address}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Birth Date:</strong>{" "}
                    {selectedPatient?.user.dateOfBirth?.toString()}
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
            <DialogTitle>Add Patient</DialogTitle>
            <DialogContent sx={{ minWidth: "500px" }}>
              <InputLabel>User Email</InputLabel>
              <TextField
                fullWidth
                name="patientEmail"
                value={newPatient.patientEmail}
                onChange={handleInputChange}
                margin="normal"
              />
              <InputLabel>Blood Group</InputLabel>
              <Select
                fullWidth
                name="bloodGroup"
                value={newPatient.bloodGroup}
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
              <InputLabel>Patient Diagnosis</InputLabel>
              <TextField
                fullWidth
                name="diagnosis"
                value={newPatient.diagnosis}
                onChange={handleInputChange}
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <LoadingButton
                loading={loading}
                disabled={loading}
                onClick={handleAdd}
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
          <DialogTitle>Update Patient</DialogTitle>
          <DialogContent sx={{ minWidth: "500px" }}>
            <InputLabel>Patient Email</InputLabel>
            <TextField
              fullWidth
              name="patientEmail"
              disabled
              value={updatePatient.patientEmail}
              onChange={handleUpdateInputChange}
              margin="normal"
            />
            <InputLabel>Blood Group</InputLabel>
            <Select
              fullWidth
              name="bloodGroup"
              value={updatePatient.bloodGroup}
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
            <InputLabel>Diagnosis</InputLabel>
            <TextField
              fullWidth
              name="diagnosis"
              value={updatePatient.diagnosis}
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
        </Dialog>
      </TableContainer>
    </Box>
  );
};

export default AdminPatientsTable;
