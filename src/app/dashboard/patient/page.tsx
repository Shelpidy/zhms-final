"use client";
import {
  Add,
  GroupAdd,
  Groups,
  MenuOutlined,
  PostAdd,
  ShoppingBagOutlined,
  VerifiedUserOutlined,
} from "@mui/icons-material";
import { IconButton, Typography, useTheme, Box } from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import PatientProfileDisplay from "@/components/Dashboard/patient/PatientProfileDisplay";
import BloodRequirementDisplay from "@/components/Dashboard/patient/BloodRequirementForm";
import PatientAppointmentDisplay from "@/components/Dashboard/patient/PatientAppointmentDisplay";

// export const metadata = {
//   title: "SLMS | Dashboard",
//   description: "Digital Learning Platform",
// };
// 1qxww8reyb0myngsbuvdfv2sg7ndijyzzrrbt8wb6fxan9k2
export default function PatientDashboard() {
  const theme = useTheme();
  const [sideBarCollapsed, setSideBarCollapse] = useState<boolean>(true);
  const [activePage, setActivePage] = useState<string>("profile");

  return (
    <main className="min-h-screen grid grid-cols-dashboard">
      <div
        className="py-[10vh] relative"
        style={{ backgroundColor: "#f6f6f6", height: "100vh" }}
      >
        <Sidebar
          collapsed={sideBarCollapsed}
          className="h-screen w-40 sticky top-0"
        >
          <Menu
            style={{
              backgroundColor: theme.palette.primary.main,
              height: "90vh",
              zIndex: 0,
            }}
            menuItemStyles={{
              button: ({ level, active, disabled }) => {
                // only apply styles on first level elements of the tree

                return {
                  color: disabled ? "#f6f6f6" : theme.palette.primary.light,
                  backgroundColor: active ? "red" : theme.palette.primary.main,
                  borderRadius: "5px",
                  margin: "5px",
                };
              },
            }}
          >
            <IconButton
              sx={{ marginLeft: "20px" }}
              onClick={() => setSideBarCollapse(!sideBarCollapsed)}
            >
              <MenuOutlined sx={{ color: theme.palette.primary.light }} />
            </IconButton>
            <MenuItem
              icon={<Groups />}
              onClick={() => setActivePage("profile")}
            >
              Profile
            </MenuItem>
            <MenuItem
              icon={<GroupAdd />}
              onClick={() => setActivePage("appointments")}
            >
              Appointments
            </MenuItem>
            <MenuItem icon={<Add />} onClick={() => setActivePage("requirers")}>
              Requirers
            </MenuItem>
          </Menu>
        </Sidebar>
      </div>
      <div className="m-10 h-screen overflow-y-scroll hide-scrollbar">
        {activePage === "profile" && <PatientProfileDisplay />}
        {activePage === "appointments" && <PatientAppointmentDisplay />}
        {activePage === "requirers" && <BloodRequirementDisplay />}
      </div>
    </main>
  );
}
