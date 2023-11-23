import * as React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { UUIDV4 } from "sequelize";

const id = Math.random().toString();

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "lastName", headerName: "Last name", width: 130 },
  { field: "profileImage", headerName: "Profile Image", width: 130 },
  { field: "contactNumber", headerName: "Contact Number", width: 130 },
  { field: "gender", headerName: "Gender", width: 130 },
  { field: "address", headerName: "Address", width: 200 },
  { field: "email", headerName: "Email", width: 160 },
  { field: "role", headerName: "Role", width: 130 },
];

const userToRow = (user: any) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  profileImage: user.profileImage,
  contactNumber: user.contactNumber,
  gender: user.gender || "male",
  address: user.address,
  email: user.email,
  role: user.role || "patient",
});

const userToRowVal = (users: any) => {
  const { createdAt, updatedAt, ...rowData } = users;
  return rowData;
};

export default function UserDataTable({ users }: any) {
  const rows = users?.map(userToRowVal);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={Math.random}
        autoPageSize
        checkboxSelection
      />
    </div>
  );
}
