import PropTypes from "prop-types";

// material-ui
import { useTheme } from "@mui/material/styles";
import { List, ListItemText, ListItem } from "@mui/material";

// project-imports
// import { DropzopType } from "config";
// import IconButton from "components/@extended/IconButton";

// utils
import getDropzoneData from "../getDropzoneData";

// assets
import CancelIcon from "@mui/icons-material/Cancel";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { LoadingButton } from "@mui/lab";
// import { CloseCircle, Document } from 'iconsax-react';

// ==============================|| MULTI UPLOAD - PREVIEW ||============================== //

export default function FilesPreview({
  showList = false,
  files,
  onRemove,
  typeF,
}) {
  const theme = useTheme();
  const hasFile = files.length > 0;
  // const layoutType = type;
  const DropzopType = {
    default: "DEFAULT",
    standard: "STANDARD",
  };
  const { key, name, size, preview, type } = getDropzoneData(files, "_");
  return (
    <List
      disablePadding
      sx={{
        ...(hasFile && type !== DropzopType.standard && { my: 3 }),
        ...(type === DropzopType.standard && { width: "calc(100% - 84px)" }),
      }}
    >
      {/* {files.map((file, index) => { */}
      {/* const { key, name, size, preview, type } = getDropzoneData(file, index); */}

      {/* // if (showList) {
        //   return (
        //     <ListItem
        //       key={key}
        //       sx={{
        //         p: 0,
        //         m: 0.5,
        //         width: layoutType === DropzopType.standard ? 64 : 80,
        //         height: layoutType === DropzopType.standard ? 64 : 80,
        //         borderRadius: 1.25,
        //         position: "relative",
        //         display: "inline-flex",
        //         verticalAlign: "text-top",
        //         border: `solid 1px ${theme.palette.divider}`,
        //         overflow: "hidden",
        //       }}
        //     >
        //       {type?.includes("image") && (
        //         <img alt="preview" src={preview} style={{ width: "100%" }} />
        //       )}
        //       {!type?.includes("image") && (
        //         <InsertDriveFileIcon
        //           variant="Bold"
        //           style={{ width: "100%", fontSize: "1.5rem" }}
        //         />
        //       )}

        //       {onRemove && (
        //         // <LoadingButton
        //         //   size="small"
        //         //   color="error"
        //         //   shape="rounded"
        //         //   onClick={() => onRemove(file)}
        //         //   sx={{
        //         //     fontSize: "0.875rem",
        //         //     bgcolor: "background.paper",
        //         //     p: 0,
        //         //     width: "auto",
        //         //     height: "auto",
        //         //     top: 2,
        //         //     right: 2,
        //         //     position: "absolute",
        //         //   }}
        //         // >
        //         <CancelIcon
        //           style={{ cursor: "pointer" }}
        //           variant="Bold"
        //           onClick={() => onRemove(file)}
        //         />
        //         // </LoadingButton>
        //       )}
        //     </ListItem>
        //   );
        // } */}

      <ListItem
        // key={key}
        sx={{
          my: 1,
          px: 2,
          py: 0.75,
          borderRadius: 0.75,
          border: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      >
        <InsertDriveFileIcon
          variant="Bold"
          style={{
            width: "30px",
            height: "30px",
            fontSize: "1.15rem",
            marginRight: 4,
          }}
        />

        <ListItemText
          primary={typeof files === "string" ? files : name}
          secondary={typeof files === "string" ? "" : size}
          primaryTypographyProps={{ variant: "subtitle2" }}
          secondaryTypographyProps={{ variant: "caption" }}
        />

        {onRemove && (
          //   <IconButton
          //     edge="end"
          //     size="small"
          //     onClick={() => onRemove(files)}
          //   >
          <CancelIcon
            onClick={() => onRemove(files)}
            variant="Bold"
            style={{ fontSize: "1.15rem", cursor: "pointer" }}
          />
          //   </IconButton>
        )}
      </ListItem>
    </List>
  );
}

FilesPreview.propTypes = {
  showList: PropTypes.bool,
  files: PropTypes.array,
  onRemove: PropTypes.func,
  typeF: PropTypes.string,
};
