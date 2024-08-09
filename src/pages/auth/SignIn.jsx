import { useState } from "react";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
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
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const navigate = useNavigate();

  return (
    // <AuthWrapper>
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
        sx={{
          minHeight: "100vh",
          minWidth: "100vw",
        }}
      >
        <Grid container spacing={3}>
          {/* <Grid item xs={12} textAlign="center">
            <Logo />
          </Grid> */}

          <Grid item xs={12}>
            <Container component="main" maxWidth="lg">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* <Avatar sx={{ m: 1, bgcolor: "green" }}>
                  <LockOutlinedIcon />
                </Avatar> */}
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
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1, width: { md: "30%", xs: "100%" } }}
                >
                  <Grid item xs={12}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel
                        shrink
                        htmlFor="email"
                        className="input-label"
                      >
                        <Typography variant="body1">Email</Typography>
                      </InputLabel>
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
                        // inputProps={{
                        //   "aria-label": "weight",
                        // }}
                      />
                      {/* <TextField
                        variant="outlined"
                        fullWidth
                        size="small"
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        placeholder="Email"
                        // autoFocus
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          "aria-label": "weight",
                        }}
                      /> */}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel
                        shrink
                        htmlFor="password"
                        className="input-label"
                      >
                        <Typography variant="body1">Password</Typography>
                      </InputLabel>
                      <BootstrapInput
                        id="password"
                        type={showPassword ? "text" : "password"}
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
                                <Visibility
                                  fontSize="small"
                                  color="text.greyLight"
                                />
                              ) : (
                                <VisibilityOff fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}></Grid>

                  <Grid item xs={6} alignItems="flex-end">
                    <Link href="#" className="custom-link">
                      <Typography variant="caption">
                        Forgot password?
                      </Typography>
                    </Link>
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
                      Sign In
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={12} display="flex" justifyContent="center">
                        <Typography
                          variant="caption"
                          sx={{ color: "text.grey" }}
                        >
                          No account?
                          <a
                            href="/sign-up"
                            className="custom-link"
                            style={{ marginLeft: "8px" }}
                          >
                            Sign Up
                          </a>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Container>
          </Grid>
        </Grid>
      </Grid>
    </Box>
    // </AuthWrapper>
  );
}
