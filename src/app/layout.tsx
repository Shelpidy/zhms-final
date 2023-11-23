"use client";
import "./globals.css";
import "primeicons/primeicons.css";
import "primereact/primereact.all";
import "react-chat-elements/dist/main.css";

// import { Inter, Poppins } from "next/font/google";
import { CssBaseline, createTheme, useMediaQuery } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { useEffect, useMemo, useReducer, useState } from "react";
import Footer from "@/components/Footer";
import Provider from "react-redux";
import Store from "@/redux/store";
import Header from "@/components/NavHeader/Header";
import { CookiesProvider } from "react-cookie";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcGELVfcgjFnBn73IiQuwVWBLdlo0rlnM",
  authDomain: "zhms-35f74.firebaseapp.com",
  projectId: "zhms-35f74",
  storageBucket: "zhms-35f74.appspot.com",
  messagingSenderId: "516817485262",
  appId: "1:516817485262:web:2252f0f01415e99b3f7f9f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// const inter = Inter({ subsets: ['latin'] })
// const poppinsLight = Poppins({weight:"300",variable:"--poppinsLight",subsets: ['latin']})
// const poppinsMedium = Poppins({weight:"500",variable:"--poppinsMedium",subsets: ['latin']})

export const metadata = {
  title: "SLMS",
  description: "Digital Learning Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [themeMode, setThemeMode] = useState<"dark" | "light">("light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode || themeMode === "dark" ? "dark" : "light",
          primary: {
            main:
              prefersDarkMode || themeMode === "dark" ? "#f49d37" : "#140f2d",
            light:
              prefersDarkMode || themeMode === "light" ? "#f49d37" : "#140f2d",
          },
          secondary: {
            main:
              prefersDarkMode || themeMode === "dark" ? "#e6bdbd" : "#765657",
          },
        },
        typography: {
          fontFamily: ["PoppinsLight", "PoppinsMedium", "Inter"].join(","),
        },
      }),
    [prefersDarkMode, themeMode],
  );

  return (
    <html lang="en">
      <body
        className={
          themeMode === "dark"
            ? "hide-scrollbar bg-black"
            : "hide-scrollbar bg-white"
        }
      >
        <div>
          <CookiesProvider defaultSetOptions={{ path: "/" }}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Header
                setThemeMode={() =>
                  setThemeMode(themeMode == "light" ? "dark" : "light")
                }
              />
              {children}
              <Footer />
            </ThemeProvider>
          </CookiesProvider>
        </div>
      </body>
    </html>
  );
}
