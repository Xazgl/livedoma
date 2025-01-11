"use client";
import React from "react";
import { Button } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FilterUserOptions } from "../../../../../@types/dto";
import { Dispatch, SetStateAction } from "react";
import { useTheme } from "../../provider/ThemeProvider";

type Props = {
  currentFilter: FilterUserOptions;
  setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
  resetPageAndReloadData: () => void;
};

export function SortPriceSelect({
  currentFilter,
  setCurrentFilter,
  resetPageAndReloadData,
}: Props) {
  const { theme } = useTheme();

  const toggleSortOrder = () => {
    const newSortOrder = currentFilter.sortOrder?.[0] === "desc" ? ["asc"] : ["desc"];
    setCurrentFilter((prevFilterState) => ({
      ...prevFilterState,
      sortOrder: newSortOrder,
      sortPrice: [],
    }));
    resetPageAndReloadData();
  };

  return (
    <div className="flex w-auto h-20px">
      <Button
        sx={{
          display: "flex",
          color:
            theme === "dark"
              ? currentFilter.sortOrder && currentFilter.sortOrder[0] === "desc"
                ? "rgba(255, 255, 255, 0.5)"
                : "#FFFFFF"
              : currentFilter.sortOrder && currentFilter.sortOrder[0] === "desc"
              ? "rgba(84, 82, 159, 0.5)"
              : "black",
          fontFamily: "bold",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "10px",
          height: "10px",
          "&:hover": {
            backgroundColor: "transparent",
          },
          "@media (max-width: 1100px)": {
            color:
              theme === "dark"
                ? currentFilter.sortOrder && currentFilter.sortOrder[0] === "desc"
                  ? "rgba(255, 255, 255, 0.5)"
                  : "#FFFFFF"
                : currentFilter.sortOrder && currentFilter.sortOrder[0] === "desc"
                ? "#0000007a"
                : "black",
            fontSize: "12px",
          },
        }}
        onClick={toggleSortOrder}
        disableRipple
      >
        Дата{" "}
        {currentFilter.sortOrder?.[0] === "desc" ? (
          <ExpandMoreIcon sx={{ fontSize: "20px" }} />
        ) : (
          <ExpandLessIcon sx={{ fontSize: "20px" }} />
        )}
      </Button>
    </div>
  );
}



// "use client";
// import React, { useState } from "react";
// import {
//   Button,
//   Menu,
//   MenuItem,
//   FormControlLabel,
//   Switch,
// } from "@mui/material";
// import { FilterUserOptions } from "../../../../../@types/dto";
// import { Dispatch, SetStateAction } from "react";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { useTheme } from "../../provider/ThemeProvider";

// type Props = {
//   currentFilter: FilterUserOptions;
//   setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
//   resetPageAndReloadData: () => void;
// };

// export function SortPriceSelect({
//   currentFilter,
//   setCurrentFilter,
//   resetPageAndReloadData,
// }: Props) {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);
//   const { theme } = useTheme();

//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleSortOrderChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const sortOrder = event.target.checked ? ["desc"] : ["asc"];
//     setCurrentFilter((prevFilterState) => ({
//       ...prevFilterState,
//       sortOrder,
//       sortPrice: [],
//     }));
//     resetPageAndReloadData();
//     handleClose();
//   };

//   return (
//     <div className="flex  w-[auto] h-[20px]">
//       <Button
//         sx={{
//           display: "flex",
//           color:
//             theme === "dark"
//               ? currentFilter.sortPrice && currentFilter.sortPrice.length > 0
//                 ? "rgba(255, 255, 255, 0.5)"
//                 : "#FFFFFF"
//               : currentFilter.sortPrice && currentFilter.sortPrice.length > 0
//               ? "rgba(84, 82, 159, 0.5)"
//               : "black",
//           fontFamily: "bold",
//           justifyContent: "center",
//           alignItems: "center",
//           fontSize: "10px",
//           height: "10px",
//           "&:hover": {
//             backgroundColor: "transparent",
//           },
//           "@media (max-width: 1100px)": {
//             color:
//               theme === "dark"
//                 ? currentFilter.sortPrice && currentFilter.sortPrice.length > 0
//                   ? "rgba(255, 255, 255, 0.5)"
//                   : "#FFFFFF"
//                 : currentFilter.sortPrice && currentFilter.sortPrice.length > 0
//                 ? "#0000007a"
//                 : "black",
//             fontSize: "12px",
//           },
//         }}
//         aria-controls={open ? "sort-date-menu" : undefined}
//         aria-haspopup="true"
//         aria-expanded={open ? "true" : undefined}
//         onClick={handleClick}
//         disableRipple
//       >
//         Дата{" "}
//         {currentFilter.sortOrder?.[0] === "desc" ? (
//           <ExpandMoreIcon sx={{ fontSize: "20px" }} />
//         ) : (
//           <ExpandLessIcon sx={{ fontSize: "20px" }} />
//         )}
//       </Button>

//       <Menu
//         id="sort-date-menu"
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         MenuListProps={{
//           "aria-labelledby": "sort-date-button",
//         }}
//       >
//         <MenuItem
//           sx={{
//             "&:hover": {
//               backgroundColor: "transparent",
//             },
//           }}
//         >
//           <div className="flex flex-col w-full gap-[2px] h-full">
//             <FormControlLabel
//               sx={{ fontSize: "14px" }}
//               control={
//                 <Switch
//                   checked={currentFilter.sortOrder?.[0] === "desc"}
//                   onChange={handleSortOrderChange}
//                   color="secondary"
//                   sx={{
//                     "& .MuiSwitch-switchBase:hover": {
//                       backgroundColor: "transparent",
//                     },
//                     "& .MuiSwitch-switchBase:active": {
//                       backgroundColor: "transparent",
//                     },
//                     "& .MuiSwitch-switchBase.Mui-checked": {
//                       color: "#54529F",
//                     },
//                     "& .MuiSwitch-track": {
//                       backgroundColor: "#54529F",
//                     },
//                     "& .MuiSwitch-thumb": {
//                       backgroundColor: "#54529F",
//                     },
//                   }}
//                 />
//               }
//               label={
//                 currentFilter.sortOrder?.[0] === "desc"
//                   ? "По убыванию"
//                   : "По возрастанию"
//               }
//             />
//           </div>
//         </MenuItem>
//       </Menu>
//     </div>
//   );
// }
