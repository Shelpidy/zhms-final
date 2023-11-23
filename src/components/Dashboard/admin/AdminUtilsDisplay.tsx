import { Box, Typography } from "@mui/material";
import AddBloodGroup from "./subcomponents/AddBloodGroup";
import AddAdminForm from "./subcomponents/AddAdminForm";
const AdminUtilsDisplay: React.FC = () => {
  return (
    <Box>
      <Box sx={{ marginY: "10px" }}>
        <AddBloodGroup />
      </Box>
      <Box>
        <AddAdminForm />
      </Box>
    </Box>
  );
};

export default AdminUtilsDisplay;
