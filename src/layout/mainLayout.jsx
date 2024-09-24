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

import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import HomeIcon from "@mui/icons-material/Home";
import SettingsApplicationsRoundedIcon from "@mui/icons-material/SettingsApplicationsRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import AppSettingsAltIcon from "@mui/icons-material/AppSettingsAlt";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import mainLogo from "../assets/img/mosl-main-logo.png";
import secondaryLogo from "../assets/img/mosl-small-transparent.png";
import { HtmlLightTooltip } from "../utils/components/Tooltip";

import { useDispatch, useSelector } from "react-redux";

import "./mainLayout.css";
import { clearProfile } from "../redux/slices/userSlice";

const iconMapping = {
  Dashboard: <HomeIcon />,
  Project: <BarChartRoundedIcon />,
  Application: <AppSettingsAltIcon />,
  "Dynamic Links": <DynamicFeedIcon />,
  Users: <AccountCircleRoundedIcon />,
  Role: <SettingsApplicationsRoundedIcon />,
};

const Header = ({ open, handleDrawerToggle, userProfile }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
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
            <MenuIcon sx={{ color: "#000" }} />
          </IconButton>
          <Tooltip
            // open={true}
            arrow
            placement="bottom-start"
            sx={{ backgroundColor: "#f5f5f9" }}
            title={
              <Box sx={{ backgroundColor: "#f5f5f9" }}>
                <Link
                  onClick={() => {
                    dispatch(clearProfile());
                    navigate("/sign-in");
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                    padding: "4px 12px",
                    color: "rgba(0, 0, 0, 0.87)",
                    backgroundColor: "#f5f5f9",
                    textDecoration: "none",
                  }}
                >
                  <LogoutOutlinedIcon sx={{ fontSize: "18px" }} />
                  <Typography sx={{ fontSize: "14px" }}>Logout</Typography>
                </Link>
              </Box>
            }
            slotProps={{
              popper: {
                sx: {
                  "& .MuiTooltip-tooltip": {
                    bgcolor: "#f5f5f9", // Background color for the tooltip
                    color: "rgba(0, 0, 0, 0.87)", // Text color for the tooltip
                    border: "1px solid #c6c9d5",
                  },
                  "& .MuiTooltip-arrow": {
                    color: "#f5f5f9", // Arrow background color
                    "&:before": {
                      border: "1px solid #c6c9d5", // This will be the border color
                    },
                  },
                },
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
          >
            <Avatar sx={{ bgcolor: "#4db6ac" }}>
              {userProfile?.user_name?.slice(0, 1)}
            </Avatar>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const MobileDrawer = ({ open, handleDrawerToggle, menu }) => {
  const location = useLocation();
  console.log(menu);

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleDrawerToggle}
      sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: 240,
          backgroundColor: "#000",
        },
      }}
    >
      <Box
        sx={{
          width: 240,
        }}
      >
        <Menu iconShape="square" style={{ backgroundColor: "#000" }}>
          <Box
            sx={{
              px: 2,
              py: 1.2,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              mb: 2,
            }}
            className="bg-primary"
          >
            <img
              src={secondaryLogo}
              style={{
                height: "100%",
                width: "50px",
              }}
            />
            <Typography sx={{ fontSize: "14px" }} color="text.secondary">
              MOSL Dynamic Links
            </Typography>
          </Box>

          {menu.map((item) => (
            <Link
              to={`/home/${item.menu_url}`}
              key={item.menu_id}
              onClick={handleDrawerToggle}
              className="menu-item"
            >
              <MenuItem
                icon={iconMapping[item.menu_name]}
                className={
                  location.pathname.includes(item.menu_url)
                    ? "active-menu-item"
                    : ""
                }
              >
                <Typography variant="subtitle1">{item.menu_name}</Typography>
              </MenuItem>
            </Link>
          ))}
        </Menu>
      </Box>
    </Drawer>
  );
};
const ReactSidebar = ({ open, menu }) => {
  const location = useLocation();
  console.log(menu);

  return (
    <>
      <Sidebar
        collapsed={!open}
        className={`sidebar${!open ? " sidebar-shadow" : " sidebar-border"}`}
      >
        <Menu iconShape="square" style={{ backgroundColor: "#000" }}>
          {open ? (
            <Box
              sx={{
                px: 2,
                py: 1.2,
                display: "flex",
                alignItems: "center",
                gap: "10px",
                mb: 2,
              }}
              className="bg-primary"
            >
              <img
                src={secondaryLogo}
                style={{
                  height: "100%",
                  width: "50px",
                }}
              />
              <Typography sx={{ fontSize: "14px" }} color="text.secondary">
                MOSL Dynamic Links
              </Typography>
            </Box>
          ) : (
            <Box
              className="bg-primary"
              sx={{
                px: 2,
                py: 1.2,
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <img
                src={secondaryLogo}
                style={{
                  height: "100%",
                  width: "50px",
                }}
              />
            </Box>
          )}

          {menu.map((item, index) => (
            <Link
              to={`/home/${item.menu_url}`}
              key={item.menu_id}
              className={`menu-item${index === 0 ? " pt-20" : ""}`}
            >
              {open ? (
                <MenuItem
                  icon={iconMapping[item.menu_name]}
                  className={
                    location.pathname.includes(item.menu_url)
                      ? "active-menu-item"
                      : ""
                  }
                >
                  <Typography sx={{ fontSize: "13px" }}>
                    {item.menu_name}
                  </Typography>
                </MenuItem>
              ) : (
                <HtmlLightTooltip
                  arrow
                  title={item.menu_name}
                  placement="right"
                >
                  <MenuItem
                    icon={iconMapping[item.menu_name]}
                    className={
                      location.pathname.includes(item.menu_url)
                        ? "active-menu-item"
                        : ""
                    }
                  >
                    <Typography variant="subtitle1">
                      {item.menu_name}
                    </Typography>
                  </MenuItem>
                </HtmlLightTooltip>
              )}
            </Link>
          ))}

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
  const { menu } = useSelector((state) => state.menu);
  const { userProfile } = useSelector((state) => state.user);
  console.log(menu);
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
        <ReactSidebar open={drawerOpen} menu={menu} />
      ) : (
        <MobileDrawer
          open={mobileDrawerOpen}
          handleDrawerToggle={handleMobileDrawerToggle}
          menu={menu}
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
          userProfile={userProfile}
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
            paddingRight: 2,
            paddingTop: 4,
            paddingBottom: 4,
            flexGrow: 1,
            width: {
              md: "calc(100% - 16px)",
              sm: "calc(100% - 48px)",
              xs: "100%",
            },
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
