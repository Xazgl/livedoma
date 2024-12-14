

export const getStyles = (theme: string) => ({
  textField: {
    color: theme === "dark" ? "white" : "black",
    "& .MuiInputBase-root": {
      borderRadius: "20px",
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
        borderRight: 'none !important', 
        borderRadius: '20px 0 0 20px !important'
      },
      "&:hover fieldset": {
        // borderColor: theme === "dark" ? "white" : "#3a3f4635",
        borderColor: theme === "dark" ? "#e5e7ebb0" : "#3a3f467d",
      },
      "&.Mui-focused fieldset": {
        // borderColor: theme === "dark" ? "white" : "#3a3f4635",
        border: `1px solid ${
          theme === "dark" ? "#e5e7ebb0" : "#3a3f467d"
        }`
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
