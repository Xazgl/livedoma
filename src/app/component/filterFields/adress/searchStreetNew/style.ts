

export const getStyles = (theme: string) => ({
  textField: {
    color: theme === "dark" ? "white" : "black",
    "& .MuiInputBase-root": {
      borderRadius: "5px",
      bgcolor: theme === "dark" ? "#3a3f467a" : "white",
      color: theme === "dark" ? "white" : "black",
    },
    "& .MuiInputBase-input": {
      color: theme === "dark" ? "white" : "black",
    },
    "& .MuiInputLabel-root": {
      color: theme === "dark" ? "white" : "black",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: theme === "dark" ? "#e5e7ebb0" : "#3a3f467d",
      },
      "&:hover fieldset": {
        borderColor: theme === "dark" ? "white" : "#3a3f4635",
      },
      "&.Mui-focused fieldset": {
        borderColor: theme === "dark" ? "white" : "#3a3f4635",
      },
    },
  },
  autocomplete: {
    borderRadius: "10px",
    width: "100%",
    border: "none",
    bgcolor: theme === "dark" ? "#3a3f467a" : "white",
    color: theme === "dark" ? "white" : "black",
    "& .MuiAutocomplete-popupIndicator": {
      display: "none",
    },
    "& .MuiAutocomplete-paper": {
      maxHeight: "50px !important",
      overflowY: "auto",
    },
    "& .MuiAutocomplete-listbox": {
      maxHeight: "50px !important",
      overflowY: "auto",
    },
    "& .MuiAutocomplete-clearIndicator": {
      color: theme === "dark" ? "white" : "black",
    },
    "& .MuiAutocomplete-noOptions": {
      color: theme === "dark" ? "white" : "black",
    },
  },
});
