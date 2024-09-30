import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import ProjectBox from "../../utils/components/ProjectBox";
import {
  Backdrop,
  Box,
  Card,
  CardContent,
  CircularProgress,
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
import { ApiService } from "../../utils/api/apiCall";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProject } from "../../redux/slices/projectSlice";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { SELECTED_PROJECT } = useSelector((state) => state.project);
  const [loadingData, setLoadingData] = useState(false);
  const [projectData, setProjectData] = useState([]);

  async function getProjects() {
    try {
      setLoadingData(true);
      const result = await ApiService({}, "project/getall-project");

      console.log(result);
      // const newMap = result?.data?.map((table) => {
      //   return { ...table, isDeleting: false, isEditing: false };
      // });

      setProjectData(result?.data);

      if (SELECTED_PROJECT) {
        return;
      } else {
        const resp = {
          selectedProject: result?.data[0],
        };
        dispatch(setSelectedProject(resp));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    getProjects();
  }, []);

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
        {loadingData ? (
          <Grid item xs={12} sm={6} md={4}>
            <Backdrop
              sx={(theme) => ({
                backgroundColor: "rgba(0,0,0,0.15)",
                color: "#ffffff",
                zIndex: 1,
              })}
              open={true}
            >
              <CircularProgress className="table_loader" color="inherit" />
            </Backdrop>
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                onClick={() => {
                  navigate("/home/project");
                }}
                sx={{
                  minHeight: 200,
                  backgroundColor: "#eb6400",
                  color: "#fff",
                  boxShadow:
                    "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px !important",
                  cursor: "pointer",
                  "&:hover": {
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

            {projectData?.map((proj) => {
              return (
                <ProjectBox
                  key={proj?.id}
                  title={proj?.project_name}
                  description={proj?.project_id}
                  project={proj}
                />
              );
            })}
          </>
        )}
        {/* <ProjectBox
          title="react-auth-test"
          description="react-auth-test-175bb"
        />

        <ProjectBox
          title="push-notification"
          description="push-notification-6787b"
        /> */}
      </Grid>
    </>
  );
}

export default Dashboard;
