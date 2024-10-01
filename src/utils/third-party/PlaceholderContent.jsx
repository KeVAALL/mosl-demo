import PropTypes from "prop-types";

// material-ui
import { Typography, Stack, CardMedia } from "@mui/material";

// project-import
// import { DropzopType } from "config";

// assets
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import UploadCover from "../../assets/img/upload.svg";

// ==============================|| UPLOAD - PLACEHOLDER ||============================== //

export default function PlaceholderContent({ type }) {
  const DropzopType = {
    default: "DEFAULT",
    standard: "STANDARD",
  };
  return (
    <>
      {type !== DropzopType.standard && (
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          direction={{ xs: "column", md: "row" }}
          sx={{ width: 1, textAlign: { xs: "center", md: "left" } }}
        >
          <CardMedia component="img" image={UploadCover} sx={{ width: 150 }} />
          <Stack sx={{ p: 3 }} spacing={1}>
            <Typography variant="body1">Drag & Drop or Select file</Typography>

            <Typography variant="caption" className="grey">
              Drop files here or click&nbsp;
              <Typography
                component="span"
                color="primary"
                sx={{ textDecoration: "underline", fontSize: "12px" }}
              >
                browse
              </Typography>
              &nbsp;thorough your machine
            </Typography>
          </Stack>
        </Stack>
      )}
      {type === DropzopType.standard && (
        <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
          <CameraAltIcon style={{ fontSize: "32px" }} />
        </Stack>
      )}
    </>
  );
}

PlaceholderContent.propTypes = {
  type: PropTypes.string,
};
