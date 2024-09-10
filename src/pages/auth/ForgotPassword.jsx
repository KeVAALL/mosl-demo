import { useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Field, Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FormControl, Link, Stack } from "@mui/material";
import { BootstrapInput } from "../../utils/Input/textfield";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ApiService } from "../../utils/api/apiCall";
import mainLogo from "../../assets/img/mosl-main-logo.png";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import "./auth.css";
import { encryptData } from "../../utils/encryption";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loginAttempt, setLoginAttempt] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
  });
  const handleSubmit = async (values) => {
    console.log(values);

    try {
      setLoginAttempt(true);
      const result = await ApiService(values, "user/forgotPassword");
      if (result) {
        console.log(result);

        if (result?.data?.result_flag) {
          toast.success("Please check your email for the new password.");
          localStorage.setItem("resetEmail", encryptData(values?.email));
          navigate("/reset-sign-in");
        }

        return result;
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message);
    } finally {
      setLoginAttempt(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
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
            minHeight: "300px",
            margin: "auto",
            borderRadius: "8px",
          }}
        >
          <Grid item xs={12} mb={3} className="pt-0">
            <Stack alignItems="center">
              <Stack alignItems="center">
                <img
                  src={mainLogo}
                  style={{
                    height: "80px",
                    width: "100%",
                  }}
                />
              </Stack>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Forgot Password
              </Typography>
            </Stack>
          </Grid>
          <Grid container direction="column">
            <Formik
              initialValues={formValues}
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
                        {/* <ErrorMessage
                          name="email"
                          component="div"
                          className="text-error text-12 mt-5"
                        /> */}
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
                          Submit
                        </LoadingButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Grid>
          <Stack
            flexDirection="row"
            alignItems="center"
            gap={0.5}
            sx={{ width: "100%", mt: 2 }}
          >
            <KeyboardBackspaceOutlinedIcon
              style={{ fontSize: "20px", paddingTop: "4px" }}
            />
            <Link href="/sign-in" className="custom-link">
              <Typography variant="caption">Go back</Typography>
            </Link>
          </Stack>
        </Grid>
      </Container>
    </Box>
  );
}
