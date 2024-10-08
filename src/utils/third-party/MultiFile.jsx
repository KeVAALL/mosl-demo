/* eslint-disable react/prop-types */
// import PropTypes from "prop-types";

// material-ui
import { styled } from "@mui/material/styles";
import { Box, Button, Stack } from "@mui/material";

// third-party
import { useDropzone } from "react-dropzone";

// project-imports

import RejectionFiles from "./RejectionFiles";
import PlaceholderContent from "./PlaceholderContent";
import FilesPreview from "./FilePreview";
import { toast } from "react-toastify";
import { ApiService } from "../api/apiCall";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";

const DropzoneWrapper = styled("div")(({ theme }) => ({
  outline: "none",
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow:
    "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
  border: `1px dashed ${theme.palette.secondary.main}`,
  "&:hover": { opacity: 0.8, cursor: "pointer" },
}));

// ==============================|| UPLOAD - MULTIPLE FILE ||============================== //

const MultiFileUpload = ({
  error,
  showList = false,
  files,
  type,
  setFieldValue,
  sx,
  onUpload,
  validateForm,
  userProfile,
  setShowUploadModal,
}) => {
  const DropzopType = {
    default: "DEFAULT",
    standard: "STANDARD",
  };
  const [uploading, setUploading] = useState(false);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple: false,
    // accept: [
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //   "application/vnd.ms-excel",
    // ],
    onDrop: (acceptedFiles) => {
      setFieldValue(
        "files",
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )[0] // Assign the first (only) file to "files"
      );
    },
  });

  //   const onRemoveAll = () => {
  //     setFieldValue("files", null);
  //   };

  //   const onRemove = (file) => {
  //     const filteredItems = files && files.filter((_file) => _file !== file);
  //     setFieldValue("files", filteredItems);
  //   };
  const onRemoveAll = () => {
    setFieldValue("files", null);
  };

  const onRemove = () => {
    setFieldValue("files", null);
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          ...(type === DropzopType.standard && {
            width: "auto",
            display: "flex",
          }),
          ...sx,
        }}
      >
        <Stack {...(type === DropzopType.standard && { alignItems: "center" })}>
          <DropzoneWrapper
            {...getRootProps()}
            sx={{
              ...(type === DropzopType.standard && {
                p: 0,
                m: 1,
                width: 64,
                height: 64,
              }),
              ...(isDragActive && { opacity: 0.72 }),
              ...((isDragReject || error) && {
                color: "error.main",
                borderColor: "error.light",
                bgcolor: "error.lighter",
              }),
            }}
          >
            <input
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              // {...getInputProps({ accept: "image/*" })}
              {...getInputProps({ accept: ".xlsx, .xls" })}
              // {...getInputProps({
              //   accept:
              //     ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
              // })}
            />
            {/* { accept: ".xlsx, .xls" } */}
            <PlaceholderContent type={type} />
          </DropzoneWrapper>
          {/* {type === DropzopType.standard && files && files.length > 1 && ( */}
          {/* {files && (
            <Button
              variant="contained"
              color="error"
              size="extraSmall"
              onClick={onRemoveAll}
            >
              Remove
            </Button>
          )} */}
        </Stack>
        {fileRejections.length > 0 && (
          <RejectionFiles fileRejections={fileRejections} />
        )}
        {files && (
          <FilesPreview
            files={files}
            showList={showList}
            onRemove={onRemove}
            typeF={type}
          />
        )}
      </Box>

      {type !== DropzopType.standard && files && (
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={1.5}
          sx={{ mt: 1.5 }}
        >
          <Button color="inherit" size="small" onClick={onRemoveAll}>
            Remove
          </Button>
          <LoadingButton
            loading={uploading}
            disabled={uploading}
            type="button"
            size="small"
            variant="contained"
            onClick={async () => {
              // Trigger form validation manually
              const errors = await validateForm();

              if (!errors.files) {
                // If there are no validation errors for the files field, proceed with the upload
                console.log("No errors, proceed with upload", files);

                // Create a new FormData instance
                const formData = new FormData();

                // Append file to FormData
                if (files) {
                  formData.append("file", files); // Directly append the file object
                }

                // Append other request body data
                formData.append("created_by", userProfile?.user_role_id);
                try {
                  setUploading(true);
                  // Upload using the utility function
                  const result = await ApiService(formData, "upload-file");

                  console.log(result);

                  if (result?.status === 201) {
                    toast.success(`Link added`);
                    setShowUploadModal(false);
                    window.location.reload();
                  }
                } catch (error) {
                  toast.error(error?.response?.data?.message);
                  console.error("Upload error:", error);
                } finally {
                  setUploading(false);
                }
                // You can add your upload logic here
              } else {
                console.error("Validation failed:", errors.files);

                toast.error(errors.files);
              }
            }}
            //   onClick={onUpload}
          >
            Upload files
          </LoadingButton>
        </Stack>
      )}
    </>
  );
};

// MultiFileUpload.propTypes = {
//   error: PropTypes.bool,
//   showList: PropTypes.bool,
//   files: PropTypes.array,
//   setFieldValue: PropTypes.func,
//   onUpload: PropTypes.func,
//   sx: PropTypes.object,
//   type: PropTypes.string,
// };

export default MultiFileUpload;
