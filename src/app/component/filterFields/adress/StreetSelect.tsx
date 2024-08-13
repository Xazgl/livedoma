
// "use client";

// import { Autocomplete, TextField, AutocompleteRenderInputParams, } from "@mui/material";
// import { FilteblackProps, FilterUserOptions } from "../../../../../@types/dto";
// import { Dispatch, SetStateAction } from "react";
// import SignpostIcon from '@mui/icons-material/Signpost';
// import { useTheme } from "../../provider/ThemeProvider";

// type Props = {
//     filteblackProps: FilteblackProps;
//     currentFilter: FilterUserOptions;
//     setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
//     resetPageAndReloadData:() => void;
// };

// export function StreetSelect({ filteblackProps, currentFilter, setCurrentFilter, resetPageAndReloadData}: Props) {
//     const { theme} = useTheme();
//     const handleChange = (
//         event: React.ChangeEvent<{}>,
//         value: string | null
//     ) => {
//         setCurrentFilter((prevFilterState) => ({
//             ...prevFilterState,
//             street: value ? [value] : undefined,
//         }));
//         resetPageAndReloadData()
//     };

//     const filterOptions = (
//         options: string[],
//         { inputValue }: { inputValue: string }
//     ) => {
//         return options.filter(
//             (option) =>
//                 option.toLowerCase().includes(inputValue.toLowerCase()) &&
//                 inputValue.length >= 3
//         );
//     };


//     const getOptionLabel = (option: string) => option;

//     const renderInput = (params: AutocompleteRenderInputParams) => (
//         <TextField  
//         sx={{
//             color: theme === "dark" ? "white" : "black",
//                 '& .MuiInputBase-input': {
//                     color: theme === "dark" ? "white" : "black",
//                 },
//                 '& .MuiInputLabel-root': {
//                     color: theme === "dark" ? "white" : "black",
//                 },
//                 '& .MuiOutlinedInput-root': {
//                     '& fieldset': {
//                         borderColor: theme === "dark" ? "white" : "black",
//                     },
//                     '&:hover fieldset': {
//                         borderColor: theme === "dark" ? "white" : "black",
//                     },
//                     '&.Mui-focused fieldset': {
//                         borderColor: theme === "dark" ? "white" : "black",
//                     },
//                 }
//         }}
//         {...params} label={<span className={` ${theme === "dark"? "text-white":"text-black"}`}> <SignpostIcon  sx={{color: theme === "dark" ? "white" : "black"}}/> Адрес </span>} />
//     );

//     return (
//         <Autocomplete
//             sx={{ width: "100%",
//                  border:'none',
//                  bgcolor: theme === "dark" ? "#3a3f467a" : "white",
//                  color: theme === "dark" ? "white" : "black",
//                  '& .MuiAutocomplete-popupIndicator': { 
//                     color: theme === "dark" ? "white" : "black",
//                 }
//                 }}
//             id="street-autocomplete"
//             options={filteblackProps.streets || []}
//             value={currentFilter.street ? currentFilter.street[0] : null}
//             onChange={handleChange}
//             renderInput={renderInput}
//             filterOptions={filterOptions}
//             isOptionEqualToValue={(option, value) =>
//                 option.toLowerCase() === (value || "").toLowerCase()
//             }
//             getOptionLabel={getOptionLabel}
//             noOptionsText={currentFilter.street && currentFilter.street.length === 0 ? "Напишите адрес" : "Нет вариантов"}
//         />

//     );
// }


"use client";

import { Autocomplete, TextField, AutocompleteRenderInputParams, } from "@mui/material";
import { FilteblackProps, FilterUserOptions } from "../../../../../@types/dto";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SignpostIcon from '@mui/icons-material/Signpost';
import { useTheme } from "../../provider/ThemeProvider";
import { useSearchParams } from "next/navigation";

type Props = {
    filteblackProps: FilteblackProps;
    currentFilter: FilterUserOptions;
    setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
    resetPageAndReloadData:() => void;
};

export function StreetSelect({ filteblackProps, currentFilter, setCurrentFilter, resetPageAndReloadData }: Props) {
    const { theme } = useTheme();
    const [inputValue, setInputValue] = useState('');


//     const searchParams = useSearchParams();
//     const params = new URLSearchParams(searchParams);

//    useEffect(() => {
//     if (params.has("street")) {
//         const street = params.getAll("street");
//         setCurrentFilter((prevFilterState) => ({
//             ...prevFilterState,
//             street: street ,
//         }));
//       }
//    }, [])
   
 

    const handleChange = (
        event: React.ChangeEvent<{}>,
        value: string | null
    ) => {
        setCurrentFilter((prevFilterState) => ({
            ...prevFilterState,
            street: value ? [value] : undefined,
        }));
        resetPageAndReloadData();
    };

    const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
        setInputValue(value);
    };

    const filterOptions = (
        options: string[],
        { inputValue }: { inputValue: string }
    ) => {
        const filtered = options.filter(
            (option) =>
                option.toLowerCase().includes(inputValue.toLowerCase()) &&
                inputValue.length >= 3
        );
        if (inputValue && !filtered.includes(inputValue)) {
            filtered.unshift(inputValue);
        }
        return filtered;
    };

    const getOptionLabel = (option: string) => option;

    const renderInput = (params: AutocompleteRenderInputParams) => (
        <TextField  
            sx={{
                color: theme === "dark" ? "white" : "black",
                '& .MuiInputBase-input': {
                    color: theme === "dark" ? "white" : "black",
                },
                '& .MuiInputLabel-root': {
                    color: theme === "dark" ? "white" : "black",
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: theme === "dark" ? "white" : "black",
                    },
                    '&:hover fieldset': {
                        borderColor: theme === "dark" ? "white" : "black",
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: theme === "dark" ? "white" : "black",
                    },
                }
            }}
            {...params} label={<span className={` ${theme === "dark"? "text-white":"text-black"}`}> <SignpostIcon sx={{color: theme === "dark" ? "white" : "black"}}/> Адрес </span>} />
    );

    return (
        <Autocomplete
            sx={{ 
                width: "100%",
                border: 'none',
                bgcolor: theme === "dark" ? "#3a3f467a" : "white",
                color: theme === "dark" ? "white" : "black",
                '& .MuiAutocomplete-popupIndicator': { 
                    color: theme === "dark" ? "white" : "black",
                }
            }}
            id="street-autocomplete"
            options={filteblackProps.streets || []}
            value={currentFilter.street ? currentFilter.street[0] : null}
            onChange={handleChange}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            renderInput={renderInput}
            filterOptions={filterOptions}
            isOptionEqualToValue={(option, value) =>
                option.toLowerCase() === (value || "").toLowerCase()
            }
            getOptionLabel={getOptionLabel}
            noOptionsText={currentFilter.street && currentFilter.street.length === 0 ? "Напишите адрес" : "Нет вариантов"}
        />
    );
}