"use client";

import {
  Autocomplete,
  TextField,
  AutocompleteRenderInputParams,
  FilterOptionsState,
} from "@mui/material";
import { FilteblackProps, FilterUserOptions } from "../../../../../@types/dto";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "../../provider/ThemeProvider";
import "./style.css";

type Props = {
  filteblackProps: FilteblackProps;
  currentFilter: FilterUserOptions;
  setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
  resetPageAndReloadData: () => void;
};
export function StreetSelectBig({
  filteblackProps,
  currentFilter,
  setCurrentFilter,
  resetPageAndReloadData,
}: Props) {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  // Синхронизация выбранного значения из currentFilter
  useEffect(() => {
    if (currentFilter.street && currentFilter.street[0]) {
      const streetValue = currentFilter.street[0].trim();
      setSelectedValue(streetValue);
      setInputValue(streetValue);
    }
  }, [currentFilter.street]);

  // Управление темой
  useEffect(() => {
    const body = document.body;
    if (theme === "dark") {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
    return () => {
      body.classList.remove("dark-mode");
    };
  }, [theme]);

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

  const filterOptions = useMemo(() => {
    return (options: string[], state: FilterOptionsState<string>) => {
      const { inputValue } = state;
      const filtered = options.filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      );

      if (inputValue && !filtered.includes(inputValue)) {
        filtered.unshift(inputValue);
      }

      return filtered;
    };
  }, [filteblackProps.streets]);

  console.log()



  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField 
      {...params} 
      sx={{
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
      }}
      label={
        <span className={` ${theme === "dark" ? "text-white" : "text-black"}`}>
          <SearchIcon sx={{ color: theme === "dark" ? "white" : "black" }} />{" "}
          Поиск
        </span>
      }
    />
  );

  return (
    <Autocomplete
      sx={{
        borderRadius:'10px',
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
      }}
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
}

// export function StreetSelectBig({
//   filteblackProps,
//   currentFilter,
//   setCurrentFilter,
//   resetPageAndReloadData,
// }: Props) {
//   const { theme } = useTheme();
//   const [inputValue, setInputValue] = useState("");

//     useEffect(() => {
//     const body = document.body;
//     if (theme === "dark") {
//       body.classList.add("dark-mode");
//     } else {
//       body.classList.remove("dark-mode");
//     }
//     return () => {
//       body.classList.remove("dark-mode");
//     };
//   }, [theme]);

//   useEffect(() => {
//     if (
//       currentFilter.street &&
//       currentFilter.street[0] &&
//       currentFilter.street.length > 0 &&
//       currentFilter.street[0] !== ""
//     ) {
//       setInputValue(currentFilter.street[0].trim());
//     }
//   }, [currentFilter.street]);

//   const handleChange = (event: React.ChangeEvent<{}>, value: string | null) => {
//     const trimmedValue = typeof value === "string" ? value.trim() : value;

//     // Сбрасываем состояние для корректной работы Autocomplete
//     setInputValue("");
//     setTimeout(() => {
//       setInputValue(trimmedValue || "");
//       setCurrentFilter((prevFilterState) => ({
//         ...prevFilterState,
//         street: trimmedValue ? [trimmedValue] : undefined,
//       }));
//       resetPageAndReloadData();
//     }, 0);
//   };

//   const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
//     setInputValue(value);
//   };

//   const filterOptions = useMemo(() => {
//     return (options: string[], state: FilterOptionsState<string>) => {
//       const { inputValue } = state;
//       if (inputValue.length < 3) return [];
//       const filtered = options.filter((option) =>
//         option.toLowerCase().includes(inputValue.toLowerCase())
//       );

//       // Добавляем введённое значение в начало, если совпадений нет
//       if (inputValue && !filtered.includes(inputValue)) {
//         filtered.unshift(inputValue);
//       }

//       return filtered;
//     };
//   }, [filteblackProps.streets]);

//   const renderInput = (params: AutocompleteRenderInputParams) => (
//     <TextField
//       {...params}
//       sx={{
//         color: theme === "dark" ? "white" : "black",
//         "& .MuiInputBase-root": {
//           borderRadius: "5px",
//           bgcolor: theme === "dark" ? "#3a3f467a" : "white",
//           color: theme === "dark" ? "white" : "black",
//         },
//         "& .MuiInputBase-input": {
//           color: theme === "dark" ? "white" : "black",
//         },
//         "& .MuiInputLabel-root": {
//           color: theme === "dark" ? "white" : "black",
//         },
//         "& .MuiOutlinedInput-root": {
//           "& fieldset": {
//             borderColor: theme === "dark" ? "white" : "#3a3f4635",
//           },
//           "&:hover fieldset": {
//             borderColor: theme === "dark" ? "white" : "#3a3f4635",
//           },
//           "&.Mui-focused fieldset": {
//             borderColor: theme === "dark" ? "white" : "#3a3f4635",
//           },
//         },
//       }}
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
//       sx={{
//         width: "100%",
//         border: "none",
//         bgcolor: theme === "dark" ? "#3a3f467a" : "white",
//         color: theme === "dark" ? "white" : "black",
//         "& .MuiAutocomplete-popupIndicator": {
//           display: "none",
//         },
//         "& .MuiAutocomplete-paper": {
//           maxHeight: "50px !important",
//           overflowY: "auto",
//         },
//         "& .MuiAutocomplete-listbox": {
//           maxHeight: "50px !important",
//           overflowY: "auto",
//         },
//         "& .MuiAutocomplete-clearIndicator": {
//           color: theme === "dark" ? "white" : "black",
//         },
//         "& .MuiAutocomplete-noOptions": {
//           color: theme === "dark" ? "white" : "black",
//         },
//       }}
//       options={filteblackProps.streets || []}
//        value={inputValue}
//     //   value={currentFilter.street ? currentFilter.street[0] : null}
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

// export function StreetSelectBig({
//   filteblackProps,
//   currentFilter,
//   setCurrentFilter,
//   resetPageAndReloadData,
// }: Props) {
//   const { theme } = useTheme();
//   const [inputValue, setInputValue] = useState("");

//   useEffect(() => {
//     const body = document.body;
//     if (theme === "dark") {
//       body.classList.add("dark-mode");
//     } else {
//       body.classList.remove("dark-mode");
//     }
//     return () => {
//       body.classList.remove("dark-mode");
//     };
//   }, [theme]);

//   useEffect(() => {
//     if (
//       currentFilter.street &&
//       currentFilter.street[0] &&
//       currentFilter.street.length > 0 &&
//       currentFilter.street[0] !== ""
//     ) {
//       setInputValue(currentFilter.street[0].trim());
//     }
//   }, [currentFilter.street])

//   const handleChange = (event: React.ChangeEvent<{}>, value: string | null) => {
//     setCurrentFilter((prevFilterState) => ({
//       ...prevFilterState,
//       street: value ? [value] : undefined,
//     }));
//     resetPageAndReloadData();
//   };

//   const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
//     setInputValue(value);
//   };

//   const filterOptions = (
//     options: string[],
//     { inputValue }: { inputValue: string }
//   ) => {
//     const filtered = options.filter(
//       (option) =>
//         option.toLowerCase().includes(inputValue.toLowerCase()) &&
//         inputValue.length >= 3
//     );
//     if (inputValue && !filtered.includes(inputValue)) {
//       filtered.unshift(inputValue);
//     }
//     return filtered;
//   };

//   const getOptionLabel = (option: string) => option;

//   const renderInput = (params: AutocompleteRenderInputParams) => (
//     <TextField
//       sx={{
//         color: theme === "dark" ? "white" : "black",
//         "& .MuiInputBase-root": {
//           borderRadius: "5px",
//           bgcolor: theme === "dark" ? "#3a3f467a" : "white",
//           color: theme === "dark" ? "white" : "black",
//         },
//         "& .MuiInputBase-input": {
//           color: theme === "dark" ? "white" : "black",
//         },
//         "& .MuiInputLabel-root": {
//           color: theme === "dark" ? "white" : "black",
//         },
//         "& .MuiOutlinedInput-root": {
//           "& fieldset": {
//             borderColor: theme === "dark" ? "white" : "black",
//           },
//           "&:hover fieldset": {
//             borderColor: theme === "dark" ? "white" : "black",
//           },
//           "&.Mui-focused fieldset": {
//             borderColor: theme === "dark" ? "white" : "black",
//           },
//         },
//       }}
//       {...params}
//       label={
//         <span className={` ${theme === "dark" ? "text-white" : "text-black"}`}>
//           {" "}
//           <SearchIcon
//             sx={{ color: theme === "dark" ? "white" : "black" }}
//           />{" "}
//           Адрес{" "}
//         </span>
//       }
//     />
//   );

//   return (
//     <Autocomplete
//     sx={{
//         width: "100%",
//         border: "none",
//         bgcolor: theme === "dark" ? "#3a3f467a" : "white",
//         color: theme === "dark" ? "white" : "black",
//         "& .MuiAutocomplete-popupIndicator": {
//           display: "none",
//         },
//         "& .MuiAutocomplete-paper": {
//           maxHeight: "50px !important",
//           overflowY: "auto",
//         },
//         "& .MuiAutocomplete-listbox": {
//           maxHeight: "50px !important",
//           overflowY: "auto",
//         },
//         "& .MuiAutocomplete-clearIndicator": {
//           color: theme === "dark" ? "white" : "black",
//         },
//         "& .MuiAutocomplete-noOptions": {
//           color: theme === "dark" ? "white" : "black",
//         },
//       }}
//       id="street-autocomplete"
//       options={filteblackProps.streets || []}
//       value={currentFilter.street ? currentFilter.street[0] : null}
//       onChange={handleChange}
//       inputValue={inputValue}
//       onInputChange={handleInputChange}
//       renderInput={renderInput}
//       filterOptions={filterOptions}
//       isOptionEqualToValue={(option, value) =>
//         option.toLowerCase() === (value || "").toLowerCase()
//       }
//       getOptionLabel={getOptionLabel}
//       noOptionsText={
//         currentFilter.street && currentFilter.street.length === 0
//           ? "Напишите адрес"
//           : "Нет вариантов"
//       }
//     />
//   );
// }
