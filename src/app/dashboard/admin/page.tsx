"use client";
import {
  Add,
  GroupAdd,
  Groups,
  MenuOutlined,
  PostAdd,
  MoreHorizOutlined,
  ShoppingBagOutlined,
  VerifiedUserOutlined,
} from "@mui/icons-material";
import { IconButton, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ListAltIcon from "@mui/icons-material/ListAlt";
import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import AdminProfileDisplay from "@/components/Dashboard/admin/AdminProfileDisplay";
import AdminUsersDisplay from "@/components/Dashboard/admin/AdminUsersDisplay";
import AdminPatientDisplay from "@/components/Dashboard/admin/AdminPatientsDisplay";
import AdminDoctorsDisplay from "@/components/Dashboard/admin/AdminDoctorsDisplay";
import AdminBloodTransfusionsDisplay from "@/components/Dashboard/admin/AdminTransfusionsDisplay";
import AdminAppointmentsDisplay from "@/components/Dashboard/admin/AdminAppointmentsDisplay";
import AdminDonorsDisplay from "@/components/Dashboard/admin/AdminDonorsDisplay";
import AdminRequirerDisplay from "@/components/Dashboard/admin/AdminRequirersDisplay";
import AdminUtilsDisplay from "@/components/Dashboard/admin/AdminUtilsDisplay";

export default function AdminDashboard() {
  const theme = useTheme();
  const [sideBarCollapsed, setSideBarCollapse] = useState<boolean>(true);
  const [activePage, setActivePage] = useState<string>("profile");

  return (
    <main className="min-h-screen grid grid-cols-dashboard">
      <div
        className="py-[10vh] relative"
        style={{ backgroundColor: theme.palette.primary.main, height: "100vh" }}
      >
        <Sidebar collapsed={sideBarCollapsed} className="w-40 sticky top-0">
          <Menu
            style={{
              backgroundColor: theme.palette.primary.main,
              height: "95vh",
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
              color={theme.palette.primary.light}
              icon={<Groups />}
              onClick={() => setActivePage("profile")}
            >
              Profile
            </MenuItem>
            <MenuItem
              color={theme.palette.primary.light}
              icon={<Groups />}
              onClick={() => setActivePage("users")}
            >
              Users
            </MenuItem>
            <MenuItem
              color={theme.palette.primary.light}
              icon={<GroupAdd />}
              onClick={() => setActivePage("doctors")}
            >
              Doctors
            </MenuItem>
            <MenuItem
              color={theme.palette.primary.light}
              icon={<GroupAdd />}
              onClick={() => setActivePage("patients")}
            >
              Patients
            </MenuItem>
            <MenuItem
              icon={<GroupAdd />}
              onClick={() => setActivePage("donors")}
            >
              Donors
            </MenuItem>
            <MenuItem
              color={theme.palette.primary.light}
              icon={<GroupAdd />}
              onClick={() => setActivePage("requirers")}
            >
              Requirers
            </MenuItem>
            <MenuItem
              color={theme.palette.primary.light}
              icon={<GroupAdd />}
              onClick={() => setActivePage("transfusions")}
            >
              Transfusions
            </MenuItem>
            <MenuItem
              color={theme.palette.primary.light}
              icon={<GroupAdd />}
              onClick={() => setActivePage("appointments")}
            >
              Appointments
            </MenuItem>
            
            <MenuItem
              style={{ marginTop: -5 }}
              color={theme.palette.primary.light}
              icon={<MoreHorizOutlined />}
              onClick={() => setActivePage("utils")}
            >
              Utils
            </MenuItem>
          </Menu>
        </Sidebar>
      </div>
      <div className="m-5 py-[10vh] h-screen overflow-y-scroll hide-scrollbar">
        {activePage === "profile" && <AdminProfileDisplay />}
        {activePage === "users" && <AdminUsersDisplay />}
        {activePage === "patients" && <AdminPatientDisplay />}
        {activePage === "doctors" && <AdminDoctorsDisplay />}
        {activePage === "transfusions" && <AdminBloodTransfusionsDisplay />}
        {activePage === "appointments" && <AdminAppointmentsDisplay />}
        {activePage === "donors" && <AdminDonorsDisplay />}
        {activePage === "requirers" && <AdminRequirerDisplay />}
        {activePage === "utils" && <AdminUtilsDisplay />}
      </div>
    </main>
  );
}
