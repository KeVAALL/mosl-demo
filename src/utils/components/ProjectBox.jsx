/* eslint-disable react/prop-types */
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CodeOffOutlinedIcon from "@mui/icons-material/CodeOffOutlined";
import { Stack } from "@mui/material";

export default function ProjectBox({ title, description, id }) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          minHeight: 200,
          boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px !important",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#f8fafe",
            transition: "background-color 0.3s ease-in-out", // Add smooth transition
          },
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
          <CodeOffOutlinedIcon />
        </CardContent>
      </Card>
    </Grid>
  );
}
