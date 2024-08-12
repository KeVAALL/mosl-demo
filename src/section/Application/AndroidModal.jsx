import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { BootstrapInput } from "../../utils/Input/textfield";

/* eslint-disable react/prop-types */
export default function AndroidModal({ open, handleClose }) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box
        sx={{
          ...style,
          width: {
            xs: "90%", // 90% of the viewport width for extra-small screens
            sm: "70%", // 70% of the viewport width for small screens
            md: "60%", // 60% of the viewport width for medium screens
            lg: "50%", // 50% of the viewport width for large screens
            xl: "40%", // 40% of the viewport width for extra-large screens
          },
          maxWidth: "600px", // Maximum width constraint
          margin: "0 auto", // Center the modal horizontally
        }}
      >
        <Grid container sx={{ width: "100%" }}>
          <Grid item xs={12} sx={{ width: "100%" }}>
            {/* <AndroidStepper handleClose={handleClose} /> */}
            <Grid
              container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Grid item sx={{ width: "100%" }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="h5"
                    sx={{ color: "primary.main", fontWeight: 500 }}
                  >
                    Add Android App
                  </Typography>
                  <IconButton
                    onClick={() => {
                      // window.location.reload();
                      handleClose();
                    }}
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </Stack>
              </Grid>
              <Grid item xs={12} sx={{ width: "100%" }}>
                <Grid
                  container
                  spacing={3}
                  mt={1}
                  component="form"
                  onSubmit={() => {}}
                  noValidate
                >
                  {/* <Grid item xs={12} sx={{ width: "100%" }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar>1</Avatar>
                      <Typography>Register App</Typography>
                    </Stack>
                  </Grid> */}
                  <Grid item xs={12} sx={{ width: "100%" }}>
                    <FormControl variant="standard" fullWidth>
                      <Typography className="label d-flex items-center">
                        Android Package Name
                        <sup className="asc">*</sup>
                      </Typography>
                      <BootstrapInput
                        fullWidth
                        id="name"
                        size="small"
                        label="Name"
                        name="name"
                        placeholder="Name"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl variant="standard" fullWidth>
                      <Typography className="label d-flex items-center">
                        App Nickname
                        <sup className="asc">*</sup>
                      </Typography>
                      <BootstrapInput
                        fullWidth
                        id="nickname"
                        size="small"
                        name="nickname"
                        placeholder="My Android App"
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl variant="standard" fullWidth>
                      <Typography className="label d-flex items-center">
                        Debug signing certificate SHA-1
                        <sup className="asc">*</sup>
                      </Typography>
                      <BootstrapInput
                        fullWidth
                        id="certificate"
                        size="small"
                        name="certificate"
                        placeholder="00:00:00:00:00:00"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={3} mt={1}>
                  <Grid item xs={6}></Grid>
                  <Grid item xs={6}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 1, mb: 1, backgroundColor: "primary.main" }}
                    >
                      Register
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
