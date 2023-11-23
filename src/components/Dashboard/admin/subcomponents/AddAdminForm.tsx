import { Add } from "@mui/icons-material";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";
const Toast = Swal.mixin({
  toast: true,
  position: "center",
  timer: 3000,
  timerProgressBar: true,
  showConfirmButton: false,
});

const AddAdminForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const handleClick = async () => {
    try {
      let adminObj = {
        email,
        username,
      };
      let response = await fetch("/api/admins/", {
        method: "POST",
        body: JSON.stringify(adminObj),
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await response.json();
      if (response.status === 201) {
        Toast.fire({
          icon: "success",
          iconColor: "green",
          text: data?.message,
        });
      } else {
        Toast.fire({
          icon: "error",
          iconColor: "red",
          text: "Failed to add blood group",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h6">Add Admin Role</Typography>
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "10px",
          maxWidth: "500px",
          minWidth: "450px",
        }}
      >
        <TextField
          size="small"
          sx={{ width: "auto", marginBottom: 2 }}
          label="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          size="small"
          sx={{ width: "auto" }}
          label="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          onClick={handleClick}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default AddAdminForm;
