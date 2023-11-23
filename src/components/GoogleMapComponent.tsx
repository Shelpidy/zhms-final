"use client";
import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Box } from "@mui/material";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const _center = {
  lng: -13.22992,
  lat: 8.483802,
};

type Center = {
  lng: number;
  lat: number;
};

type MapProps = {
  center: Center;
};

export const CustomMapComponent = ({ center }: MapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC1naZC-IWN404rSFT5moe0Xr1TBGSLcto",
  });
  console.log(isLoaded);

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={16}>
      <Marker position={center}></Marker>
      {/* Child components, such as markers, info windows, etc. */}
      <></>
    </GoogleMap>
  ) : (
    <Box>
      <h1>Loading map</h1>
    </Box>
  );
};
