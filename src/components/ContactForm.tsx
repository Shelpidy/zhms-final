"use client";
import React, { useEffect, useReducer } from "react";
import {
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  Modal,
  Box,
} from "@mui/material";
import {
  MailOutline,
  SmartphoneOutlined,
  PlaceOutlined,
  Close,
  Send,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import CustomButton from "./CustomButton";

const Toast = Swal.mixin({
  timer: 5000,
  position: "top-right",
  timerProgressBar: true,
  toast: true,
});

const initialState = {
  fullname: "",
  email: "",
  subject: "",
  message: "",
} satisfies ContactFormObject;

const reducer = (state: ContactFormObject = initialState, action: Action) => {
  switch (action.type) {
    case "FULLNAME":
      return { ...state, fullname: action.payload };
    case "EMAIL":
      return { ...state, email: action.payload };
    case "SUBJECT":
      return { ...state, subject: action.payload };
    case "MESSAGE":
      return { ...state, message: action.payload };
    default:
      return state;
  }
};

type Email = {
  content: string;
  email: string;
  subject: string;
  title: string;
};

type ContactFormProps = {
  email?: string;
  phoneNumbers?: string[];
  address?: string;
};

function ContactForm({ email, phoneNumbers, address }: ContactFormProps) {
  const [formObjectState, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [_loading, _setLoading] = React.useState<boolean>(false);

  /// Make a contact Request
  const handleContactForm = () => {
    console.log("Submitting form Object", formObjectState);
  };

  return (
    <Box className="flex my-4 flex-col p-2 justify-center gap-10 shadow-md pb-10 md:flex-row md:gap-20">
      <Box className="pt-1 px-2 md:pt-4">
        <Stack direction="column">
          <Box className="flex flex-row items-center justify-start gap-3 my-2">
            <PlaceOutlined fontSize="large"></PlaceOutlined>
            <Box>
              <Typography className="font-semibold font-inter">
                Location
              </Typography>
              <Typography className="text-md text-gray-500">
                44 Circular Road
              </Typography>
            </Box>
          </Box>
          <Box className="flex flex-row items-center justify-start gap-3 my-2">
            <MailOutline fontSize="large"></MailOutline>
            <Box>
              <Typography>Email</Typography>
              <Link href="mailto:info@schoolall.io">
                <Typography className="text-md text-gray-500">
                  zeehealth@gmail.com
                </Typography>
              </Link>
            </Box>
          </Box>
          <Box className="flex flex-row items-center justify-start gap-3 my-2">
            <SmartphoneOutlined fontSize="large"></SmartphoneOutlined>
            <Box>
              <Typography>Call</Typography>
              <Link href="tel:+23288722317">
                <Typography className="text-md text-gray-500">
                  +23288722317
                </Typography>
              </Link>
            </Box>
          </Box>
        </Stack>
      </Box>
      <Box className="pt-1 px-2 md:pt-4 md:px-2">
        <Box className="flex flex-col justify-center items-start gap-5">
          <Box className="flex flex-row items-center justify-center gap-2 md:flex-row">
            <TextField
              onChange={(e) => {
                dispatch({ type: "FULLNAME", payload: e.target.value });
              }}
              size="small"
              type="text"
              fullWidth
              className=""
              variant="outlined"
              label="Full Name"
              required
            ></TextField>
            <TextField
              onChange={(e) => {
                dispatch({ type: "EMAIL", payload: e.target.value });
              }}
              size="small"
              type="email"
              fullWidth
              variant="outlined"
              label="Email"
              required
            ></TextField>
          </Box>
          <TextField
            onChange={(e) => {
              dispatch({ type: "SUBJECT", payload: e.target.value });
            }}
            size="small"
            fullWidth
            variant="outlined"
            label="Subject"
            required
          ></TextField>
          <TextField
            onChange={(e) => {
              dispatch({ type: "MESSAGE", payload: e.target.value });
            }}
            size="small"
            multiline
            minRows={3}
            fullWidth
            variant="outlined"
            label="Message"
            required
          ></TextField>
          <CustomButton
            onClick={handleContactForm}
            loading={loading}
            variant="contained"
          >
            Submit
          </CustomButton>
          {/* <LoadingButton
            className="rounded"
            onClick={handleContactForm}
            loading={loading}
            size="medium"
            loadingPosition="start"
            disableElevation
            startIcon={<Send />}
            variant="outlined"
          >
            Submit
          </LoadingButton> */}
          {/* <button>Submit</button> */}
        </Box>
      </Box>
    </Box>
  );
}

export default ContactForm;
