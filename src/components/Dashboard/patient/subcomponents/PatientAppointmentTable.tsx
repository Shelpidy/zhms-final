"use client";
import React, { useState, useEffect } from "react";
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
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  Badge, // Add Badge component
  Dialog, // Add Dialog component
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
  InputAdornment,
  Avatar,
  Card,
  Typography,
  TextField, // Add TextField component for search
} from "@mui/material";
import { CancelOutlined, Delete, Edit, Search } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import moment from "moment";
import CustomButton from "@/components/CustomButton";

const style = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "70vw",
  maxHeight: "88vh",
  bgcolor: "background.paper",
  p: 4,
  overflow: "auto",
};

type DoctorProfile = {
  doctor: Doctor;
  user: User;
  specialization: Specialization;
};

type AppointmentDetail = {
  doctor: DoctorProfile;
  appointment: Appointment;
  roomId: string;
};

type DoctorAppointmentTableProps = {
  appointments: AppointmentDetail[];
  refresh: () => void;
};

const PatientAppointmentTable: React.FC<DoctorAppointmentTableProps> = ({
  appointments,
  refresh,
}) => {
  // State for filtering appointments
  const [filter, setFilter] = useState("all");
  // State for marking appointments as completed
  const [completedAppointments, setCompletedAppointments] = useState<number[]>(
    [],
  );

  const [Appointments, setAppointments] = useState<AppointmentDetail[]>([]);

  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentDetail | null>(null);
  const [expand, setExpand] = useState<boolean>(false);

  // State for search input
  const [searchText, setSearchText] = useState("");
  // State for confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // State to track the appointment to delete
  const [appointmentToDelete, setAppointmentToDelete] = useState<number | null>(
    null,
  );

  useEffect(() => {
    setAppointments(appointments);
  }, []);

  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
  });

  // Function to handle filtering appointments
  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilter(event.target.value);
  };

  const handleSelectAppointment = (appointment: AppointmentDetail) => {
    setSelectedAppointment(appointment);
    setExpand(true);
  };
  // Function to mark an appointment as completed
  const handleMarkCompleted = async (appointmentId: string) => {
    try {
      let response = await fetch("/api/appointments/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Function to handle opening the delete confirmation dialog
  const handleOpenDeleteDialog = (appointmentIndex: number) => {
    setAppointmentToDelete(appointmentIndex);
    setDeleteDialogOpen(true);
  };

  // Function to handle closing the delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setAppointmentToDelete(null);
    setDeleteDialogOpen(false);
  };

  // Function to delete an appointment
  const handleDeleteAppointment = () => {
    if (appointmentToDelete !== null) {
      // Remove the appointment from the list (you may want to use API calls or other state management)
      // For now, we'll just log the deletion
      console.log(`Deleted appointment at index: ${appointmentToDelete}`);
      setDeleteDialogOpen(false);
    }
  };

  // Function to handle searching appointments
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <Box>
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={handleSearch}
          sx={{ minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="end">
                <Search /> {/* Add the Search icon here */}
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "70vw" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Doctor</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Doctor Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Reason</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Appointment Date
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Appointment Status
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment, index) => {
              

              return (
                <TableRow
                  key={index}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f4f4f4" },
                  }}
                >
                  <TableCell>
                    <Avatar
                      sx={{ width: "25px", height: "25px" }}
                      alt={appointment.doctor.user.firstName}
                      src={appointment.doctor.user.profileImage}
                    ></Avatar>
           
                  </TableCell>
                  <TableCell> 
                      {appointment.doctor.user.firstName}{" "}
                      {appointment.doctor.user.middleName}{" "}
                      {appointment.doctor.user.lastName}

                  </TableCell>
                  <TableCell> 
                      {appointment.appointment.reason}
                  </TableCell>

                  <TableCell>
                    {moment(appointment.appointment.appointmentDate).fromNow()}
                  </TableCell>
                  <TableCell>
                    {appointment.appointment.appointmentStatus}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleSelectAppointment(appointment)}
                      size="small"
                    >
                      more
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={expand} onClose={() => setExpand(false)}>
        <DialogContent sx={{ maWidth: "400px" }}>
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
          <Box sx={style}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: -5,
                marginRight: -5,
              }}
            >
              <Button onClick={() => setExpand(false)}>
                <CloseIcon color="primary" />
              </Button>
            </Box>
            <Box sx={{ marginTop: -1, textAlign: "center" }}>
              <Paper
                variant="outlined"
                sx={{
                  padding: 2,
                  marginBottom: 2,
                }}
              >
                <div>
                  <Typography variant="h5">Doctor Details</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      marginTop: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        sx={{ width: "200px", height: "200px" }}
                        alt={selectedAppointment?.doctor.user.firstName}
                        src={selectedAppointment?.doctor.user.profileImage}
                      />
                    </Box>
                    <div>
                      <Typography variant="h6">
                        <strong>Doctor Name:</strong>{" "}
                        {selectedAppointment?.doctor.user.firstName}{" "}
                        {selectedAppointment?.doctor.user.middleName}{" "}
                        {selectedAppointment?.doctor.user.lastName}
                      </Typography>
                      <Typography variant="h6">
                        <strong>Specialization:</strong>{" "}
                        {
                          selectedAppointment?.doctor.specialization
                            ?.specializationName
                        }
                      </Typography>
                      <Typography variant="body1">
                        <strong>Email:</strong>{" "}
                        {selectedAppointment?.doctor.user.email}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Contact Number:</strong>{" "}
                        {selectedAppointment?.doctor.user.contactNumber}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Gender:</strong>{" "}
                        {selectedAppointment?.doctor.user.gender}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Address:</strong>{" "}
                        {selectedAppointment?.doctor.user.address}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Birth Date:</strong>{" "}
                        {selectedAppointment?.doctor.user.dateOfBirth}
                      </Typography>
                    </div>
                  </Box>
                </div>
                <Button variant="contained" color="primary" size="small">
                  Message
                </Button>
              </Paper>
            </Box>

            <Box sx={{ marginTop: 3, textAlign: "center" }}>
              <Paper
                variant="outlined"
                sx={{
                  padding: 2,
                  marginBottom: 2,
                }}
              >
                <div>
                  <Typography variant="h5">Appointment Details</Typography>
                  <div style={{ marginTop: 5 }}>
                    <Typography variant="body1">
                      <strong>Appointment Date</strong>:{" "}
                      {
                        selectedAppointment?.appointment.appointmentDate
                          .toString()
                          .split("T")[0]
                      }
                    </Typography>
                    <Typography variant="body1">
                      <strong>Appointment Status</strong>:{" "}
                      {selectedAppointment?.appointment.appointmentStatus}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Note</strong>:{" "}
                      {selectedAppointment?.appointment.note}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Reason</strong>:{" "}
                      {selectedAppointment?.appointment.reason}
                    </Typography>
                  </div>
                </div>
              </Paper>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PatientAppointmentTable;
