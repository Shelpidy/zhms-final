"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Box,
  TableRow,
  Paper,
  Avatar,
  Checkbox,
  IconButton,
  TextField,
  TablePagination,
} from "@mui/material";
import { Search as SearchIcon, Add } from "@mui/icons-material";
import CustomButton from "./CustomButton";

interface Blogger {
  bloggerId: string;
  displayName: string;
  position: string;
  dateAdded: string;
  profile: string;
  status: string;
}

interface Props {
  initialData: Blogger[];
}

const BloggersTableComponents: React.FC<Props> = ({ initialData }) => {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
    // Simulate fetching data from the backend based on the new page
    // Replace this with your actual fetch logic using query params
    // For example: fetchTableData(newPage, rowsPerPage);
  };

  // Simulate fetching data from the backend using query params
  // Replace this with your actual fetch logic using query params
  // const fetchTableData = async (pageNumber: number, recordsPerPage: number) => {
  //   const response = await fetch(`/api/data?pageNumber=${pageNumber}&recordsPerPage=${recordsPerPage}`);
  //   const newData = await response.json();
  //   setData(newData);
  // };

  //   const filteredData = data.filter(
  //     (item) =>
  //       item.displayName.toLowerCase().includes(searchText.toLowerCase()) ||
  //       item.position.toLowerCase().includes(searchText.toLowerCase())
  //   );

  return (
    <Paper>
      <Box className="flex flex-row justify-between mx-2 my-2">
        <CustomButton size="small">
          <Add></Add> New
        </CustomButton>
        <TextField
          sx={{ justifySelf: "flex-end", marginBottom: "6px" }}
          size="small"
          label="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell size="small">Name</TableCell>
              <TableCell size="small">Position</TableCell>
              <TableCell size="small">Date Added</TableCell>
              <TableCell size="small">Profile</TableCell>
              <TableCell size="small">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(3).map((row) => (
              <TableRow key={row.bloggerId}>
                <TableCell size="small">
                  <Checkbox size="small" />
                </TableCell>
                <TableCell size="small">{row.displayName}</TableCell>
                <TableCell size="small">{row.position}</TableCell>
                <TableCell size="small">{row.dateAdded}</TableCell>
                <TableCell size="small">
                  <Avatar
                    sx={{ width: 25, height: 25 }}
                    alt={row.displayName}
                    src={row.profile}
                  />
                </TableCell>
                <TableCell size="small">{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        // rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={20}
        rowsPerPage={5}
        page={page}
        onPageChange={handleChangePage}
      />
    </Paper>
  );
};

export default BloggersTableComponents;
