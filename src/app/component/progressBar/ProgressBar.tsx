import React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { useTheme } from "../provider/ThemeProvider";

const ProgressBar = () => {
  const { theme } = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        width: "70%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LinearProgress
        variant="indeterminate"
        sx={{
          width: "100%",
          height: "10px",
          borderRadius:'5px',
          backgroundColor: theme === "dark" ? "#222" : "#f0f0f0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: theme === "dark" ? "#563D82" : "#8E44AD",
          },
        }}
      />
    </Box>
  );
};

export default React.memo(ProgressBar);

