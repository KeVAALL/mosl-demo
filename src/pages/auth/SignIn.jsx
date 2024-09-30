import React, { useRef, useState } from "react";
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
  Stack,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { BootstrapInput } from "../../utils/Input/textfield";
import { useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import LoadingButton from "@mui/lab/LoadingButton";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ApiService } from "../../utils/api/apiCall";
import { setProfile } from "../../redux/slices/userSlice";
import { setMenu } from "../../redux/slices/menuSlice";
import "./auth.css";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import mainLogo from "../../assets/img/mosl-main-logo.png";
import { encryptData } from "../../utils/encryption";

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    email: "",
    password: "",
  });
  const [loginAttempt, setLoginAttempt] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [verifyPin, setVerifyPin] = useState("");
  const [user, setUser] = useState(null);
  const [initialUrl, setInitialUrl] = useState("");
  const [userMenu, setUserMenu] = useState(null);
  const length = 4;
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    // .min(8, "Password must be at least 8 characters long")
    // .matches(/[0-9]/, "Password must contain at least 1 numeric character")
    // .matches(
    //   /[!@#$%^&*(),.?":{}|<>]/,
    //   "Password must contain at least 1 special character"
    // )
  });
  const handleSubmit = async (values) => {
    console.log(values);
    // setShowPin(true);

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
          // const firstURL = result?.data?.data?.menu[0]?.menu_url;
          setInitialValues(values);
          setVerifyPin(result?.data?.data?.user_pin);
          setInitialUrl(result?.data?.data?.menu[0]?.menu_url);
          const apiResponse = {
            userProfile: result?.data?.data,
            token: result?.data?.data?.token?.access_token,
          };
          setUser(apiResponse);
          // dispatch(setProfile(apiResponse));
          const apiMenu = { menu: result?.data?.data?.menu };
          setUserMenu(apiMenu);
          // dispatch(setMenu(apiMenu));
          setShowPin(true);
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
  const handleChange = (index, e) => {
    const value = e.target.value;
    // if (isNaN(value) || isOtpExpired) return;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Allow only one input
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Submit trigger
    // const combinedOtp = newOtp.join("");
    // if (combinedOtp.length === length) onOtpSubmit(combinedOtp);

    // Move to next input if current field is filled
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1);

    // Optional
    if (index > 0 && !otp[index] && !otp[index - 1]) {
      inputRefs.current[otp.indexOf("")].focus();
    }
  };
  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      // Move focus to the previous input field on backspace
      inputRefs.current[index - 1].focus();
    }
  };
  function handlePaste(e, index) {
    e.preventDefault();

    const pastedOtp = e.clipboardData.getData("text").trim();

    if (/^\d+$/.test(pastedOtp)) {
      if (pastedOtp.length === length) {
        const otpDigits = pastedOtp.split("");

        setOtp(otpDigits);

        if (index < length - 1) {
          inputRefs.current[length - 1].focus();
        }
      } else {
        toast("Please enter exactly 6 digits for the OTP", {
          icon: "⚠️",
          iconTheme: {
            primary: "#FFA500",
            secondary: "#000000",
          },
          style: {
            borderRadius: "10px",
            background: "#FFA500",
            color: "#fff",
          },
        });
      }
    } else {
      toast("Please enter only numeric characters for the OTP", {
        icon: "⚠️",
        iconTheme: {
          primary: "#FFA500",
          secondary: "#000000",
        },
        style: {
          borderRadius: "10px",
          background: "#FFA500",
          color: "#fff",
        },
      });
    }
  }

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
        {showPin ? (
          <Grid
            container
            spacing={1}
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
              position: "relative",
            }}
          >
            <KeyboardBackspaceIcon
              style={{
                color: "white",
                position: "absolute",
                left: "16px",
                top: "16px",
              }}
              onClick={() => {
                setShowPin(false);
              }}
            />
            <Grid item xs={12} mb={1} className="pt-0">
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Submitted OTP:", otp);
                  console.log(otp.join("") === verifyPin);

                  if (otp.join("") === verifyPin) {
                    toast.success("Login successful!");

                    navigate(`/home/${initialUrl ? initialUrl : ""}`);

                    dispatch(setProfile(user));

                    dispatch(setMenu(userMenu));
                  } else {
                    toast.error("Invalid OTP");
                  }
                }}
              >
                <Grid item xs={12}>
                  <Stack alignItems="center" color="white">
                    <Typography variant="body1">
                      Authenticate Yourself
                    </Typography>
                    <Typography variant="caption">Enter OTP</Typography>
                    <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
                      {otp.map((value, index) => (
                        <input
                          key={index}
                          type="tel"
                          ref={(input) => (inputRefs.current[index] = input)}
                          value={value}
                          onPaste={(e) => handlePaste(e, index)}
                          onChange={(e) => handleChange(index, e)}
                          onClick={() => handleClick(index)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          style={{
                            width: "50px",
                            height: "50px",
                            backgroundColor: "white",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            textAlign: "center",
                            color: "black",
                          }}
                        />
                      ))}
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mt: 4,
                      flexDirection: { xs: "column-reverse", md: "row" },
                    }}
                  >
                    <LoadingButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 1, mb: 1, backgroundColor: "primary.main" }}
                      disabled={otp.some((field) => field === "")}
                    >
                      Verify
                    </LoadingButton>
                  </Box>
                </Grid>
              </form>
            </Grid>
          </Grid>
        ) : (
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
                enableReinitialize
                initialValues={initialValues}
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
                      <Grid item xs={6} alignItems="flex-end">
                        <Link href="/forgot-password" className="custom-link">
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
                            disabled={loginAttempt}
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                              mt: 1,
                              mb: 1,
                              backgroundColor: "primary.main",
                            }}
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
        )}
      </Container>
    </Box>
    // </AuthWrapper>
  );
}

/* <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        // onOtpSubmit(detail, otp.join(""));
                      }}
                    >
                      <OtpInput
                        otp={otp}
                        setOtp={setOtp}
                        onOtpSubmit={() => {}}
                        // resendOtp={handleResendOTP}
                        // detail={otpOwner}
                      />
                    </form> */
/* <TextField
                        variant="outlined"
                        fullWidth
                        size="small"
                        id="email"
                        label="Email"
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
                        label="Email"
                        name="email"
                        placeholder="Email"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      /> */
// }
