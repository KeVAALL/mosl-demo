import PropTypes from "prop-types";
import { useMemo } from "react";

// material-ui
import { CssBaseline, StyledEngineProvider, colors } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// ==============================|| DEFAULT THEME - MAIN  ||============================== //

export default function ThemeCustomization({ children }) {
  const theme = createTheme({
    typography: {
      fontFamily: "Poppins, sans-serif !important",
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    palette: {
      primary: {
        // main: "#000000", // Black for primary color
        main: colors.grey[900], // Black for primary color
        contrastText: "#FFFFFF", // White text on primary
      },
      secondary: {
        main: "#FFFFFF", // White for secondary color
        contrastText: "#000000", // Black text on secondary
      },
      background: {
        default: "#FFFFFF", // White background
        paper: "#FFFFFF", // White background for paper components
      },
      text: {
        primary: "#000000", // Black text
        secondary: "#FFFFFF", // White text for secondary content
        grey: colors.grey[600],
        greyLight: colors.grey[700],
        greyMidLight: colors.grey[400],
        blueGrey: colors.blueGrey[500],
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            textTransform: "capitalize",
            backgroundColor: "#000000", // Black background
            color: "#FFFFFF", // White text
            border: "1px solid #000000", // Black border
            "&:hover": {
              backgroundColor: "#333333", // Slightly lighter black on hover
            },
          },
          outlined: {
            textTransform: "capitalize",
            backgroundColor: "#FFFFFF", // White background
            color: "#616161", // Black text
            border: "1px solid #e0e0e0", // Border color
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.12)", // Subtle box shadow
            "&:hover": {
              backgroundColor: "#f5f5f5", // Slightly off-white on hover
            },
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            fontSize: "14px", // Adjust font size
            color: "#000000", // Adjust text color
          },
          secondary: {
            fontSize: "14px", // Adjust secondary text font size
            color: "#888888", // Adjust secondary text color
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            height: "100%", // Ensure the input inside the TextField matches the height
          },
          input: {
            "&::placeholder": {
              fontSize: "13px", // Set the desired font size for the placeholder
              opacity: 0.5, // Optional: Adjust opacity if needed
              color: "grey",
            },
            "&:focus::placeholder": {
              opacity: 0.5, // Ensure the placeholder is visible on focus
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontFamily: "Poppins, sans-serif !important", // Custom font family
            fontSize: "12px", // Adjust font size if needed
            backgroundColor: "#333333", // Custom background color
            color: "#ffffff", // Custom text color
          },
          arrow: {
            color: "#333333",
          },
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            padding: 8, // Adjust the padding around the radio button
            "& .MuiSvgIcon-root": {
              fontSize: "1.2rem !important", // Adjust the size of the radio button icon
            },
          },
        },
      },
      // MuiTableHead: {
      //   styleOverrides: {
      //     root: {
      //       fontSize: 14,
      //     },
      //   },
      // },
    },
    // MuiInputLabel: {
    //   styleOverrides: {
    //     root: {
    //       color: "#000000", // Default color for the label
    //       "&.Mui-focused": {
    //         color: "#000000", // Color when the input is focused
    //       },
    //       "&.Mui-disabled": {
    //         color: "#000000", // Color when the input is disabled
    //       },
    //       "&.MuiFormLabel-filled": {
    //         color: "#000000", // Color when the input is filled
    //       },
    //     },
    //   },
    // },
    // You can add other theme customizations here
  });

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
ThemeCustomization.propTypes = {
  children: PropTypes.node,
};

// MuiButton: {
//   styleOverrides: {
// root: {
//   // backgroundColor: "#000000", // Default button background
//   backgroundColor: colors.grey[900], // Default button background
//   color: "#FFFFFF", // Default button text color
//   height: "30px",
//   textTransform: "capitalize",
//   "&:hover": {
//     backgroundColor: "#333333", // Darker black on hover
//   },
// },
