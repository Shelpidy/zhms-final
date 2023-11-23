import { Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { motion } from "framer-motion";

const bannerImageVariant = {
  initial: {
    y: 20,
  },
  final: {
    y: 0,
  },
};

const bannerTextContentVariant = {
  initial: {
    opacity: 0,
  },
  final: {
    opacity: 1,
    transition: {
      duration: 1,
      ease: "easeInOut",
      staggerChildren: 1,
    },
  },
};
const bannerTitleVariant = {
  initial: {
    opacity: 0,
  },
  final: {
    opacity: 1,
    transition: {
      duration: 1,
      ease: "easeInOut",
      delay: 0.5,
    },
  },
};

const bannerTextVariant = {
  initial: {
    opacity: 0,
  },
  final: {
    opacity: 1,
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  },
};

function Banner() {
  const mytheme = useTheme();
  const lessThanTab = useMediaQuery(mytheme.breakpoints.down("md"));

  let aboutImgWidth = lessThanTab ? "100vw" : "40vw";
  return (
    <div
      style={{ backgroundColor: mytheme.palette.primary.main, width: "100vw" }}
      className="h-50 pt-10 bg-blue flex flex-col-reverse items-center justify-between md:flex-row md:h-100"
    >
      <motion.div
        variants={bannerTextContentVariant}
        initial="initial"
        animate="final"
        className="bg-transparent mx-5 p-2 md:px-10"
      >
        <motion.h1
          variants={bannerTitleVariant}
          className="text-2xl font-bold font-poppinsMedium md:text-5xl"
          style={{ color: mytheme.palette.primary.light }}
        >
          ZAINAB SEAMLESS HEALTH AND MEDICAL SERVICES
        </motion.h1>
        <motion.p
          variants={bannerTextVariant}
          style={{ color: mytheme.palette.primary.light }}
          className="my-2 text-xl font-poppinsLight"
        >
          Explore your time in health and contribute to making or establishing
          an healthy human environment.
        </motion.p>
      </motion.div>
      <img
        className="m-6 w-30"
        style={{ width: aboutImgWidth }}
        src="/hospital/banner.png"
        alt="Banner Image"
      />
    </div>
  );
}

export default Banner;
