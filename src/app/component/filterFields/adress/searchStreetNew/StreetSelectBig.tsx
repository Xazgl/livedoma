"use client";

import {
  Autocomplete,
  TextField,
  AutocompleteRenderInputParams,
  FilterOptionsState,
  IconButton,
  Button,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "../../../provider/ThemeProvider";
import "./style.css";
import { Props } from "./type";
import { getStyles } from "./style";
import { createFilterOptions, useSyncStreetValue, useThemeEffect } from "./utils";
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
  const [isInputChanged, setIsInputChanged] = useState<boolean>(false); // состояние для отслеживания изменения ввода

  // Подключение хука для синхронизации значения улицы
  useSyncStreetValue(currentFilter.street, setSelectedValue, setInputValue);

  // Подключение хука для управления темой
  useThemeEffect(theme);

  const handleChange = (event: React.ChangeEvent<{}>, value: string | null) => {
    const trimmedValue = value ? value.trim() : null;
    setSelectedValue(trimmedValue);
    setCurrentFilter((prevFilterState) => ({
      ...prevFilterState,
      street: trimmedValue ? [trimmedValue] : undefined,
    }));
    resetPageAndReloadData();
    setIsInputChanged(false); // После изменения состояния ввода скрыть кнопку
  };

  const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
    setInputValue(value);
    setIsInputChanged(value.trim().length > 0); // Показывать кнопку, если есть ввод
  };

  const handleSearchButtonClick = () => {
    // Вызываем handleChange при нажатии на кнопку
    handleChange({} as React.ChangeEvent<{}>, inputValue);
  };

  // Использование функции для создания фильтра
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
      InputProps={{
        ...params.InputProps,
        endAdornment: isInputChanged ? (
          <Button  onClick={handleSearchButtonClick} className={` ${theme === "dark" ? "text-white" : "text-black"}`}>
          {'Найти '}
        </Button>
        ) : null, // Показывать кнопку только при изменении ввода
      }}
    />
  );

  return (
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
  );
};

export default React.memo(StreetSelectBig);



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

