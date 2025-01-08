import { checkTheme } from "@/shared/utils";

export const styleForTableManager = (theme: string) => ({
  root: {
    height: "100%",
    padding: "5px",
    backgroundColor: "transparent",
    color: checkTheme(theme, "#ffffff", "#000000"),
    "--DataGrid-containerBackground": "transparent",
    "& .MuiDataGrid-columnSeparator": {
      display: "none",
    },
    "& .MuiDataGrid-columnHeaders": {
      fontSize: "17px",
      fontWeight: "bold",
      color: checkTheme(theme, "#ffffff", "#000000"),
      backgroundColor: "transparent",
    },
    "& .MuiDataGrid-row": {
      backgroundColor: "var(--DataGrid-containerBackground)", 
      "&:hover": {
        backgroundColor: checkTheme(theme, "#4a4f567a", "#f0f0f0"),
      },
    },
    "& .MuiDataGrid-cell": {
      fontSize: "16px",
      color: checkTheme(theme, "#ffffff", "#000000"),
    },
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: "transparent",
    },
    "& .MuiDataGrid-footerContainer": {
      backgroundColor: "transparent",
    },
    "& .MuiTablePagination-root": {
      color: checkTheme(theme, "#ffffff", "#000000"), 
    },
    "& .MuiTablePagination-select": {
      color: checkTheme(theme, "#ffffff", "#000000"), 
    },
    "& .MuiTablePagination-selectIcon": {
      color: checkTheme(theme, "#ffffff", "#000000"), 
    },
    "& .MuiTablePagination-actions button": {
      color: checkTheme(theme, "#ffffff", "#000000"), 
    },
    "& .MuiDataGrid-menuIcon button": {
      color: checkTheme(theme, "#ffffff", "#000000"), 
    },
    "& .MuiDataGrid-menuIcon svg path": {
      fill: checkTheme(theme, "#ffffff", "#000000"), 
    },
    "& .MuiDataGrid-menuIcon button:hover": {
      color: checkTheme(theme, "#ffffff", "#000000"), 
    },
    "& .MuiDataGrid-menuIcon svg path:hover": {
      fill: checkTheme(theme, "#ffffff", "#000000"),
    },
  },
});