import { Box, Typography, TextField } from "@mui/material";
import CustomButton from "./CustomButton";
import React, { useState } from "react";

// This is a SearchComponent, when implementing i need to pass in props
// to the Component, like the table data but later, i will talk on this more.
const SearchComponent = () => {
  const [search, setSearch] = useState("");

  const handleOnChange = (inputValue: string = "") => {
    console.log(inputValue);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "right",
      }}
    >
      <Box sx={{ marginRight: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleOnChange(e.target.value);
          }}
        />
      </Box>
      <Box>
        <CustomButton onClick={() => handleOnChange()} variant="contained">
          Search
        </CustomButton>
      </Box>
    </Box>
  );
};

export default SearchComponent;
