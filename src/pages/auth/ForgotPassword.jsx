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
import { Link, useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ApiService } from "../../utils/api/apiCall";
import { setProfile } from "../../redux/slices/userSlice";
import { setMenu } from "../../redux/slices/menuSlice";
import "./auth.css";
import { encryptData } from "../../utils/encryption";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginAttempt, setLoginAttempt] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "email@gmalil.com",
  });
  const handleSubmit = async (values) => {
    console.log(values);

    try {
      setLoginAttempt(true);
      const result = await ApiService(values, "user/forgotPassword");
      if (result) {
        console.log(result);

        if (result?.data?.result_flag) {
          navigate("/reset-password");
          localStorage.setItem("resetEmail", encryptData("email@gmalil.com"));
        }
        // const apiResponse = {
        //   userProfile: result?.data?.data,
        //   token: result?.data?.data?.token?.access_token,
        // };
        // dispatch(setProfile(apiResponse));

        // const apiMenu = { menu: result?.data?.data?.menu };
        // dispatch(setMenu(apiMenu));

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
                          Submit
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
  );
}
