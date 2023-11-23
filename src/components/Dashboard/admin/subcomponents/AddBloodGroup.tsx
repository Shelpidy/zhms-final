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

const AddBloodGroup = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [volume, setVolume] = useState(0);
  const handleClick = async () => {
    try {
      let bloodGroupObj = {
        groupName: bloodGroup,
        volume,
      };
      let response = await fetch("/api/bloodgroup/", {
        method: "POST",
        body: JSON.stringify(bloodGroupObj),
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
      <Typography variant="h6">Add Blood Group</Typography>
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
          label="Blood Group"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
        />
        <TextField
          size="small"
          sx={{ width: "auto" }}
          label="Volume in litre"
          onChange={(e) => setVolume(Number(e.target.value))}
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

export default AddBloodGroup;
