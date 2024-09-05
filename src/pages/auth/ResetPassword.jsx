import { useState } from "react";
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
  Link,
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import { BootstrapInput } from "../../utils/Input/textfield";
import LoadingButton from "@mui/lab/LoadingButton";
import mainLogo from "../../assets/img/mosl-main-logo.png";
import { toast } from "react-toastify";
import { ApiService } from "../../utils/api/apiCall";
import "./auth.css";
import { decryptData } from "../../utils/encryption";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [loginAttempt, setLoginAttempt] = useState(false);
  const resetEmail = decryptData(localStorage.getItem("resetEmail"));
  const handleSubmit = async (values) => {
    console.log({ email: resetEmail, password: values?.newPassword });

    const reqdata = { email: resetEmail, password: values?.newPassword };

    try {
      setLoginAttempt(true);
      const result = await ApiService(reqdata, "user/updatePassword");
      if (result) {
        console.log(result?.data?.data);

        if (result?.data?.result_flag) {
          toast.success(`Password Updated for ${resetEmail}`);
          navigate("/sign-in");
          localStorage.removeItem("resetEmail");
        }

        return result;
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoginAttempt(false);
    }
  };
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(/[0-9]/, "Password must contain at least 1 numeric character")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least 1 special character"
      )
      .required("New Password is required"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .test(
        "confirmPassword",
        "Both Password should match!",
        (confirmPassword, yup) => yup.parent.newPassword === confirmPassword
      ),
  });

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
                  height: "100%",
                  width: "150px",
                }}
              />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Reset Password for {resetEmail}
              </Typography>
            </Stack>
          </Grid>
          <Grid container direction="column">
            <Formik
              initialValues={{ newPassword: "", confirmPassword: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, errors, touched }) => (
                <Form>
                  <Grid container spacing={2} direction="column">
                    <Grid item xs={12}>
                      <FormControl variant="standard" fullWidth>
                        <Typography className="label d-flex items-center">
                          New Password
                          <sup className="asc">*</sup>
                        </Typography>
                        <Field name="newPassword">
                          {({ field }) => (
                            <BootstrapInput
                              {...field}
                              id="newPassword"
                              placeholder="Password"
                              type={showNewPassword ? "text" : "password"}
                              fullWidth
                              size="small"
                              InputLabelProps={{ shrink: true }}
                              onChange={async (e) => {
                                const value = e.target.value;
                                const regex = /^\S+$/;

                                if (!value || regex.test(value.toString())) {
                                  setFieldValue("newPassword", value);
                                } else {
                                  return;
                                }
                              }}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowNewPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseDownPassword}
                                    edge="end"
                                  >
                                    {showNewPassword ? (
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
                        {/* <ErrorMessage
                          name="newPassword"
                          component="div"
                          className="text-error text-12 mt-5"
                        /> */}
                        <ErrorMessage name="newPassword">
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
                          Confirm Password
                          <sup className="asc">*</sup>
                        </Typography>
                        <Field name="confirmPassword">
                          {({ field }) => (
                            <BootstrapInput
                              {...field}
                              id="confirmPassword"
                              placeholder="Password"
                              type={showConfirmPassword ? "text" : "password"}
                              fullWidth
                              size="small"
                              InputLabelProps={{ shrink: true }}
                              onChange={async (e) => {
                                const value = e.target.value;
                                const regex = /^\S+$/;

                                if (!value || regex.test(value.toString())) {
                                  setFieldValue("confirmPassword", value);
                                } else {
                                  return;
                                }
                              }}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowConfirmPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseDownPassword}
                                    edge="end"
                                  >
                                    {showConfirmPassword ? (
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
                        <ErrorMessage name="confirmPassword">
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
                          Reset Password
                        </LoadingButton>
                      </Box>
                    </Grid>
                    <Grid
                      item
                      md={3}
                      xs={6}
                      component={Stack}
                      flexDirection="row"
                      alignItems="center"
                      gap={0.5}
                    >
                      <KeyboardBackspaceOutlinedIcon
                        style={{ fontSize: "20px", paddingTop: "4px" }}
                      />
                      <Link href="/sign-in" className="custom-link">
                        <Typography variant="caption">Go back</Typography>
                      </Link>
                    </Grid>
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
