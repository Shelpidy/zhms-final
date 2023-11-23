"use client";
import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Avatar,
  useMediaQuery,
  useTheme,
  Box,
  Button,
  IconButton,
  Badge,
} from "@mui/material";
import NavMenuBar from "./NavMenuBar";
import Image from "next/image";
import Link from "next/link";
import "../../app/globals.css";
import { useCurrentUser } from "@/hooks/customHooks";
import {
  DarkModeSharp,
  LightModeSharp,
  NotificationsActiveOutlined,
  NotificationsNoneOutlined,
  Search,
  ShoppingCartCheckoutOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import CustomButton from "../CustomButton";
import { useCookies } from "react-cookie";
import ZHLogo from "../Logo/Logo";
import ZHFilledSmallLogo from "../Logo/FillLogoSmall";

type HeaderProps = {
  setThemeMode: () => void;
};

function Header({ setThemeMode }: HeaderProps) {
  const [activeTab, setActiveTab] = React.useState<number>(0);
  const theme = useTheme();
  const router = useRouter();
  const phoneView = useMediaQuery(theme.breakpoints.down("md"));
  const tabView = useMediaQuery(theme.breakpoints.down("lg"));
  const _currentUser = useCurrentUser();
  const [currentUser, setCurrentUser] = React.useState<CurrentUser | null>(
    _currentUser,
  );
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  useEffect(() => {
    setCurrentUser(_currentUser);
  }, [_currentUser]);

  const handleSignOut = () => {
    removeCookie("token");
    console.log("Logged Out");
    setCurrentUser(null);
    router.push("/");
  };

  return (
    <AppBar
      elevation={0}
      position="fixed"
      sx={{ background: theme.palette.primary.main }}
    >
      <Toolbar className="flex flex-row justify-between px-5 bg-transparent">
        <ZHLogo fill={theme.palette.primary.light} width={56} height={41} />
        {!tabView && (
          <>
            <ul className="flex flex-row items-center justify-evenly gap-10">
              <li
                className="hover:border-b transition duration-300 ease-in-out"
                style={{
                  color: theme.palette.primary.light,
                  borderColor: theme.palette.primary.light,
                  fontWeight: "bold",
                }}
              >
                <Link
                  href="/"
                  style={{
                    color: theme.palette.primary.light,
                    fontWeight: "bold",
                  }}
                >
                  Home
                </Link>
              </li>
              <li
                className="hover:border-b transition duration-300 ease-in-out"
                style={{
                  color: theme.palette.primary.light,
                  borderColor: theme.palette.primary.light,
                  fontWeight: "bold",
                }}
              >
                <Link
                  href="/doctors"
                  style={{
                    color: theme.palette.primary.light,
                    fontWeight: "bold",
                  }}
                >
                  Doctors
                </Link>
              </li>
              <li
                className="hover:border-b transition duration-300 ease-in-out"
                style={{
                  color: theme.palette.primary.light,
                  borderColor: theme.palette.primary.light,
                  fontWeight: "bold",
                }}
              >
                <Link
                  href="/donors"
                  style={{
                    color: theme.palette.primary.light,
                    fontWeight: "bold",
                  }}
                >
                  Donors
                </Link>
              </li>
              <li
                className="hover:border-b transition duration-300 ease-in-out"
                style={{
                  color: theme.palette.primary.light,
                  borderColor: theme.palette.primary.light,
                  fontWeight: "bold",
                }}
              >
                <Link
                  href="/signup"
                  style={{
                    color: theme.palette.primary.light,
                    fontWeight: "bold",
                  }}
                >
                  SignUp
                </Link>
              </li>
              {currentUser && (
                <li
                  className="hover:border-b transition duration-300 ease-in-out"
                  style={{
                    color: theme.palette.primary.light,
                    borderColor: theme.palette.primary.light,
                    fontWeight: "bold",
                  }}
                >
                  <CustomButton onClick={handleSignOut}>SignOut</CustomButton>
                </li>
              )}
              {!currentUser && (
                <li
                  className="hover:border-b transition duration-300 ease-in-out"
                  style={{
                    color: theme.palette.primary.light,
                    borderColor: theme.palette.primary.light,
                    fontWeight: "bold",
                  }}
                >
                  <Link
                    href="/signin"
                    style={{
                      color: theme.palette.primary.light,
                      fontWeight: "bold",
                    }}
                  >
                    SignIn
                  </Link>
                </li>
              )}
            </ul>
            <Box className="flex flex-row gap-3 items-center">
              <IconButton
                onClick={setThemeMode}
                sx={{ color: theme.palette.primary.light }}
              >
                {theme.palette.mode === "light" ? (
                  <DarkModeSharp />
                ) : (
                  <LightModeSharp />
                )}
              </IconButton>
              {currentUser &&
                currentUser.role &&
                currentUser?.role !== "user" && (
                  <Link href={`/dashboard/${currentUser.role}/`}>
                    <Avatar
                      src={currentUser.profilePicture}
                      sx={{ width: 25, height: 25 }}
                    />
                  </Link>
                )}

              {currentUser && !currentUser.role && (
                <Link
                  href={`/dashboard/${currentUser.role}/${currentUser.userId}`}
                >
                  <Avatar
                    src={currentUser.profilePicture}
                    sx={{ width: 25, height: 25 }}
                  />
                </Link>
              )}
            </Box>
          </>
        )}
        {tabView && <NavMenuBar setThemeMode={setThemeMode} />}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
