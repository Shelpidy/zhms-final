import React, { CSSProperties, useEffect, useState } from "react";
import { useTheme, CircularProgress } from "@mui/material";

interface CustomButtonProps {
  size?: "small" | "medium";
  color?: string | null;
  variant?: "contained" | "outlined";
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

const CustomButton = ({
  size = "medium",
  color = null,
  variant = "contained",
  onClick,
  children,
  loading = false,
  disabled = false,
}: CustomButtonProps) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const buttonStyle: CSSProperties = {
    backgroundColor:
      variant === "contained"
        ? color || theme.palette.primary.main
        : "transparent",
    borderRadius: "3px",
    border: `1px solid ${theme.palette.primary.main}`,
    padding: size === "small" ? "4px 4px" : "8px 16px",
    fontSize: size === "small" ? "12px" : "14px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
    color: theme.palette.primary.light,
    position: "relative",
  };

  const loadingStyle: CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1,
  };

  const handleClick = () => {
    if (isLoading || disabled) return;
    setIsLoading(true);
    if (onClick) {
      onClick();
    }
    // Simulate asynchronous operation completion after 2 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <button
      style={buttonStyle}
      onClick={handleClick}
      disabled={isLoading || disabled}
    >
      {isLoading && (
        <CircularProgress
          size={20}
          style={loadingStyle}
          color={variant === "contained" ? "secondary" : "primary"}
        />
      )}
      {children}
    </button>
  );
};

export default CustomButton;
