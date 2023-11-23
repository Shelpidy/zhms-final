"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

const iconVariant = {
  open: {
    rotate: 180,
  },
  closed: {
    rotate: 0,
  },
};

const optionVariant = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const wrapperVariant: Variants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

type OptionProps = {
  children: JSX.Element;
  label: String;
};

function Option({ children, label }: OptionProps) {
  return (
    <motion.li
      variants={optionVariant}
      className="w-max flex items-center flex-row justify-items-start font-medium text-sm gap-2 p-1 cursor-pointer transition-colors hover:bg-indigo-100 hover:text-indigo-500 hover:rounded-md hover:p-1 hover:w-full"
    >
      <motion.span variants={optionVariant}>{children}</motion.span>
      <span>{label}</span>
    </motion.li>
  );
}

function CustomDropDown() {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  return (
    <div className="p-5 flex items-center justify-center w-auto">
      <motion.div
        className="relative w-full flex items-center justify-center"
        initial="closed"
        animate={openMenu ? "open" : "closed"}
      >
        <button
          className="bg-blue-600 w-full px-3 py-2 mb-4 rounded-md text-white"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <span className="mr-2">Toggle </span>{" "}
          <motion.span variants={iconVariant}>
            <span
              className={
                openMenu
                  ? "pi pi-chevron-up transition-all"
                  : "pi pi-chevron-down transition-all"
              }
            ></span>
          </motion.span>
        </button>
        <motion.ul
          style={{ originY: "top" }}
          className="p-3 absolute gap-3 rounded-md shadow-md bg-white top-11"
          variants={wrapperVariant}
        >
          <Option label="Profile">
            <i className="pi pi-user"></i>
          </Option>
          <Option label="Edit">
            <i className="pi pi-cog"></i>
          </Option>
          <Option label="Search">
            <i className="pi pi-search"></i>
          </Option>
          <Option label="Twitter">
            <i className="pi pi-twitter"></i>
          </Option>
          <Option label="Facebook">
            <i className="pi pi-facebook"></i>
          </Option>
          <Option label="Instagram">
            <i className="pi pi-instagram"></i>
          </Option>
        </motion.ul>
      </motion.div>
    </div>
  );
}

export default CustomDropDown;
