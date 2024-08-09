import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

function CommonLayout({ children }) {
  return <Box sx={{ display: "flex", height: "100vh" }}>{children}</Box>;
}

CommonLayout.propTypes = {
  children: PropTypes.node,
};
export default CommonLayout;
