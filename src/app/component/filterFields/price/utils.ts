
export const useStylesMy = (theme: string) => ({
  textField: {
    width: "100%",
    paddingRight: "2px",
    paddingLeft: "2px",
    "& .MuiInputBase-input": {
      color: theme === "dark" ? "white" : "black",
    },
    "& .MuiInputLabel-root": {
      color: theme === "dark" ? "white" : "black",
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: theme === "dark" ? "white" : "black",
      borderBottomWidth: 1,
    },
    "& .MuiInput-underline:hover:before": {
      borderBottomColor: theme === "dark" ? "white" : "black",
      borderBottomWidth: 1,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: theme === "dark" ? "white" : "black",
      borderBottomWidth: 1,
    },
    "& .MuiInput-underline.Mui-focused:after": {
      borderBottomColor: theme === "dark" ? "white" : "black",
      borderBottomWidth: 1,
    },
  },
  currencyIcon: {
    fontSize: "14px",
    color: theme === "dark" ? "white" : "black",
  },
});
