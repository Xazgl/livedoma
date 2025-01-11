

"use client";
import {Accordion,AccordionDetails,AccordionSummary,Box,Checkbox,FormControlLabel,Typography,} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {  FilteblackProps, FilterUserOptions } from "../../../../../@types/dto";
import { Dispatch, SetStateAction } from "react";
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { funcCity } from "@/lib/foundAdress";
import { useTheme } from "../../provider/ThemeProvider";

type Props = {
  filteblackProps: FilteblackProps;
  currentFilter: FilterUserOptions;
  setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
  resetPageAndReloadData:() => void;
};

export function CitySelect({filteblackProps,currentFilter,setCurrentFilter,resetPageAndReloadData}: Props) {
  const { theme} = useTheme();
  return (
    <Accordion defaultExpanded={false} 
     slotProps={{transition: { timeout: 0 } }}
    sx={{
     width: "100%",
     bgcolor: theme === "dark" ? "#3a3f467a" : "white",
     color: theme === "dark" ? "white" : "black"
     }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon  sx={{ color: theme === "dark" ? "white" : "#0000008a"  }}/> }
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography sx={{ fontSize: "14px" }}>
          <LocationCityIcon />{" "} 
          {currentFilter.city?.length
            ? `Город: ${currentFilter.city.join(", ")}`
            : "Город"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        
        <div className="flex  flex-col  w-full  justify-start ">
          {Array.from(new Set(filteblackProps.cities.map((city) => funcCity(city))))
            .filter((city) => city !== '')
            .map((city) => (
            city !=='' ?
            <FormControlLabel
              key={city}
              control={
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row-reverse",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    color="default"
                    sx={{color: theme === "dark" ? "white" : "black"}}
                    checked={currentFilter.city?.includes(city)}
                  />
                  {/* <Avatar
                                                        sx={{ width: '60px', marginLeft: '10px' }}
                                                        aria-label="brand"
                                                        src={modelPhotoFind(ModelPhotoList, model)}
                                                    /> */}
                </Box>
              }
            //   label={ 
            //     category === "Гаражи и машиноместа" ?
            //     "Гаражи" 
            //     :
            //    (category === "Коммерческая недвижимость" ? "Коммерческая" : category) 
            //   }
             label = {city}
              onClick={() => {
                setCurrentFilter((prevFilterState) => {
                  return {
                    ...prevFilterState,
                    city: prevFilterState?.city
                      ? prevFilterState.city.includes(city)
                        ? prevFilterState.city.filter(
                            (el) => el !== city
                          )
                        : [...(prevFilterState.city?? []), city]
                      : [city],
                  };
                });
                resetPageAndReloadData()

                // setCurrentFilter(prevFilterState => {
                //     if (prevFilterState.category ? prevFilterState.category.includes(category) : null) {
                //         return {
                //             ...prevFilterState,
                //             category:
                //                 prevFilterState.category ? prevFilterState.category.filter(el => el !== category) : []
                //         };
                //     }
                //     return { ...prevFilterState, category: [...prevFilterState.category ? prevFilterState.category : [], category] };
                // });
              }}
            />
            : null 

          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );

  // logoFind(object.companyName)



  
}




















// import {  Autocomplete, TextField, AutocompleteRenderInputParams, } from "@mui/material";
// import { FilteblackProps, FilterUserOptions } from "../../../../../@types/dto";
// import { Dispatch, SetStateAction } from "react";

// type Props = {
//     filteblackProps: FilteblackProps;
//     currentFilter: FilterUserOptions;
//     setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
// };

// export function CitySelect({ filteblackProps, currentFilter, setCurrentFilter, }: Props) {

//     const handleChange = (
//         event: React.ChangeEvent<{}>,
//         value: string | null
//     ) => {
//         setCurrentFilter((prevFilterState) => ({
//             ...prevFilterState,
//             city: value ? [value] : undefined,
//         }));
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
//         <TextField {...params} label="Выберите город" />
//     );

//     return (
//         <Autocomplete
//             sx={{ width: "100%" }}
//             id="street-autocomplete"
//             options={filteblackProps.cities}
//             value={currentFilter.city ? currentFilter.city[0] : null}
//             onChange={handleChange}
//             renderInput={renderInput}
//             filterOptions={filterOptions}
//             isOptionEqualToValue={(option, value) =>
//                 option.toLowerCase() === (value || "").toLowerCase()
//             }
//             getOptionLabel={getOptionLabel}
//             noOptionsText={currentFilter.city && currentFilter.city.length === 0 ? "Введите город" : "Нет вариантов"}
//         />
//     );
// }
