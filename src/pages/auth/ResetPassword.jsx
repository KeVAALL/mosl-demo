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
import { Email, Visibility, VisibilityOff } from "@mui/icons-material";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import { BootstrapInput } from "../../utils/Input/textfield";
import LoadingButton from "@mui/lab/LoadingButton";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ApiService } from "../../utils/api/apiCall";
import { setProfile } from "../../redux/slices/userSlice";
import { setMenu } from "../../redux/slices/menuSlice";
import "./auth.css";
import { decryptData } from "../../utils/encryption";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const dispatch = useDispatch();
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
    newPassword: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .required("Password is required")
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
              {({ errors, touched }) => (
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
                        <ErrorMessage
                          name="newPassword"
                          component="div"
                          className="text-error text-12 mt-5"
                        />
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
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="text-error text-12 mt-5"
                        />
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
