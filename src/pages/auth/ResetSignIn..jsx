import { useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Field, Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FormControl, IconButton, InputAdornment, Stack } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { BootstrapInput } from "../../utils/Input/textfield";
import { useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import LoadingButton from "@mui/lab/LoadingButton";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ApiService } from "../../utils/api/apiCall";
import mainLogo from "../../assets/img/mosl-main-logo.png";
import "./auth.css";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { decryptData, encryptData } from "../../utils/encryption";
import { setProfile } from "../../redux/slices/userSlice";
import { setMenu } from "../../redux/slices/menuSlice";

export default function ResetSignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginAttempt, setLoginAttempt] = useState(false);
  const resetEmail = decryptData(localStorage.getItem("resetEmail"));
  const [signInForm, setSignInForm] = useState({
    email: resetEmail ? resetEmail : "",
    password: "",
  });
  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });
  const handleSubmit = async (values) => {
    console.log(values);

    try {
      setLoginAttempt(true);
      const result = await ApiService(values, "user/login");
      if (result) {
        console.log(result);

        if (result?.data?.result_flag === 0) {
          toast.error("Invalid Credentials");
          return;
        }

        if (result?.data?.data?.is_password_reset) {
          toast.warn("Please reset your Password!");
          localStorage.setItem("resetEmail", encryptData(values?.email));
          navigate("/reset-password");
        } else {
          toast.success("Login successful!");
          const firstURL = result?.data?.data?.menu[0]?.menu_url;
          navigate(`/home/${firstURL ? firstURL : ""}`);

          const apiResponse = {
            userProfile: result?.data?.data,
            token: result?.data?.data?.token?.access_token,
          };
          dispatch(setProfile(apiResponse));

          const apiMenu = { menu: result?.data?.data?.menu };
          dispatch(setMenu(apiMenu));
        }

        return result;
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
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

  return (
    <Box
      className="poppins"
      sx={{
        minHeight: "100vh",
        display: "flex",
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
        }}
      >
        <Grid
          container
          spacing={3}
          className="bg-secondary p-20"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            minHeight: "400px",
            margin: "auto",
            borderRadius: "8px",
          }}
        >
          <Grid item xs={12} mb={3} className="pt-0">
            <Stack alignItems="center">
              <img
                src={mainLogo}
                style={{
                  height: "80px",
                  width: "100%",
                }}
              />
            </Stack>
          </Grid>
          <Grid container direction="column">
            <Formik
              initialValues={signInForm}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, errors, touched }) => (
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
                              placeholder="Email"
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              onChange={(e) => {
                                e.preventDefault();
                                const { value } = e.target;

                                const regex = /[^-\s]/;

                                if (!value || regex.test(value.toString())) {
                                  setFieldValue("email", value);
                                } else {
                                  return;
                                }
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage name="email">
                          {(msg) => (
                            <div className="custom-error-message">
                              <ErrorOutlineOutlinedIcon
                                sx={{ color: "#ff0000", fontSize: "18px" }} // Custom error icon color
                              />
                              <Typography variant="caption">{msg}</Typography>
                            </div>
                          )}
                        </ErrorMessage>
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
                              onChange={async (e) => {
                                const value = e.target.value;
                                const regex = /^\S+$/;

                                if (!value || regex.test(value.toString())) {
                                  setFieldValue("password", value);
                                } else {
                                  return;
                                }
                              }}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseDownPassword}
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
                        <ErrorMessage name="password">
                          {(msg) => (
                            <div className="custom-error-message">
                              <ErrorOutlineOutlinedIcon
                                sx={{ color: "#ff0000", fontSize: "18px" }} // Custom error icon color
                              />
                              <Typography variant="caption">{msg}</Typography>
                            </div>
                          )}
                        </ErrorMessage>
                      </FormControl>
                    </Grid>

                    {/* <Grid item xs={6} alignItems="flex-end">
                      <Link href="/forgot-password" className="custom-link">
                        <Typography variant="caption">
                          Forgot password?
                        </Typography>
                      </Link>
                    </Grid> */}
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
                          disabled={loginAttempt}
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 1, mb: 1, backgroundColor: "primary.main" }}
                        >
                          Sign In
                        </LoadingButton>
                      </Box>
                    </Grid>

                    {/* <Grid
                      item
                      md={6}
                      xs={6}
                      component={Stack}
                      flexDirection="row"
                      alignItems="center"
                      gap={0.5}
                    >
                      <KeyboardBackspaceOutlinedIcon
                        style={{ fontSize: "20px", paddingTop: "4px" }}
                      />
                      <Link href="/forgot-password" className="custom-link">
                        <Typography variant="caption">Go back</Typography>
                      </Link>
                    </Grid> */}
                  </Grid>
                </Form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
