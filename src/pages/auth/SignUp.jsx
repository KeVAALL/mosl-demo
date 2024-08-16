import { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { BootstrapInput } from "../../utils/Input/textfield";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const navigate = useNavigate();

  return (
    <Box
      className="poppins"
      sx={{
        minHeight: "100vh",
      }}
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        spacing={3}
        sx={{
          minHeight: "100vh",
          minWidth: "100vw",
        }}
      >
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Stack alignItems="center">
              <Typography
                variant="h5"
                sx={{ color: "primary.main", fontWeight: 500 }}
              >
                Admin
              </Typography>
              <Typography variant="caption" sx={{ color: "text.grey" }}>
                Welcome!
              </Typography>
            </Stack>
            <Grid
              container
              spacing={2}
              component="form"
              direction="column"
              onSubmit={() => {}}
              noValidate
              sx={{ mt: 1, width: { md: "30%", xs: "100%" } }}
            >
              <Grid item xs={12}>
                <FormControl variant="standard" fullWidth>
                  <Typography className="label d-flex items-center">
                    Email
                    <sup className="asc">*</sup>
                  </Typography>
                  <BootstrapInput
                    fullWidth
                    id="email"
                    size="small"
                    label="Email Address"
                    name="email"
                    placeholder="Email"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="standard" fullWidth>
                  <Typography className="label d-flex items-center">
                    Name
                    <sup className="asc">*</sup>
                  </Typography>
                  <BootstrapInput
                    fullWidth
                    id="name"
                    size="small"
                    label="Name"
                    name="name"
                    placeholder="Name"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="standard" fullWidth>
                  <Typography className="label d-flex items-center">
                    Password
                    <sup className="asc">*</sup>
                  </Typography>
                  <BootstrapInput
                    id="password"
                    fullWidth
                    size="small"
                    label="Password"
                    name="password"
                    placeholder="Password"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseDownPassword}
                          edge="end"
                          color="text.greyLight"
                        >
                          {showPassword ? (
                            <Visibility fontSize="small" />
                          ) : (
                            <VisibilityOff fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  // type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 1, mb: 1, backgroundColor: "primary.main" }}
                  onClick={() => {
                    navigate("/home/dashboard");
                  }}
                >
                  Register
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12} display="flex" justifyContent="center">
                    <Typography variant="caption" sx={{ color: "text.grey" }}>
                      Have an account?
                      <Link
                        to="/sign-in"
                        className="custom-link"
                        style={{ marginLeft: "8px" }}
                      >
                        Sign In
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SignUp;
