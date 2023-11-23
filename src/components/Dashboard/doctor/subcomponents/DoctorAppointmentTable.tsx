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

type PatientProfile = {
  patient: Patient;
  user: User;
  bloodGroup: BloodGroup;
};

type AppointmentDetail = {
  patient: PatientProfile;
  appointment: Appointment;
  roomId: string;
};

type DoctorAppointmentTableProps = {
  appointments: AppointmentDetail[];
  refresh: () => void;
};

const DoctorAppointmentTable: React.FC<DoctorAppointmentTableProps> = ({
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
      let response = await fetch("/api/appointments/doctors", {
        method: "PUT",
        body:JSON.stringify({appointmentStatus:"Completed",appointmentId}),
        headers: {
          "Content-Type": "application/json",
        },
      });

      let data = await response.json();
      if(response.status == 202){
        Toast.fire({
          text:'Mark Completed',
          icon:"success"
        })
        refresh()  
      }else{
        Toast.fire({
          text:'Failed to update appointment',
          icon:"error"
        })
      }
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
        <FormControl variant="outlined" sx={{ marginRight: 2 }}>
          <Select
            value={filter}
            onChange={handleFilterChange}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>
        </FormControl>
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
            <TableCell sx={{ fontWeight: "bold" }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
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
            {Appointments.map((appointment, index) => {
              // Filter based on selected status and search text
              const isCompleted =
                appointment.appointment.appointmentStatus === "completed";
              const isPending =
                appointment.appointment.appointmentStatus === "pending";
              const isCancelled =
                appointment.appointment.appointmentStatus === "cancel";

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
                      alt={appointment.patient.user.firstName}
                      src={appointment.patient.user.profileImage}
                    ></Avatar>
                   
                  </TableCell>
                  <TableCell>
                       {appointment.patient.user.firstName}{" "}
                       {appointment.patient.user.middleName}{" "}
                       {appointment.patient.user.lastName}
                  </TableCell>


                  <TableCell>
                    {moment(appointment.appointment.appointmentDate).fromNow()}
                  </TableCell>
                  <TableCell>
                    {isCancelled ? (
                      <CancelOutlined />
                    ) : (
                      <Checkbox
                        checked={isCompleted}
                        onChange={() =>
                          handleMarkCompleted(
                            appointment.appointment.appointmentId,
                          )
                        }
                        color="primary"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <CustomButton
                      onClick={() => handleSelectAppointment}
                      size="small"
                    >
                      more
                    </CustomButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
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
          <Box sx={{ marginTop: 2, textAlign: "center" }}>
            <Card
              variant="outlined"
              sx={{
                padding: 2,
                marginBottom: 2,
                boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.4)",
              }}
            >
              <div>
                <Typography variant="h5">Patients Details</Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    marginTop: 2,
                  }}
                >
                  <Avatar
                    sx={{ width: "200px", height: "200px" }}
                    alt={selectedAppointment?.patient.user.firstName}
                    src={selectedAppointment?.patient.user.profileImage}
                  />

                  {/* <img
                      alt="Profile"
                      style={{
                        width: "28%", // Adjust the width as needed
                        height: "auto", // Auto height to maintain aspect ratio
                        maxWidth: "75%",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      src={dummyUser.profileImage} // Use user's profile image
                    /> */}
                  <div>
                    <Typography variant="h6">
                      <strong>Patient Name:</strong>{" "}
                      {selectedAppointment?.patient.user.firstName}{" "}
                      {selectedAppointment?.patient.user.middleName}{" "}
                      {selectedAppointment?.patient.user.lastName}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Diagnosis:</strong>{" "}
                      {selectedAppointment?.patient.patient.diagnosis}
                    </Typography>
                    <Typography variant="body1">
                      <strong>BloodGroup:</strong>{" "}
                      {selectedAppointment?.patient.bloodGroup?.groupName}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Email:</strong>{" "}
                      {selectedAppointment?.patient.user.email}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Contact Number:</strong>{" "}
                      {selectedAppointment?.patient.user?.contactNumber}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Gender:</strong>{" "}
                      {selectedAppointment?.patient.user.gender}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Address:</strong>{" "}
                      {selectedAppointment?.patient.user?.address}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Birth Date:</strong>{" "}
                      {selectedAppointment?.patient.user.dateOfBirth}
                    </Typography>
                  </div>
                </Box>
                <div>
                  <Typography>Patient Email</Typography>
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <TextField label="Subject" variant="outlined" fullWidth />
                    <TextField label="Title" variant="outlined" fullWidth />
                  </div>
                  <Typography variant="h6">Content</Typography>
                  <TextField variant="outlined" fullWidth multiline rows={4} />
                  <CustomButton size="small">Send</CustomButton>
                </div>
                <CustomButton size="small">Message</CustomButton>
              </div>
            </Card>
          </Box>
          <Box sx={{ marginTop: 3, textAlign: "center" }}>
            <Card
              variant="outlined"
              sx={{
                padding: 2,
                marginBottom: 2,
                boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.4)",
              }}
            >
              <div>
                <Typography variant="h5">Appointment Details</Typography>
                <div style={{ marginTop: 5 }}>
                  <Typography variant="body1">
                    <strong>Appointment Date</strong>:{" "}
                    {selectedAppointment?.appointment.appointmentDate.toString()}
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
            </Card>
          </Box>
        </Box>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Appointment?"}
        </DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this appointment?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAppointment} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorAppointmentTable;
