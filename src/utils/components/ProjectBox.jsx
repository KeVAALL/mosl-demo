/* eslint-disable react/prop-types */
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CodeOffOutlinedIcon from "@mui/icons-material/CodeOffOutlined";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedProject } from "../../redux/slices/projectSlice";

export default function ProjectBox({ title, description, project }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          minHeight: 200,
          boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px !important",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#f5ecd7",
            transition: "background-color 0.3s ease-in-out", // Add smooth transition
          },
        }}
        onClick={() => {
          navigate("/home/project", { state: { project_data: project } });
          const resp = {
            selectedProject: project,
          };
          dispatch(setSelectedProject(resp));
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            minHeight: 200,
          }}
        >
          <Stack>
            <Typography variant="h5" fontWeight={500} component="div">
              {title}
            </Typography>
            <Typography
              variant="caption"
              color="text.greyLight"
              component="div"
            >
              {description}
            </Typography>
          </Stack>
          {/* <CodeOffOutlinedIcon /> */}
        </CardContent>
      </Card>
    </Grid>
  );
}
