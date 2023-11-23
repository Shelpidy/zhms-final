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
  Modal,
  Typography,
  SelectChangeEvent,
  MenuItem,
  Select,
  Avatar,
} from "@mui/material";
import { Delete, Edit, Add, Search } from "@mui/icons-material";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import moment from "moment";
import { LoadingButton } from "@mui/lab";

type RequirerDetails = {
  requirer: Requirer;
  user: User;
  bloodGroup: BloodGroup;
};

interface AdminRequirerTableProps {
  requirers: RequirerDetails[];
  onRefetch: () => void;
}


const style = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 400,
  maxHeight: "88vh",
  bgcolor: "background.paper",
  p: 4,
  overflow: "auto",
};

const AdminRequirersTable: React.FC<AdminRequirerTableProps> = ({
  requirers,
  onRefetch,
}) => {
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [expand, setExpand] = useState(false);
  const [loading,setLoading] = useState(false)
  const [selectedRequirer, setSelectedRequirer] =
    useState<RequirerDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [newRequirer, setNewRequirer] = useState<{
    email: string;
    bloodGroup: string;
  }>({
    email: "",
    bloodGroup: "",
  });

  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
  const handleExpand = (requirers: RequirerDetails) => {
    console.log(requirers);
    setSelectedRequirer(requirers);
    setExpand(true);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRequirer(null);
  };

  const handleUpdateClose = () => {
    setOpenUpdate(false);
  };

  const handleEdit = (requirer: RequirerDetails) => {
    console.log(requirer);
    setSelectedRequirer(requirer);
    // setUpdateR({

    // })
    // setOpenUpdate(true);
  };

  async function handleDelete(requirerId: string) {
    console.log(requirerId);
    try {
      // Logic to delete the appointment
      console.log(requirerId);
      const request = await fetch(`/api/requirers?requirerId=${requirerId}`, {
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
      onRefetch();
      // Update the appointments state after deletion
    } catch (error) {
      console.log(error);
    }
  }

  async function handleAdd() {
    try {
      console.log("New Requirer", newRequirer);
      setLoading(true)
      // Logic to add a new appointment
      const request = await fetch("/api/requirers", {
        method: "POST",
        body: JSON.stringify(newRequirer),
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
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
    // Update the appointments state after adding
    handleClose();
    newRequirer.email = "";
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewRequirer((prevRequirer) => ({
      ...prevRequirer,
      [name]: value,
    }));
  };

  const handleSelectInputChange = (event: SelectChangeEvent<any>) => {
    const { name, value } = event.target;
    setNewRequirer((prevRequirer) => ({
      ...prevRequirer,
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
               <TableCell sx={{ fontWeight: "bold" }}>Requirer</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date Added</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requirers
              .filter((requirer) => requirer.user.email.includes(searchQuery))
              .map((requirer, index) => (
                <TableRow key={index}>
                 <TableCell>
                    <Avatar
                      sx={{ width: "25px", height: "25px" }}
                      alt={requirer.user.firstName}
                      src={requirer.user.profileImage}
                    />
                  </TableCell>
                  <TableCell>
                    {requirer.user.firstName}{" "}
                      
                      {requirer.user.middleName}{" "}
                      
                      {requirer.user.lastName}
                  </TableCell>
                  <TableCell>{requirer.user.address}</TableCell>
  
                  <TableCell>{moment(requirer.requirer.createdAt).fromNow()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleExpand(requirer)}>
                      <ExpandCircleDownIcon />
                    </IconButton>
                    {/* <IconButton onClick={() => handleEdit(requirer)}>
                         <Edit />
                       </IconButton> */}
                    <IconButton
                      onClick={() => handleDelete(requirer.requirer.requirerId)}
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
            <Box sx={{ marginTop: -1, textAlign: "center" }}>
              <Typography variant="h5">Requirer Details</Typography>
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
                  alt={selectedRequirer?.user.firstName}
                  src={selectedRequirer?.user.profileImage}
                  sx={{ width: "200px", height: "200px" }}
                ></Avatar>
                <div>
                  <Typography variant="h6">
                    <strong>Requirer Name:</strong>{" "}
                    {selectedRequirer?.user.firstName}{" "}
                      {selectedRequirer?.user.middleName}{" "}
                    {selectedRequirer?.user.lastName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {selectedRequirer?.user?.email}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Blood Group:</strong>{" "}
                    {selectedRequirer?.bloodGroup.groupName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Contact Number:</strong>{" "}
                    {selectedRequirer?.user?.contactNumber}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Gender:</strong> {selectedRequirer?.user?.gender}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Address:</strong> {selectedRequirer?.user?.address}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Birth Date:</strong>{" "}
                    {selectedRequirer?.user?.dateOfBirth?.toString()}
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
            sx={{ maxWidth: "lg" }}
          >
            <DialogTitle>Add Requirer</DialogTitle>
            <DialogContent sx={{ minWidth: "500px" }}>
              <InputLabel>Email</InputLabel>
              <TextField
                fullWidth
                name="email"
                value={newRequirer.email}
                onChange={handleInputChange}
                margin="normal"
              />
              <InputLabel>Blood Group</InputLabel>
              <Select
                fullWidth
                name="bloodGroup"
                value={newRequirer.bloodGroup}
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
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <LoadingButton loading={loading} disabled={loading} onClick={handleAdd} color="primary">
                Add
              </LoadingButton>
            </DialogActions>
          </Dialog>
        </Box>
      </TableContainer>
    </Box>
  );
};

export default AdminRequirersTable;
