"use client";

import {
  Autocomplete,
  TextField,
  AutocompleteRenderInputParams,
  Button,
} from "@mui/material";
import { useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "../../../provider/ThemeProvider";
import "./style.css";
import { Props } from "./type";
import { getStyles } from "./style";
import {
  createFilterOptions,
  useSyncStreetValue,
  useThemeEffect,
} from "./utils";
import React from "react";


const StreetSelectBig: React.FC<Props> = ({
  filteblackProps,
  currentFilter,
  setCurrentFilter,
  resetPageAndReloadData,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  // Подключение хука для синхронизации значения улицы
  useSyncStreetValue(currentFilter.street, setSelectedValue, setInputValue);
  useThemeEffect(theme);

  const handleChange = (event: React.ChangeEvent<{}>, value: string | null) => {
    const trimmedValue = value ? value.trim() : null;
    setSelectedValue(trimmedValue);
    setCurrentFilter((prevFilterState) => ({
      ...prevFilterState,
      street: trimmedValue ? [trimmedValue] : undefined,
    }));
    resetPageAndReloadData();

  };

  const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
    setInputValue(value);
  };

  const handleSearchButtonClick = () => {
    handleChange({} as React.ChangeEvent<{}>, inputValue);
  };

  const filterOptions = useMemo(() => {
    return createFilterOptions(filteblackProps.streets || []);
  }, [filteblackProps.streets]);


  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      sx={styles.textField}
      label={
        <span className={` ${theme === "dark" ? "text-white" : "text-black"}`}>
          <SearchIcon sx={{ color: theme === "dark" ? "white" : "black" }} />{" "}
          Поиск
        </span>
      }
      // InputProps={{
      //   ...params.InputProps,
      //   endAdornment: isInputChanged ? (
      //     <CloseIcon  onClick={handleClearSearch} className={` ${theme === "dark" ? "text-white" : "text-black"}`}/>
      //   ) :<CloseIcon  onClick={handleClearSearch} className={` ${theme === "dark" ? "text-white" : "text-black"}`}/>
      // }}
    />
  );

  return (
    <>
      <Autocomplete
        sx={styles.autocomplete}
        options={filteblackProps.streets || []}
        value={selectedValue}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        renderInput={renderInput}
        filterOptions={filterOptions}
        isOptionEqualToValue={(option, value) =>
          option.toLowerCase() === (value || "").toLowerCase()
        }
        noOptionsText={
          inputValue === "" ? "Напишите адрес" : "Объекты по адресу не найдены"
        }
      />
      <Button
        sx={{
          width:'10%',
          padding:'2px',
          borderLeft: "none !important",
          borderRadius: "0px 20px 20px 0px !important",
          border:`1px solid ${ theme === "dark" ? "#e5e7ebb0" : "#3a3f467d"}`
          
        }}
        onMouseDown={handleSearchButtonClick}
        className={`text-[12px]  md:text-[16px] ${theme === "dark" ? "text-white" : "text-black"}`}
      >
        {"Найти "}
      </Button>
    </>
  );
};

export default React.memo(StreetSelectBig);

// const StreetSelectBig: React.FC<Props> = ({
//   filteblackProps,
//   currentFilter,
//   setCurrentFilter,
//   resetPageAndReloadData,
// }) => {
//   const { theme } = useTheme();
//   const styles = getStyles(theme);
//   const [inputValue, setInputValue] = useState<string>("");
//   const [selectedValue, setSelectedValue] = useState<string | null>(null);
//   const textFieldRef = useRef<HTMLInputElement | null>(null);

//   useSyncStreetValue(currentFilter.street, setSelectedValue, setInputValue);
//   useThemeEffect(theme);

//   const handleChange = (event: React.ChangeEvent<{}>, value: string | null) => {
//     const trimmedValue = value ? value.trim() : null;
//     setSelectedValue(trimmedValue);
//     setCurrentFilter((prevFilterState) => ({
//       ...prevFilterState,
//       street: trimmedValue ? [trimmedValue] : undefined,
//     }));
//     resetPageAndReloadData();
//   };

//   const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
//     setInputValue(value);
//   };

//   const handleSearchButtonClick = () => {
//     handleChange({} as React.ChangeEvent<{}>, inputValue);
//     textFieldRef.current?.blur();
//   };

//   const handleClearSearch = () => {
//     setInputValue("");
//     setSelectedValue(null);
//     setCurrentFilter((prevFilterState) => ({
//       ...prevFilterState,
//       street: [],
//     }));
//   };

//   const filterOptions = useMemo(() => {
//     return createFilterOptions(filteblackProps.streets || []);
//   }, [filteblackProps.streets]);

//   const renderInput = (params: AutocompleteRenderInputParams) => (
//     <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
//       <TextField
//         {...params}
//         inputRef={textFieldRef}
//         sx={{
//           ...styles.textField,
//           flex: 9,
//           "& .MuiInputBase-root": {
//             position: "relative",
//           },
//         }}
//         onFocus={(e) => {
//           if (inputValue.trim()) {
//             const clearIcon = document.getElementById("clear-icon");
//             if (clearIcon) clearIcon.style.display = "block";
//           }
//         }}
//         onBlur={() => {
//           const clearIcon = document.getElementById("clear-icon");
//           if (clearIcon) clearIcon.style.display = "none";
//         }}
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         placeholder="Поиск..."
//         InputProps={{
//           ...params.InputProps,
//           endAdornment: inputValue.trim() ? (
//             <ClearIcon
//               id="clear-icon"
//               sx={{
//                 cursor: "pointer",
//                 display: "none",
//                 position: "absolute",
//                 right: "10px",
//               }}
//               onClick={handleClearSearch}
//             />
//           ) : null,
//         }}
//       />
//       <Button
//         onClick={handleSearchButtonClick}
//         disabled={!inputValue.trim()}
//         sx={{
//           flex: 1,
//           cursor:'pointer',
//           marginLeft: "5px",
//           height: "56px",
//           color: theme === "dark" ? "white" : "black",
//         }}
//       >
//         Найти
//       </Button>
//     </div>
//   );

//   return (
//     <Autocomplete
//       sx={styles.autocomplete}
//       options={filteblackProps.streets || []}
//       value={selectedValue}
//       onChange={handleChange}
//       inputValue={inputValue}
//       onInputChange={handleInputChange}
//       renderInput={renderInput}
//       filterOptions={filterOptions}
//       isOptionEqualToValue={(option, value) =>
//         option.toLowerCase() === (value || "").toLowerCase()
//       }
//       noOptionsText={
//         inputValue === "" ? "Напишите адрес" : "Объекты по адресу не найдены"
//       }
//     />
//   );
// };

// export default React.memo(StreetSelectBig);

//OLD
// "use client";

// import {
//   Autocomplete,
//   TextField,
//   AutocompleteRenderInputParams,
//   FilterOptionsState,
//   debounce,
// } from "@mui/material";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import SearchIcon from "@mui/icons-material/Search";
// import { useTheme } from "../../../provider/ThemeProvider";
// import "./style.css";
// import { Props } from "./type";
// import { getStyles } from "./style";
// import { createFilterOptions, useSyncStreetValue, useThemeEffect } from "./utils";
// import React from "react";

// const StreetSelectBig: React.FC<Props> = ({
//   filteblackProps,
//   currentFilter,
//   setCurrentFilter,
//   resetPageAndReloadData,
// }) => {
//   const { theme } = useTheme();
//   const styles = getStyles(theme);
//   const [inputValue, setInputValue] = useState<string>("");
//   const [selectedValue, setSelectedValue] = useState<string | null>(null);

//   // Подключение хука для синхронизации значения улицы
//   useSyncStreetValue(currentFilter.street, setSelectedValue, setInputValue);

//   // Подключение хука для управления темой
//   useThemeEffect(theme);

//   const handleChange = (event: React.ChangeEvent<{}>, value: string | null) => {
//     console.log('запрос на сервер')
//     const trimmedValue = value ? value.trim() : null;
//     setSelectedValue(trimmedValue);
//     setCurrentFilter((prevFilterState) => ({
//       ...prevFilterState,
//       street: trimmedValue ? [trimmedValue] : undefined,
//     }));
//     resetPageAndReloadData();
//   };

//   const handleDebouncedChange = useCallback(
//     debounce((event,value) => {
//       handleChange(event,value)
//       console.log('запрос на сервер с задержкой')
//     }, 1000), // Задержка в 500 мс
//     []
//   );

//   const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
//     console.log('f')
//     setInputValue(value);
//     handleDebouncedChange(event,value);
//   };

//   // Использование функции для создания фильтра
//   const filterOptions = useMemo(() => {
//     return createFilterOptions(filteblackProps.streets || []);
//   }, [filteblackProps.streets]);

//   const renderInput = (params: AutocompleteRenderInputParams) => (
//     <TextField
//       {...params}
//       sx={styles.textField}
//       label={
//         <span className={` ${theme === "dark" ? "text-white" : "text-black"}`}>
//           <SearchIcon sx={{ color: theme === "dark" ? "white" : "black" }} />{" "}
//           Поиск
//         </span>
//       }
//     />
//   );

//   return (
//     <Autocomplete
//       sx={styles.autocomplete}
//       options={filteblackProps.streets || []}
//       value={selectedValue}
//       onChange={handleChange}
//       inputValue={inputValue}
//       onInputChange={handleInputChange}
//       renderInput={renderInput}
//       filterOptions={filterOptions}
//       isOptionEqualToValue={(option, value) =>
//         option.toLowerCase() === (value || "").toLowerCase()
//       }
//       noOptionsText={
//         inputValue === "" ? "Напишите адрес" : "Объекты по адресу не найдены"
//       }
//     />
//   );
// }

// export default React.memo(StreetSelectBig);
