"use client";
import { Add, GroupAdd, Groups, MenuOutlined } from "@mui/icons-material";
import { IconButton, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ListAltIcon from "@mui/icons-material/ListAlt";
import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

import DoctorProfileDisplay from "@/components/Dashboard/doctor/DoctorProfileDisplay";
import DoctorAppointmentDisplay from "@/components/Dashboard/doctor/DoctorAppointmentDisplay";

export default function DoctorDashboard() {
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
              onClick={() => setActivePage("appointment")}
            >
              Appointment
            </MenuItem>
          </Menu>
        </Sidebar>
        ;
      </div>
      <div className="m-5 py-[10vh] h-screen overflow-y-scroll hide-scrollbar">
        {activePage === "profile" && <DoctorProfileDisplay />}
        {activePage === "appointment" && <DoctorAppointmentDisplay />}
      </div>
    </main>
  );
}
