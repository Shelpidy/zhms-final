import { Box, Typography } from "@mui/material";

const TableTitle = ({ title }: { title: string }) => {
  return (
    <Box sx={{ marginLeft: 5, marginBottom: -5 }}>
      <Typography variant="h4">{title}</Typography>
    </Box>
  );
};

export default TableTitle;
