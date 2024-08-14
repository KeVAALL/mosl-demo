/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Drawer,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { Outlet, Link } from "react-router-dom";

import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import HomeIcon from "@mui/icons-material/Home";
import SettingsApplicationsRoundedIcon from "@mui/icons-material/SettingsApplicationsRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import AppSettingsAltIcon from "@mui/icons-material/AppSettingsAlt";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import mainLogo from "../assets/img/mosl-main-logo.png";
import secondaryLogo from "../assets/img/mosl-small-transparent.png";

import "./mainLayout.css";

// Tooltip style
// const HtmlTooltip = styled(({ className, ...props }) => (
//   <Tooltip {...props} classes={{ popper: className }} />
// ))(({ theme }) => ({
//   [`& .${tooltipClasses.tooltip}`]: {
//     backgroundColor: "#f5f5f9",
//     color: "#424242",
//     // color: "rgba(0, 0, 0, 0.87)",
//     maxWidth: 220,
//     height: 20,
//     fontSize: theme.typography.pxToRem(12),
//     border: "1px solid #dadde9",
//   },
// }));

const Header = ({ open, handleDrawerToggle }) => (
  <AppBar position="static" className="main-toolbar">
    <Toolbar>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          p: 2,
        }}
        className={`${open ? "drawer-open" : ""}`}
      >
        <IconButton
          className="toggle-drawer-btn"
          edge="start"
          color="black"
          aria-label="menu"
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>
        {/* <Tooltip
          placement="bottom-start"
          title={
            <Menu iconShape="square">
              <Link to="/sign-in">
                <MenuItem icon={<BarChartRoundedIcon />}>
                  <Typography variant="subtitle1">Logout</Typography>
                </MenuItem>
              </Link>
            </Menu>
          }
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -10],
                  },
                },
              ],
            },
          }}
          enterTouchDelay={20}
        > */}
        <Avatar sx={{ bgcolor: "black" }}>N</Avatar>
        {/* </Tooltip> */}
      </Box>
    </Toolbar>
  </AppBar>
);
const MobileDrawer = ({ open, handleDrawerToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleDrawerToggle}
      sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: 240,
        },
      }}
    >
      <Box
        sx={{
          width: 240,
        }}
      >
        <Menu iconShape="square">
          <Box sx={{ p: 3 }}>
            <h3>DEMO</h3>
          </Box>
          <Link
            to="/home/dashboard"
            onClick={handleDrawerToggle}
            className="menu-item"
          >
            <MenuItem
              icon={<HomeIcon />}
              className={`${
                location.pathname === "/home/dashboard"
                  ? "active-menu-item"
                  : ""
              }`}
            >
              <Typography variant="subtitle1">Dashboard</Typography>
            </MenuItem>
          </Link>

          <Link
            to="/home/projects"
            onClick={handleDrawerToggle}
            className="menu-item"
          >
            <MenuItem
              icon={<BarChartRoundedIcon />}
              className={`${
                location.pathname === "/home/projects" ? "active-menu-item" : ""
              }`}
            >
              Project
            </MenuItem>
          </Link>
          <Link
            to="/home/application"
            onClick={handleDrawerToggle}
            className="menu-item"
          >
            <MenuItem
              icon={<AppSettingsAltIcon />}
              className={`${
                location.pathname === "/home/application"
                  ? "active-menu-item"
                  : ""
              }`}
            >
              Application
            </MenuItem>
          </Link>
          <Link
            to="/home/dynamic-links"
            onClick={handleDrawerToggle}
            className="menu-item"
          >
            <MenuItem
              icon={<DynamicFeedIcon />}
              className={`${
                location.pathname === "/home/dynamic-links"
                  ? "active-menu-item"
                  : ""
              }`}
            >
              Dynamic Links
            </MenuItem>
          </Link>
          <Link
            to="/home/user"
            onClick={handleDrawerToggle}
            className="menu-item"
          >
            <MenuItem
              icon={<AccountCircleRoundedIcon />}
              className={`${
                location.pathname === "/home/user" ? "active-menu-item" : ""
              }`}
            >
              User
            </MenuItem>
          </Link>
          <Link
            to="/home/role"
            oonClick={handleDrawerToggle}
            className="menu-item"
          >
            <MenuItem
              icon={<SettingsApplicationsRoundedIcon />}
              className={`${
                location.pathname === "/home/role" ? "active-menu-item" : ""
              }`}
            >
              Role
            </MenuItem>
          </Link>
        </Menu>
      </Box>
    </Drawer>
  );
};
const ReactSidebar = ({ open, activeTab }) => {
  const location = useLocation();
  console.log(location.pathname);
  console.log(activeTab);

  return (
    <>
      <Sidebar
        collapsed={!open}
        className={`sidebar${!open ? " sidebar-shadow" : " sidebar-border"}`}
      >
        <Menu iconShape="square">
          {open ? (
            <Box sx={{ px: 2 }}>
              <img
                src={mainLogo}
                style={{
                  height: "90px",
                  width: "100%",
                }}
              />
            </Box>
          ) : (
            // <Box sx={{ p: 3 }}>
            <img
              src={secondaryLogo}
              style={{
                height: "75px",
                width: "100%",
              }}
            />
            // </Box>
          )}
          <Link to="/home/dashboard" className="menu-item">
            <MenuItem
              icon={<HomeIcon />}
              className={`${
                location.pathname === "/home/dashboard"
                  ? "active-menu-item"
                  : ""
              }`}
            >
              <Typography variant="subtitle1">Dashboard</Typography>
            </MenuItem>
          </Link>

          <Link to="/home/projects" className="menu-item">
            <MenuItem
              icon={<BarChartRoundedIcon />}
              className={`${
                location.pathname === "/home/projects" ? "active-menu-item" : ""
              }`}
            >
              Project
            </MenuItem>
          </Link>
          <Link to="/home/application" className="menu-item">
            <MenuItem
              icon={<AppSettingsAltIcon />}
              className={`${
                location.pathname === "/home/application"
                  ? "active-menu-item"
                  : ""
              }`}
            >
              Application
            </MenuItem>
          </Link>
          <Link to="/home/dynamic-links" className="menu-item">
            <MenuItem
              icon={<DynamicFeedIcon />}
              className={`${
                location.pathname === "/home/dynamic-links"
                  ? "active-menu-item"
                  : ""
              }`}
            >
              Dynamic Links
            </MenuItem>
          </Link>
          <Link to="/home/user" className="menu-item">
            <MenuItem
              icon={<AccountCircleRoundedIcon />}
              className={`${
                location.pathname === "/home/user" ? "active-menu-item" : ""
              }`}
            >
              User
            </MenuItem>
          </Link>
          <Link to="/home/role" className="menu-item">
            <MenuItem
              icon={<SettingsApplicationsRoundedIcon />}
              className={`${
                location.pathname === "/home/role" ? "active-menu-item" : ""
              }`}
            >
              Role
            </MenuItem>
          </Link>
          {/* <Link to="/home/role" className="menu-item">
            <MenuItem icon={<TimelineRoundedIcon />}>Logs</MenuItem>
          </Link> */}
        </Menu>
      </Sidebar>
    </>
  );
};

export const Layout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const handleDesktopDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100%",
        position: "fixed",
      }}
    >
      {isDesktop ? (
        <ReactSidebar open={drawerOpen} />
      ) : (
        <MobileDrawer
          open={mobileDrawerOpen}
          handleDrawerToggle={handleMobileDrawerToggle}
        />
      )}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: "calc(100% - 20px)",
        }}
      >
        <Header
          open={isDesktop ? drawerOpen : mobileDrawerOpen}
          handleDrawerToggle={
            isDesktop ? handleDesktopDrawerToggle : handleMobileDrawerToggle
          }
        />
        <Toolbar
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            paddingLeft: "16px",
            paddingRight: "16px",
            minHeight: "74px",
            paddingTop: "8px",
            paddingBottom: "8px",
            marginTop: "inherit",
            marginBottom: "inherit",
          }}
        ></Toolbar>
        <Box
          sx={{
            paddingLeft: 4,
            paddingTop: 4,
            paddingBottom: 4,
            // paddingRight: { lg: 0, sm: 4, xs: 0 },
            flexGrow: 1,
            width: { md: "calc(100% - 20px)", xs: "100%" },
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "10px",
              border: "2px solid #f1f1f1",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555",
            },
          }}
        >
          {/* <Box sx={{ width: "80px" }}></Box> */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

/* <Box sx={{ width: "80px" }} /> */
// useEffect(() => {
//   switch (location.pathname) {
//     case location.pathname === "/home/dashboard":
//       setActiveTab("/home/dashboard");
//       break;
//     case location.pathname === "/home/user":
//       setActiveTab("/home/user");
//       break;
//     case location.pathname === "/home/role":
//       setActiveTab("/home/role");
//       break;
//     default:
//       console.log(`Sorry, not working`);
//   }
// }, [location.pathname]);
// <Box sx={{ display: "flex", height: "100vh" }}>
//   {isDesktop ? (
//     <div style={{ display: "flex", height: "100vh" }}>
//       <ReactSidebar open={drawerOpen} />
//     </div>
//   ) : (
//     <MobileDrawer
//       open={drawerOpen}
//       handleDrawerToggle={handleDrawerToggle}
//     />
//   )}
//   <Box
//     sx={{
//       flexGrow: 1,
//       display: "flex",
//       flexDirection: "column",
//       width: "100%",
//     }}
//   >
//     <Header handleDrawerToggle={handleDrawerToggle} />
//     <Box sx={{ padding: 4, flexGrow: 1 }}>
//       <Outlet />
//     </Box>
//   </Box>
// </Box>
