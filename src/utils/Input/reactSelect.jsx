/* eslint-disable react/prop-types */
import Select from "react-select";

const customStyles = {
  // Style the container (e.g., remove border and box shadow)
  container: (provided) => ({
    ...provided,
    width: "100%",
  }),
  // Style the control (the main wrapper)
  control: (provided, state) => ({
    ...provided,
    border: state.isFocused ? "1px solid #212121" : "1px solid #E0E3E7",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(33, 33, 33, 0.25)" : "none",
    fontSize: "14px", // Match font size with BootstrapInput
    "&:hover": {
      border: "1px solid #212121", // Border color on hover
    },
  }),
  // Style the option (when not selected)
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#000000" : "#FFFFFF", // Black for selected, white otherwise
    color: state.isSelected ? "#FFFFFF" : "#000000", // White text for selected, black otherwise
    fontSize: "14px", // Match font size with BootstrapInput
    "&:hover": {
      backgroundColor: "#f5f5f5", // Light grey on hover
      color: "#000000", // Black text on hover
    },
  }),
  // Style the single value (the selected value displayed)
  singleValue: (provided) => ({
    ...provided,
    color: "#000", // White text for selected value
    fontSize: "14px", // Match font size with BootstrapInput
  }),
  // Style the placeholder
  placeholder: (provided) => ({
    ...provided,
    color: "#000000", // Black placeholder text
    fontSize: "14px", // Match font size with BootstrapInput
  }),
};

export function CustomSelect({ options, ...props }) {
  // console.log(props);
  return (
    <Select
      options={options}
      styles={customStyles}
      placeholder="Select an option"
      {...props}
    />
  );
}
