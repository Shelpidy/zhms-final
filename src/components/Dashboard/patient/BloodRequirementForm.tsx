import { useCurrentUser } from "@/hooks/customHooks";
import { Add } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";
const Toast = Swal.mixin({
  toast: true,
  position: "center",
  timer: 3000,
  timerProgressBar: true,
  showConfirmButton: false,
});

const BloodRequirementDisplay = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const currentUser = useCurrentUser()
  const theme = useTheme()

  const handleSelectInputChange = (event: SelectChangeEvent<any>) => {
    const { name, value } = event.target;
    setBloodGroup(value);
  };

  const handleClick = async () => {
    try {
      setLoading(true)
      let transfusionRequestObj = {
        bloodGroup,
        email
      };
      let response = await fetch("/api/requirers/", {
        method: "POST",
        body: JSON.stringify(transfusionRequestObj),
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
          text: "Failed to make request",
        });
      }
    } catch (err) {
      console.log(err);
    }finally{
      setLoading(false)
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop:"12vh"
      }}
    >
   
      <Typography variant="h6">Blood Transfusion Request</Typography>
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
      >   <TextField
            sx={{marginBottom:2}}
          onChange={(e)=> setEmail(e.target.value)}
            label="Email" />
          <InputLabel>Blood Group</InputLabel>
              <Select
                fullWidth
                name="bloodGroup"
            
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
        {/* <TextField
          size="small"
          sx={{ width: "auto", marginBottom: 2 }}
          label="Blood Group"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
        /> */}
        <LoadingButton
         loading={loading}
         disabled={loading}
          variant="contained"
          onClick={handleClick}
          sx={{background:theme.palette.primary.main}}
        >
          Make request
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default BloodRequirementDisplay;
