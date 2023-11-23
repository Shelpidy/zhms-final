"use client"
import React, { useEffect, useState } from "react";
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
  Typography,
  Avatar,
} from "@mui/material";
import { Delete, Edit, Add, Search, Refresh } from "@mui/icons-material";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import moment from "moment";
import { LoadingButton } from "@mui/lab";

const Toast = Swal.mixin({
  toast: true,
  position: "center",
  timer: 3000,
  timerProgressBar: true,
  showConfirmButton: false,
});

interface AdminUserTableProps {
  users: User[];
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

const AdminUsersTable: React.FC<AdminUserTableProps> = ({ users:_users }) => {
  const [expand, setExpand] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [users,setUsers] = useState<User[]>(_users)
  const [loading,setLoading] = useState<boolean>(false)
  

  const handleExpand = (users: User) => {
    console.log(users);
    setSelectedUser(users);
    setExpand(true);
  };

  useEffect(()=>{
    setUsers(_users)
  },[_users])

  const handleRefetch = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/users");
      const data = await response.json();
      if(response.status === 200){
        console.log(data);
        setUsers(data.users);
      }else{
        Toast.fire({
          text:"Refresh failed. Try again",
          icon:"warning"
        })
      }
      
    } catch (error) {
      console.error("Error trying to refresh:", error);
      Toast.fire({
        text:"Refresh failed. Try again",
        icon:"warning"
      })
    } finally {
      setLoading(false);
    }
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
       <LoadingButton onClick={handleRefetch} loading={loading} disabled={loading}><Refresh></Refresh></LoadingButton>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date Added</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .filter(
                (user) =>
                  user?.email.includes(searchQuery) ||
                  user?.address?.includes(searchQuery),
              )
              .map((user, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Avatar
                      sx={{ width: "25px", height: "25px" }}
                      alt={user.firstName}
                      src={user.profileImage}
                    />
                  </TableCell>
                  <TableCell>
                    {user.firstName}{" "}
                      
                      {user.middleName}{" "}
                      
                      {user.lastName}
                  </TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{moment(user.createdAt).fromNow()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleExpand(user)}>
                      <ExpandCircleDownIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Dialog
          open={expand}
          onClose={() => setExpand(false)}
          sx={{ maxWidth: "lg", minWidth: "400px", padding: "5px" }}
        >
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
              <Typography variant="h5">User Details</Typography>
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
                  alt={selectedUser?.firstName}
                  src={selectedUser?.profileImage}
                  sx={{ width: "200px", height: "200px" }}
                ></Avatar>
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
                    <strong>Name:</strong> {selectedUser?.firstName}{" "}
                    {selectedUser?.lastName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {selectedUser?.email}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Contact Number:</strong>{" "}
                    {selectedUser?.contactNumber}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Gender:</strong> {selectedUser?.gender}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Address:</strong> {selectedUser?.address}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Birth Date:</strong>{" "}
                    {selectedUser?.dateOfBirth?.toString()}
                  </Typography>
                </div>
              </Box>
            </Box>
          </Box>
        </Dialog>
      </TableContainer>
    </Box>
  );
};

export default AdminUsersTable;
