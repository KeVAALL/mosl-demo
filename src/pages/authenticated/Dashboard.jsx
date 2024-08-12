import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import React from "react";
import ProjectBox from "../../utils/components/ProjectBox";
import {
  Backdrop,
  Box,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputLabel,
  Modal,
  Stack,
} from "@mui/material";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { BootstrapInput } from "../../utils/Input/textfield";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Grid container spacing={4} sx={{ width: "100%" }}>
        <Grid item xs={12}>
          <Grid container display="flex" alignItems="center">
            <Grid item xs={6}>
              <Typography variant="h5" fontWeight={500}>
                Admin Dashboard
              </Typography>
              <Typography variant="caption" sx={{ color: "text.grey", mt: 2 }}>
                Get an overview of the details
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            onClick={() => {
              navigate("/home/projects");
            }}
            sx={{
              minHeight: 200,
              boxShadow:
                "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px !important",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#f8fafe",
                transition: "background-color 0.3s ease-in-out", // Add smooth transition
              },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                // minHeight: 200,
              }}
            >
              <AddOutlinedIcon sx={{ fontSize: "3rem" }} />
              <Typography variant="h5" fontWeight={500} component="div">
                Project
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* <Grid item xs={12} sm={6} md={4}>
          <Card
            onClick={() => {
              navigate("/home/application");
            }}
            sx={{
              minHeight: 200,
              boxShadow:
                "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px !important",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#f8fafe",
                transition: "background-color 0.3s ease-in-out", // Add smooth transition
              },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                // minHeight: 200,
              }}
            >
              <AddOutlinedIcon sx={{ fontSize: "3rem" }} />
              <Typography variant="h5" fontWeight={500} component="div">
                Applications
              </Typography>
            </CardContent>
          </Card>
        </Grid> */}
        <ProjectBox
          title="react-auth-test"
          description="react-auth-test-175bb"
        />

        {/* <Grid item xs={12} sm={6} md={4}>
          <Card
            onClick={() => {
              navigate("/home/dynamic-links");
            }}
            sx={{
              minHeight: 200,
              boxShadow:
                "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px !important",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#f8fafe",
                transition: "background-color 0.3s ease-in-out", // Add smooth transition
              },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                // minHeight: 200,
              }}
            >
              <AddOutlinedIcon sx={{ fontSize: "3rem" }} />
              <Typography variant="h5" fontWeight={500} component="div">
                Dynamic Links
              </Typography>
            </CardContent>
          </Card>
        </Grid> */}
        <ProjectBox
          title="push-notification"
          description="push-notification-6787b"
        />
      </Grid>
    </>
  );
}

export default Dashboard;
