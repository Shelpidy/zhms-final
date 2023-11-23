import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CustomButton from "./CustomButton";
import {
  IconButton,
  useMediaQuery,
  useTheme,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { TextField } from "@mui/material";
import DoctorForm from "./AddDoctorForm"; // Replace with your DoctorForm component
import PatientForm from "./AddPatientsForm"; // Replace with your PatientForm component

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%", // Increase the width of the modal
  maxWidth: 600, // Set a maximum width to ensure responsiveness
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type UserType = "doctor" | "patient";

export default function UserModal() {
  const [open, setOpen] = useState(false);
  const [userType, setUserType] = useState<UserType>("doctor");
  const [selectedUser, setSelectedUser] = useState<null | any>(null); // Initialize with null

  const theme = useTheme();
  const lessThanTab = useMediaQuery(theme.breakpoints.down("md"));
  const aboutImgWidth = lessThanTab ? "33vw" : "22vw";

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUserTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserType(event.target.value as UserType);
    setSelectedUser(null); // Reset selected user when user type changes
  };

  const handleUserSelection = (user: any) => {
    setSelectedUser(user);
    handleOpen();
  };

  // Sample user data for demonstration
  const dummyUser = {
    firstName: "John",
    lastName: "Doe",
    profileImage:
      "https://www.bing.com/th?id=OIP.0apGbushC7Ydb4uRp555XwHaIO&pid=3.1&cb=&w=300&h=300&p=0", // Replace with your image URL
    email: "john.doe@example.com",
    contactNumber: "123-456-7890",
    gender: "Male",
    address: "123 Main St, City, Country",
    role: "Doctor",
  };

  return (
    <div>
      {/* Button to open modal */}
      <CustomButton onClick={() => handleUserSelection(dummyUser)}>
        Open User Modal
      </CustomButton>

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box>
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                User Details
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <img
                  alt="Profile"
                  style={{
                    width: "28%", // Adjust the width as needed
                    height: "auto", // Auto height to maintain aspect ratio
                    maxWidth: "75%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  src={dummyUser.profileImage} // Use user's profile image
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 6,
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    {dummyUser.firstName} {dummyUser.lastName}
                  </Typography>
                  <Typography variant="body1">{dummyUser.email}</Typography>
                  <Typography variant="body1">
                    Contact: {dummyUser.contactNumber}
                  </Typography>
                  <Typography variant="body1">
                    Gender: {dummyUser.gender}
                  </Typography>
                  <Typography variant="body1">
                    Address: {dummyUser.address}
                  </Typography>
                </Box>
              </Box>
            </>
          </Box>

          {/* Display Doctor or Patient Form based on the selected user type */}
          <Box>
            {userType === "doctor" && (
              <DoctorForm /> // Replace with your DoctorForm component
            )}

            {userType === "patient" && (
              <PatientForm /> // Replace with your PatientForm component
            )}
          </Box>

          {/* Toggle between Doctor and Patient */}
          <Box mt={2}>
            <RadioGroup
              row
              aria-label="user-type"
              name="userType"
              value={userType}
              onChange={handleUserTypeChange}
            >
              <FormControlLabel
                value="doctor"
                control={<Radio />}
                label="Doctor"
              />
              <FormControlLabel
                value="patient"
                control={<Radio />}
                label="Patient"
              />
            </RadioGroup>
          </Box>

          {/* Button to close modal */}
          <Box mt={2} textAlign="center">
            <CustomButton onClick={handleClose}>Close</CustomButton>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
