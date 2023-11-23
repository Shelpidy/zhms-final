"use client"
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
  List,
  ListItemAvatar,
  ListItem,
  Card,
  ListItemText,
  Avatar,
} from "@mui/material";
import { Delete, Edit, Add, Search } from "@mui/icons-material";
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

type RequirerProfile = {
  requirer: Requirer;
  user: User;
};

type BloodTransfusionDetail = {
  donor?: Donor;
  requirer: RequirerProfile;
  transfusion: BloodTransfusion;
  bloodGroup: BloodGroup;
};

interface AdminBloodTransfusionTableProps {
  transfusions: BloodTransfusionDetail[];
  onRefetch: () => void;
}

type RequirerDetails = {
  requirer: Requirer;
  user: User;
  bloodGroup: BloodGroup;
};

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
  width: "80%",
  maxWidth: 400,
  maxHeight: "88vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
};

const AdminTransfionsTable: React.FC<AdminBloodTransfusionTableProps> = ({
  transfusions,
  onRefetch,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [expand, setExpand] = useState(false);
  const [Transfusions, setTransfusions] =
    useState<BloodTransfusionDetail[]>(transfusions);
  const [selectedTransfusion, setSelectedTransfusion] =
    useState<BloodTransfusionDetail | null>(null);
  const [selectedUpdateTransfusion, setSelectedUpdateTransfusion] =
    useState<BloodTransfusionDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryRequirer, setSearchQueryRequirer] = useState("");
  const [searchUpdateQueryRequirer, setSearchUpdateQueryRequirer] =
    useState("");
  const [requirersDetails, setRequirersDetails] = useState<
    RequirerDetails[] | null
  >(null);
  const [updateRequirersDetails, setUpdateRequirersDetails] = useState<
    RequirerDetails[] | null
  >(null);
  const [newTransfusion, setNewTransfusion] = useState<{
    donorEmail: string;
    transfusionDate: Date;
    requirerId: string;
    volume: number;
    groupName: string;
  }>({
    donorEmail: "",
    transfusionDate: new Date(),
    requirerId: "",
    volume: 0,
    groupName: "",
  });

  const [updateTransfusion, setUpdateTransfusion] = useState<{
    donorEmail: string;
    transfusionDate: Date;
    requirerId: string;
    transfusionId: string;
    volume: number;
    groupName: string;
  }>({
    donorEmail: selectedTransfusion?.donor?.email || "",
    transfusionDate:
      selectedTransfusion?.transfusion.transfusionDate || new Date(),
    requirerId: selectedTransfusion?.requirer?.requirer.requirerId || "",
    transfusionId: selectedTransfusion?.transfusion.transfusionId || "",
    volume: selectedTransfusion?.transfusion.volume || 0,
    groupName: selectedTransfusion?.bloodGroup.groupName || "",
  });

  const handleExpand = (transfusion: BloodTransfusionDetail) => {
    console.log(transfusion);
    setSelectedTransfusion(transfusion);
    setExpand(true);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTransfusion(null);
  };

  const handleUpdateClose = () => {
    setOpenUpdate(false);
  };

  const handleRequirerSelect = (selectedRequirer: RequirerDetails) => {
    // Update the searchQueryRequirer with the selected email
    console.log(selectedRequirer);
    setSearchQueryRequirer(selectedRequirer.user.email);

    // Update the requirerId in the newRequirer state with the selected ID
    setNewTransfusion({
      ...newTransfusion,
      requirerId: selectedRequirer.requirer.requirerId,
    });
  };

  const handleUpdateRequirerSelect = (requirer: RequirerDetails) => {
    console.log(requirer);
    setSearchUpdateQueryRequirer(requirer.user.email);
    setUpdateTransfusion({
      ...updateTransfusion,
      donorEmail: updateTransfusion.donorEmail,
      transfusionDate: updateTransfusion.transfusionDate,
      requirerId: requirer.requirer.requirerId,
    });
  };

  const handleEdit = (transfusion: BloodTransfusionDetail) => {
    console.log(transfusion);
    setSelectedUpdateTransfusion(transfusion);

    setUpdateTransfusion({
      ...updateTransfusion,
      donorEmail: transfusion?.donor?.email || "",
      transfusionId: transfusion.transfusion.transfusionId,
    });
    setOpenUpdate(true);
  };

  async function handleDelete(transfusionId: string) {
    console.log(transfusionId);
    try {
      // Logic to delete the appointment
      console.log(transfusionId);
      const request = await fetch(`/api/bloodtransfusions/${transfusionId}`, {
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

  async function handleUpdate() {
    // Logic to update the appointment
    console.log(updateTransfusion);
    let { transfusionId, ...newUpdatedTransfusion } = updateTransfusion;
    try {
      const request = await fetch(`/api/bloodtransfusions/${transfusionId}`, {
        method: "PUT",
        body: JSON.stringify(newUpdatedTransfusion),
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
  useEffect(() => {
    async function getRequirers() {
      try {
        const request = await fetch("/api/requirers", { cache: "no-cache" });
        console.log(request);
        const data = await request.json();
        if (request.status === 200) {
          setUpdateRequirersDetails(data.requirers);
          setRequirersDetails(data.requirers);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getRequirers();
  }, [setRequirersDetails, setUpdateRequirersDetails]);

  async function handleAdd() {
    try {
      setLoading(true)
      console.log("New Transfusion", newTransfusion);
      // Logic to add a new appointment
      const request = await fetch("/api/bloodtransfusions/", {
        method: "POST",
        body: JSON.stringify(newTransfusion),
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
        onRefetch()
      } else {
        Toast.fire({
          icon: "error",
          iconColor: "red",
          text: data?.message,
        });
      }
      // onRefetch();
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
      handleClose();
    }
    // Update the appointments state after adding

  }

  const handleSelectInputChange = (event: SelectChangeEvent<any>) => {
    const { name, value } = event.target;
    setNewTransfusion((prevTransfusion) => ({
      ...prevTransfusion,
      [name]: value,
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewTransfusion((prevTransfusion) => ({
      ...prevTransfusion,
      [name]: value,
    }));
  };
  const handleUpdateInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setUpdateTransfusion((prevTransfusion) => ({
      ...prevTransfusion,
      [name]: value,
    }));
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleRequirerSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    
    setSearchQueryRequirer(event.target.value);
  };

  const handleUpdateRequirerSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchUpdateQueryRequirer(event.target.value);
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
        <Table sx={{ minWidth: "65vw" }}>
          <TableHead>
            <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Requirers</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>R Names</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Donors</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>D Names</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Blood Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Volume(litre)</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date Added</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transfusions.map((transfusion, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Avatar
                    sx={{ width: "25px", height: "25px" }}
                    src={transfusion?.requirer.user.profileImage}
                  />
                 
                </TableCell>
                <TableCell>
                    {transfusion?.requirer.user.firstName}{" "}{transfusion?.requirer.user.middleName}{" "}{transfusion?.requirer.user.lastName}
                </TableCell>
                <TableCell>
                  {
                    transfusion.donor && <Avatar
                    sx={{ width: "25px", height: "25px" }}
                    src={transfusion?.donor?.profileImage}
                  />
                  }

                 {
                    ! transfusion.donor && <>
                    N/A
                    </>
                  }
                 
                </TableCell>
                <TableCell>
                  {
                    transfusion.donor && <>
                    {transfusion?.donor.firstName}{" "}{transfusion?.donor.middleName}{" "}{transfusion?.donor.lastName}

                    </>
                  }
                  {
                    ! transfusion.donor && <>
                    N/A
                    </>
                  }
                </TableCell>
                <TableCell>{transfusion.bloodGroup.groupName}</TableCell>
                <TableCell>{transfusion.transfusion.volume}</TableCell>
                <TableCell>
                  {moment(transfusion.transfusion.createdAt).fromNow()}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleExpand(transfusion)}>
                    <ExpandCircleDownIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(transfusion)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      handleDelete(transfusion.transfusion.transfusionId)
                    }
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

            <Box sx={{ marginTop: 3, textAlign: "center" }}>
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
                      alt={selectedTransfusion?.requirer.user.firstName}
                      src={
                        selectedTransfusion?.requirer.user.profileImage 
                      }
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
                        <strong>Requirer Name:</strong>{" "}
                        {selectedTransfusion?.requirer.user.firstName}{" "}
                        {selectedTransfusion?.requirer.user.lastName}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Blood Group:</strong>{" "}
                        {selectedTransfusion?.bloodGroup.groupName}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Email:</strong>{" "}
                        {selectedTransfusion?.requirer.user.email}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Contact Number:</strong>{" "}
                        {selectedTransfusion?.requirer.user.contactNumber}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Gender:</strong>{" "}
                        {selectedTransfusion?.requirer.user.gender}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Address:</strong>{" "}
                        {selectedTransfusion?.requirer.user.address}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Birth Date:</strong>{" "}
                        {selectedTransfusion?.requirer.user.dateOfBirth?.toString()}
                      </Typography>
                    </div>
                  </Box>
            </Box>

            {selectedTransfusion?.donor && (
              <Box sx={{ marginTop: -1, textAlign: "center" }}>
 
                    <Typography variant="h5">Donor Details</Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 2,
                      }}
                    >
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
                      <Avatar
                        alt={selectedTransfusion?.donor.firstName}
                        src={
                          selectedTransfusion?.donor.profileImage 
                        }
                        sx={{ width: "200px", height: "200px" }}
                      ></Avatar>
                      <div>
                        <Typography variant="h6">
                          <strong>Donor Name:</strong>{" "}
                          {selectedTransfusion?.donor.firstName}{" "}
                          {selectedTransfusion?.donor.lastName}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Blood Group:</strong>{" "}
                          {selectedTransfusion?.bloodGroup.groupName}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Email:</strong>{" "}
                          {selectedTransfusion?.donor.email}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Contact Number:</strong>{" "}
                          {selectedTransfusion?.donor.contactNumber}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Gender:</strong>{" "}
                          {selectedTransfusion?.donor.gender}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Address:</strong>{" "}
                          {selectedTransfusion?.donor.address}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Birth Date:</strong>{" "}
                          {selectedTransfusion?.donor.dateOfBirth?.toString()}
                        </Typography>
                      </div>
                    </Box>
                
              </Box>
            )}
          </Box>
        </Dialog>
        <Box>
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            sx={{ maxWidth: "lg" }}
          >
            <DialogTitle>Add Transfusion</DialogTitle>
            <DialogContent sx={{ minWidth: "400px"}}>
              <Card
                variant="outlined"
                sx={{
                  padding: 2,
                  marginBottom: 2,
                }}
              >
                <div>
                  <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={searchQueryRequirer}
                    onChange={handleRequirerSearchChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <List>
                    {requirersDetails
                      ?.filter((requirersDetail) =>
                        requirersDetail.user.email
                          .toLowerCase()
                          .includes(searchQueryRequirer),
                      )
                      .slice(0, 3)
                      .map((requirersDetail, index) => (
                        <ListItem
                          key={index}
                          button
                          onClick={() => handleRequirerSelect(requirersDetail)}
                          alignItems="flex-start"
                        >
                          <ListItemAvatar>
                            <Avatar
                              alt={requirersDetail.user.firstName}
                              src={requirersDetail.user.profileImage}
                            />
                          </ListItemAvatar>
                         
                          <ListItemText
                            primary={
                              requirersDetail.user.firstName +
                              " " +
                              requirersDetail.user.middleName +
                              " " +
                              requirersDetail.user.lastName
                            }
                            secondary={
                              <React.Fragment>
                                {requirersDetail.bloodGroup.groupName}
                                <Typography
                                  sx={{ display: "inline",marginLeft:3 }}
                                  component="span"
                                  variant="caption"
                                  color="text.primary"
                                >
                                  {requirersDetail.user.email}
                                </Typography>
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                      ))}
                  </List>
                </div>
              </Card>
              <InputLabel>Donor Email</InputLabel>
              <TextField
                fullWidth
                name="donorEmail"
                value={newTransfusion.donorEmail}
                onChange={handleInputChange}
                margin="normal"
              />
              <InputLabel sx={{marginTop:3}}>Blood Group</InputLabel>
              <Select
                fullWidth
                name="groupName"
                value={newTransfusion.groupName}
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
              <InputLabel sx={{marginTop:3}}>Volume of blood in litres</InputLabel>
              <TextField
                fullWidth
                name="volume"
                placeholder="0000 litre"
                value={newTransfusion.volume}
                onChange={handleInputChange}
                margin="normal"
              />

              <InputLabel sx={{marginTop:3}}>Transfusion Date</InputLabel>
              <TextField
                fullWidth
                name="transfusionDate"
                type="datetime-local"
                value={newTransfusion.transfusionDate}
                onChange={handleInputChange}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <LoadingButton loading={loading} disabled={loading} onClick={handleAdd} color="primary">
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
          <DialogTitle>Update Transfusion Date</DialogTitle>
          <DialogContent>
            <Card
              variant="outlined"
              sx={{
                padding: 2,
                marginBottom: 2,
              }}
            >
              <div>
                <InputLabel>Search Requirer</InputLabel>
                <TextField
                  label="Search"
                  variant="outlined"
                  size="small"
                  value={searchUpdateQueryRequirer}
                  onChange={handleUpdateRequirerSearchChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
                <List>
                  {updateRequirersDetails
                    ?.filter((requirer) =>
                      requirer.user.email.includes(
                        searchUpdateQueryRequirer.toLowerCase(),
                      ),
                    )
                    .slice(0, 3)
                    .map((requirer, index) => (
                      <ListItem
                        key={index}
                        button
                        onClick={() => handleUpdateRequirerSelect(requirer)}
                      >
                        <ListItemText primary={requirer.user.email} />
                      </ListItem>
                    ))}
                </List>
              </div>
            </Card>
            <InputLabel>Donor Email</InputLabel>
            <TextField
              fullWidth
              name="donorEmail"
              value={updateTransfusion.donorEmail}
              onChange={handleUpdateInputChange}
              margin="normal"
            />
            <InputLabel>Blood Group</InputLabel>
            <Select
              fullWidth
              name="groupName"
              value={updateTransfusion.groupName}
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
            <InputLabel>Volume of blood in litres</InputLabel>
            <TextField
              fullWidth
              name="volume"
              placeholder="0000 litre"
              value={newTransfusion.volume}
              onChange={handleInputChange}
              margin="normal"
            />
            <InputLabel>Transfusion Date</InputLabel>
            <TextField
              fullWidth
              name="transfusionDate"
              type="datetime-local"
              value={updateTransfusion.transfusionDate}
              onChange={handleUpdateInputChange}
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

export default AdminTransfionsTable;
