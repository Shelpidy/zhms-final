"use client";
import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";

interface PositionIndicatorProps {
  position: number;
  numberOfPosition: number;
  size?: number;
}

const PositionIndicator: React.FC<PositionIndicatorProps> = ({
  position,
  numberOfPosition,
  size = 18,
}) => {
  const [activePosition, setActivePosition] = useState(0);
  const [positions, setPositions] = useState<number[]>([]);
  const theme = useTheme();
  useEffect(() => {
    const positionsArray = Array.from(
      {
        length: numberOfPosition || 3,
      },
      (_, index) => index,
    );
    setPositions(positionsArray);
  }, [numberOfPosition]);

  useEffect(() => {
    setActivePosition(position);
  }, [position]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      {positions.map((item) => (
        <Box
          key={item}
          style={{
            width: Math.round(0.4 * size),
            height: Math.round(0.4 * size),
            borderRadius: Math.round(0.4 * size),
            backgroundColor:
              item === activePosition ? theme.palette.primary.main : "#aeaeae",
          }}
        ></Box>
      ))}
    </Box>
  );
};

const styles = {
  indicator: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
};

export default PositionIndicator;
