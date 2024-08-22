import { useState } from "react";
import Button from "@mui/material/Button";
// import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Field, Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
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
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import { ApiService } from "../../utils/api/apiCall";

export default function SignIn() {
  const [loginAttempt, setLoginAttempt] = useState(false);
  const handleSubmit = async (values) => {
    console.log(values);
    const reqdata = {
      email: "email@gmalil33333.com",
      password: "ank9@13294479995577",
    };
    try {
      setLoginAttempt(true);
      const result = await ApiService(reqdata, "user/login");
      if (result) {
        //   toast.success("Successful!");
        // navigate("/home/dashboard");
        return result;
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoginAttempt(false);
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });
  const navigate = useNavigate();

  return (
    // <AuthWrapper>
    <Box
      className="poppins"
      sx={{
        minHeight: "100vh",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Grid
          container
          spacing={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            minHeight: "100vh",
            margin: "auto",
          }}
        >
          <Grid item xs={12} mb={3}>
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
          </Grid>
          <Grid container direction="column">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <Grid container spacing={2} direction="column">
                    <Grid item xs={12}>
                      <FormControl variant="standard" fullWidth>
                        <Typography className="label d-flex items-center">
                          Email
                          <sup className="asc">*</sup>
                        </Typography>

                        <Field name="email">
                          {({ field }) => (
                            <BootstrapInput
                              {...field}
                              id="email"
                              size="small"
                              placeholder="Email Address"
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-error text-12 mt-10"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl variant="standard" fullWidth>
                        <Typography className="label d-flex items-center">
                          Password
                          <sup className="asc">*</sup>
                        </Typography>
                        <Field name="password">
                          {({ field }) => (
                            <BootstrapInput
                              {...field}
                              id="password"
                              placeholder="Password"
                              type={showPassword ? "text" : "password"}
                              fullWidth
                              size="small"
                              InputLabelProps={{ shrink: true }}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
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
                          )}
                        </Field>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-error text-12 mt-10"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} alignItems="flex-end">
                      <Link href="#" className="custom-link">
                        <Typography variant="caption">
                          Forgot password?
                        </Typography>
                      </Link>
                    </Grid>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          mt: 1,
                          flexDirection: { xs: "column-reverse", md: "row" },
                        }}
                      >
                        <LoadingButton
                          loading={loginAttempt}
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 1, mb: 1, backgroundColor: "primary.main" }}
                          // onClick={() => {
                          //   toast.success("Successful!");
                          //   // navigate("/home/dashboard");
                          // }}
                        >
                          Sign In
                        </LoadingButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </Container>
    </Box>
    // </AuthWrapper>
  );
}

/* <TextField
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
                      /> */
// {
/* <BootstrapInput
                        fullWidth
                        id="email"
                        size="small"
                        label="Email Address"
                        name="email"
                        placeholder="Email"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      /> */
// }
