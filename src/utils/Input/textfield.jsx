import { colors, InputBase, TextField } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers";

export const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: "#fff",
    // backgroundColor: theme.palette.mode === "light" ? "#F3F6F9" : "#1A2027",
    border: "1px solid",
    borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
    fontSize: 14,
    padding: "8px 12px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    fontFamily: '"Poppins", sans-serif',
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.1rem`,
      borderColor: theme.palette.primary.main,
    },
  },
  "& .MuiInputAdornment-root": {
    position: "absolute",
    color: colors.grey[400],
    top: 18,
    right: 15, // Adjust position as required
  },
  "& .MuiInputBase-input:-webkit-autofill": {
    backgroundColor: "#F3F6F9 !important", // Ensure background color is white
    color: "#000 !important", // Ensure text color remains visible
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: "#fff",
    border: "1px solid",
    borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
    fontSize: 14,
    // padding: "8px 12px !important",
    // height: "37px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    fontFamily: '"Poppins", sans-serif',
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.1rem`,
      borderColor: theme.palette.primary.main,
    },
  },
  // "& .MuiInputBase-input": {
  //   padding: "8px 12px", // Adjust the padding to match the BootstrapInput
  //   // height: "auto", // Ensure height matches the input height
  //   height: "37px",
  // },
  "& .MuiInputAdornment-root": {
    position: "absolute",
    color: theme.palette.grey[400],
    top: 18,
    right: 15,
  },
  "& .MuiInputBase-input:-webkit-autofill": {
    backgroundColor: "#F3F6F9 !important",
    color: "#000 !important",
  },
}));

export const StyledDatePicker = (props) => {
  return (
    <DatePicker
      {...props}
      renderInput={(params) => (
        <StyledTextField
          InputLabelProps={{
            shrink: true,
          }}
          {...params}
        />
      )}
    />
  );
};
