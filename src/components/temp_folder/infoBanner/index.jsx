import React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { boxStyle, alertStyle } from "./style";

const InfoBanner = () => {
  return (
    <Box sx={boxStyle}>
      <Alert severity='warning' sx={alertStyle}>
        Comments are fetched from the database.
      </Alert>
    </Box>
  );
};

export default InfoBanner;
