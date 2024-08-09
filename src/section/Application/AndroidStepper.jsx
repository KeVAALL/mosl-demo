/* eslint-disable react/prop-types */
import React from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Stack,
  IconButton,
} from "@mui/material";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { BootstrapInput } from "../../utils/Input/textfield"; // Make sure to import your styled BootstrapInput

const steps = [
  {
    label: "Step 1",
    description: `Step 1 description.`,
  },
  {
    label: "Step 2",
    description: "Step 2 description.",
  },
  {
    label: "Step 3",
    description: `Step 3 description.`,
  },
];

export default function AndroidStepper({ handleClose }) {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Grid container spacing={3} mb={1}>
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
              Add your Android App
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
      </Grid>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <Grid container spacing={3} mt={1}>
                <Grid
                  item
                  xs={12}
                  component="form"
                  direction="column"
                  onSubmit={() => {}}
                  noValidate
                  sx={{ width: "100%" }}
                >
                  <FormControl variant="standard" fullWidth>
                    <InputLabel
                      shrink
                      htmlFor="name"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Typography variant="body1" className="input-label">
                        Android Package Name
                      </Typography>
                      <span style={{ color: "red", marginLeft: "0.25rem" }}>
                        *
                      </span>
                    </InputLabel>
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
                    <InputLabel
                      shrink
                      htmlFor="nickname"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Typography variant="body1" className="input-label">
                        Android Nickname
                      </Typography>
                      <span style={{ color: "red", marginLeft: "0.25rem" }}>
                        *
                      </span>
                    </InputLabel>
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
                    <InputLabel
                      shrink
                      htmlFor="certificate"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Typography variant="body1" className="input-label">
                        Debug signing certificate SHA-1
                      </Typography>
                      <span style={{ color: "red", marginLeft: "0.25rem" }}>
                        *
                      </span>
                    </InputLabel>
                    <BootstrapInput
                      fullWidth
                      id="certificate"
                      size="small"
                      name="certificate"
                      placeholder="00:00:00:00:00:00"
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ mb: 2 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.length - 1 ? "Finish" : "Continue"}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Back
                      </Button>
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}
