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
  Card,
  Typography,
  Divider,
} from "@mui/material";
import { Delete, Edit, Add, Search, Chat } from "@mui/icons-material";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import CustomButton from "@/components/CustomButton";
import { useCurrentUser } from "@/hooks/customHooks";
import { LoadingButton } from "@mui/lab";
import Link from "next/link";

const Toast = Swal.mixin({
  toast: true,
  position: "center",
  timer: 3000,
  timerProgressBar: true,
  showConfirmButton: false,
});

type DoctorProfile = {
  doctor: Doctor;
  user: User;
  specialization: Specialization;
  roomId: string;
};

type PatientProfile = {
  patient: Patient;
  user: User;
  bloodGroup: BloodGroup;
  roomId: string;
};

type AppointmentDetail = {
  doctor: DoctorProfile;
  patient: PatientProfile;
  appointment: Appointment;
};

interface AdminAppointmentsTableProps {
  appointments: AppointmentDetail[];
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
  minWidth: "50vw",
  maxHeight: "88vh",
  bgcolor: "background.paper",
  p: 4,
  overflow: "auto",
};

const AdminAppointmentsTable: React.FC<AdminAppointmentsTableProps> = ({
  appointments,
  onRefetch,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [expand, setExpand] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentDetail>(appointments[0]);
  const [selectedUpdateAppointment, setSelectedUpdateAppointment] =
    useState<AppointmentDetail | null>(null);

  const currentUser = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [newAppointment, setNewAppointment] = useState<
    Omit<
      Appointment,
      "appointmentId" | "createdAt" | "updatedAt" | "doctorId" | "patientId"
    > & { doctorEmail: string; patientEmail: string }
  >({
    appointmentStatus: "pending",
    doctorEmail: "",
    patientEmail: "",
    reason: "",
    note: "",
    appointmentDate: new Date(),
  });
  const [updateAppointment, setUpdateAppointment] = useState<
    Omit<Appointment, "createdAt" | "updatedAt" | "doctorId" | "patientId"> & {
      doctorEmail: string;
      patientEmail: string;
    }
  >({
    appointmentId: "",
    appointmentStatus: "pending",
    doctorEmail: "",
    patientEmail: "",
    reason: "",
    note: "",
    appointmentDate: new Date(),
  });

  const handleExpand = (appointment: AppointmentDetail) => {
    console.log({ selectedAppointment: appointment });
    setSelectedAppointment(appointment);
    setExpand(true);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleUpdateClose = () => {
    setOpenUpdate(false);
  };
  const handleClose = () => {
    setOpen(false);
    // setSelectedAppointment(null);
  };

  const handleEdit = (appointment: AppointmentDetail) => {
    setSelectedUpdateAppointment(appointment);
    console.log(appointment);
    setUpdateAppointment({
      appointmentId: appointment.appointment.appointmentId,
      appointmentStatus: appointment.appointment.appointmentStatus,
      doctorEmail: appointment.doctor.user.email,
      patientEmail: appointment.patient.user.email,
      reason: appointment.appointment.reason,
      note: appointment.appointment.note,
      appointmentDate: new Date(appointment.appointment.appointmentDate),
    });
    setOpenUpdate(true);
  };

  async function handleDelete(appointmentId: string) {
    try {
      // Logic to delete the appointment
      console.log(appointmentId);
      const request = await fetch(
        `/api/appointments?appointmentId=${appointmentId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );
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
      onRefetch();
      // Update the appointments state after deletion
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdate() {
    // Logic to update the appointment
    console.log(updateAppointment);
    const { appointmentId, ...newUpdateAppointment } = updateAppointment;
    try {
      setLoading(true);
      const request = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PUT",
        body: JSON.stringify(newUpdateAppointment),
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
      setLoading(false);
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
      console.log("New Appointment", newAppointment);
      // Logic to add a new appointment
      console.log(currentUser?.userId);
      const request = await fetch("/api/appointments", {
        method: "POST",
        body: JSON.stringify({
          ...newAppointment,
          userId: currentUser?.userId
        }),
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
      onRefetch();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    // Update the appointments state after adding
    handleClose();
    newAppointment.doctorEmail = "";
    newAppointment.patientEmail = "";
    newAppointment.note = "";
    newAppointment.reason = "";
  }

  const handleSelectInputChange = (
    event: SelectChangeEvent<"pending" | "completed" | "cancel">,
  ) => {
    const { name, value } = event.target;
    setNewAppointment((prevAppointment) => ({
      ...prevAppointment,
      [name]: value,
    }));
  };
  const handleSelectUpdateInputChange = (
    event: SelectChangeEvent<"pending" | "completed" | "cancel">,
  ) => {
    const { name, value } = event.target;
    setUpdateAppointment((prevAppointment) => ({
      ...prevAppointment,
      [name]: value,
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewAppointment((prevAppointment) => ({
      ...prevAppointment,
      [name]: value,
    }));
  };
  const handleUpdateInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setUpdateAppointment((prevAppointment) => ({
      ...prevAppointment,
      [name]: value,
    }));
  };

  const [newEmail, setNewEmail] = useState<{
    title: string;
    subject: string;
    content: string;
    email: string;
  }>({
    title: "",
    subject: "",
    content: "",
    email: "",
  });

  const [newEmailPatient, setNewEmailPatient] = useState<{
    title: string;
    subject: string;
    content: string;
    email: string;
  }>({
    title: "",
    subject: "",
    content: "",
    email: "",
  });

  const handleInputChangeEmail = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setNewEmail((prevEmail) => ({
      ...prevEmail,
      [name]: value,
    }));
  };

  const handleInputChangeEmailPatient = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setNewEmailPatient((prevEmail) => ({
      ...prevEmail,
      [name]: value,
    }));
  };



  const handleSendEmail = async (email: string) => {
    try {
      console.log(email);
      setLoading(true);
      const request = await fetch("/api/mail", {
        method: "POST",
        body: JSON.stringify({
          ...newEmail,
          email,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await request.json();
      if (request.status === 201) {
        console.log(JSON.stringify(data));
        setOpen(false)
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
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: "error",
        iconColor: "red",
        text:"Failed to send email"
      });
    }finally{
      setLoading(false)
    }
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Box sx={{marginBottom:10}}>
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
        <Table sx={{ minWidth: "70vw" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Doctor</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Doctor Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Patient Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Appointment Date
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments
              .filter(
                (appointment) =>
                  appointment.doctor.user.email.includes(searchQuery) ||
                  appointment.patient.user.email.includes(searchQuery) ||
                  appointment.appointment.appointmentDate
                    .toString()
                    .includes(searchQuery),
              )
              .map((appointment, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Avatar
                      sx={{ width: "25px", height: "25px" }}
                      alt={appointment.doctor.user.firstName}
                      src={appointment.doctor.user.profileImage}
                    />
                  </TableCell>
                  <TableCell>
                    {appointment.doctor.user.firstName} 
                     {" "}
                     {appointment.doctor.user.middleName} 
                      {" "}
                      {appointment.doctor.user.lastName}
                  </TableCell>
                  <TableCell>
                    <Avatar
                      sx={{ width: "25px", height: "25px" }}
                      alt={appointment.patient.user.firstName}
                      src={appointment.patient.user.profileImage}
                    />
                  </TableCell>
                  <TableCell>
                    {appointment.patient.user.firstName}
                    {" "}
                    {appointment.patient.user.middleName} 
                     {" "}
                      {appointment.patient.user.lastName}
                  </TableCell>
                  <TableCell>
                    {
                      appointment.appointment.appointmentDate
                        .toString()
                        .split("T")[0]
                    }
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleExpand(appointment)}>
                      <ExpandCircleDownIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(appointment)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleDelete(appointment.appointment.appointmentId)
                      }
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {/* <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
        Add New Appointment
      </Button> */}
        <Dialog open={expand} onClose={() => setExpand(false)}>
          <Box sx={style}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: -5,
                marginRight: -5,
                padding: "5px",
              }}
            >
              <IconButton onClick={() => setExpand(false)}>
                <CloseIcon color="primary" />
              </IconButton>
            </Box>
            <Box sx={{ marginTop: 3 }}>
              <Box
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
              </Box>
            </Box>
            <Divider />
            <Box sx={{ marginTop: -1 }}>
              <Box
                sx={{
                  padding: 2,
                  marginBottom: 2,
                }}
              >
                <div>
                  <Typography variant="h5" textAlign="center">
                    Doctor Details
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 2,
                      gap: 4,
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
                      <Typography variant="body1">
                        <strong>Doctor Name:</strong>{" "}
                        {selectedAppointment?.doctor.user.firstName}{" "}
                        {selectedAppointment?.doctor.user.middleName}{" "}
                        {selectedAppointment?.doctor.user.lastName}
                      </Typography>
                      <Typography variant="body1">
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
                        {
                          selectedAppointment?.doctor.user.dateOfBirth?.split(
                            "T",
                          )[0]
                        }
                      </Typography>
                    </div>
                  </Box>
                </div>
                <div>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "5px",
                      marginY: "5px",
                    }}
                  >
                    <Typography variant="h5">Send Email</Typography>
                    <Button
                      sx={{ marginTop: 1 }}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      <Link
                        href={`/message/${selectedAppointment?.doctor?.roomId}`}
                      >
                        <Chat />
                      </Link>
                    </Button>
                  </Box>
                  <div className="grid mb-4 grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      size="small"
                      name="subject"
                      value={newEmail.subject}
                      label="Subject"
                      variant="outlined"
                      fullWidth
                      onChange={handleInputChangeEmail}
                    />
                    <TextField
                      size="small"
                      name="title"
                      value={newEmail.title}
                      label="Title"
                      variant="outlined"
                      fullWidth
                      onChange={handleInputChangeEmail}
                    />
                  </div>

                  <TextField
                    label="Message"
                    variant="outlined"
                    name="content"
                    value={newEmail.content}
                    fullWidth
                    multiline
                    rows={4}
                    onChange={handleInputChangeEmail}
                  />
                  <LoadingButton
                    loading={loading}
                    disabled={loading}
                    sx={{ marginTop: 2 }}
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() =>
                      handleSendEmail(
                        selectedAppointment?.doctor?.user?.email || "",
                      )
                    }
                  >
                    Send
                  </LoadingButton>
                </div>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ marginTop: 2 }}>
              <Box
                sx={{
                  padding: 2,
                  marginBottom: 2,
                }}
              >
                <div>
                  <Typography variant="h5" textAlign="center">
                    Patients Details
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 2,
                      gap: 4,
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
                        alt={selectedAppointment?.patient.user.firstName}
                        src={selectedAppointment?.patient.user.profileImage}
                      />
                    </Box>

                    <div>
                      <Typography variant="body1">
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
                        {
                          selectedAppointment?.patient.user.dateOfBirth?.split(
                            "T",
                          )[0]
                        }
                      </Typography>
                    </div>
                  </Box>
                  <div>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "5px",
                        marginY: "5px",
                      }}
                    >
                      <Typography variant="h5">Send Email</Typography>
                      <Button
                        sx={{ marginTop: 1 }}
                        variant="contained"
                        color="primary"
                        size="small"
                      >
                        <Link
                          href={`/message/${selectedAppointment?.patient.roomId}`}
                        >
                          <Chat />
                        </Link>
                      </Button>
                    </Box>
                    <div className="grid mb-4 grid-cols-1 md:grid-cols-2 gap-4">
                      <TextField
                        size="small"
                        name="subject"
                        label="Subject"
                        value={newEmailPatient.subject}
                        variant="outlined"
                        fullWidth
                        onChange={handleInputChangeEmailPatient}
                      />
                      <TextField
                        size="small"
                        name="title"
                        label="Title"
                        value={newEmailPatient.title}
                        variant="outlined"
                        fullWidth
                        onChange={handleInputChangeEmailPatient}
                      />
                    </div>

                    <TextField
                      variant="outlined"
                      name="content"
                      label="Message"
                      value={newEmailPatient.content}
                      fullWidth
                      multiline
                      rows={4}
                      onChange={handleInputChangeEmailPatient}
                    />
                    <LoadingButton
                      loading={loading}
                      disabled={loading}
                      sx={{ marginTop: 2 }}
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() =>
                        handleSendEmail(
                          selectedAppointment?.patient?.user.email || "",
                        )
                      }
                    >
                      Send
                    </LoadingButton>
                  </div>
                </div>
              </Box>
            </Box>
          </Box>
        </Dialog>
       
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            sx={{ maxWidth: "lg" }}
          >
            <DialogTitle>Add Appointment</DialogTitle>
            <DialogContent sx={{ minWidth: "500px" }}>
              <InputLabel>Doctor Email</InputLabel>
              <TextField
                fullWidth
                name="doctorEmail"
                value={newAppointment.doctorEmail}
                onChange={handleInputChange}
                margin="normal"
              />
              <InputLabel>Patient Email</InputLabel>
              <TextField
                fullWidth
                name="patientEmail"
                value={newAppointment.patientEmail}
                onChange={handleInputChange}
                margin="normal"
              />
              <InputLabel>Appointment Status</InputLabel>
              <Select
                fullWidth
                name="appointmentStatus"
                value={newAppointment.appointmentStatus}
                onChange={handleSelectInputChange}
                margin="dense"
              >
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="cancel">Cancelled</MenuItem>
              </Select>
              <InputLabel>Reason</InputLabel>
              <TextField
                fullWidth
                name="reason"
                value={newAppointment.reason}
                onChange={handleInputChange}
                margin="normal"
              />
              <InputLabel>Note</InputLabel>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="note"
                value={newAppointment.note}
                onChange={handleInputChange}
                margin="normal"
              />
              <InputLabel>Appointment Date</InputLabel>
              <TextField
                fullWidth
                name="appointmentDate"
                type="datetime-local"
                value={newAppointment.appointmentDate}
                onChange={handleInputChange}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <LoadingButton
                loading={loading}
                disabled={loading}
                onClick={handleAdd}
                color="primary"
              >
                Add
              </LoadingButton>
            </DialogActions>
          </Dialog>
        

        <Dialog
          open={openUpdate}
          onClose={() => setOpenUpdate(false)}
          sx={{ maxWidth: "md" }}
        >
          <DialogTitle>Update Appointment</DialogTitle>
          <DialogContent sx={{ minWidth: "500px" }}>
            <InputLabel>Doctor Email</InputLabel>
            <TextField
              fullWidth
              name="doctorEmail"
              disabled
              value={updateAppointment.doctorEmail}
              onChange={handleUpdateInputChange}
              margin="normal"
            />
            <InputLabel>Patient Email</InputLabel>
            <TextField
              fullWidth
              disabled
              name="patientEmail"
              value={updateAppointment.patientEmail}
              onChange={handleUpdateInputChange}
              margin="normal"
            />
            <InputLabel>Appointment Status</InputLabel>
            <Select
              fullWidth
              name="appointmentStatus"
              value={updateAppointment.appointmentStatus}
              onChange={handleSelectUpdateInputChange}
              margin="dense"
            >
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="cancel">Cancelled</MenuItem>
            </Select>
            <InputLabel>Reason</InputLabel>
            <TextField
              fullWidth
              name="reason"
              value={updateAppointment.reason}
              onChange={handleUpdateInputChange}
              margin="normal"
            />
            <InputLabel>Note</InputLabel>
            <TextField
              fullWidth
              name="note"
              value={updateAppointment.note}
              onChange={handleUpdateInputChange}
              margin="normal"
            />
            <InputLabel>Appointment Date</InputLabel>
            <TextField
              fullWidth
              name="appointmentDate"
              type="datetime-local"
              value={updateAppointment.appointmentDate
                .toISOString()
                .substring(0, 16)}
              onChange={handleUpdateInputChange}
              disabled
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
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

export default AdminAppointmentsTable;
