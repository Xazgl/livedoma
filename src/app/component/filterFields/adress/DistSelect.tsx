


import {Accordion,AccordionDetails,AccordionSummary,Box,Checkbox,FormControlLabel,Typography,} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {  FilteblackProps, FilterUserOptions } from "../../../../../@types/dto";
import { Dispatch, SetStateAction } from "react";
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import { funcCity } from "@/lib/foundAdress";

type Props = {
  filteblackProps: FilteblackProps;
  currentFilter: FilterUserOptions;
  setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
  resetPageAndReloadData:() => void;
};

export function DistSelect({filteblackProps,currentFilter,setCurrentFilter,resetPageAndReloadData}: Props) {
    // console.log(filteblackProps.districts)
  
    return (
    <Accordion defaultExpanded={false} sx={{ width: "100%" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography sx={{ fontSize: "14px" }}>
          < ZoomInMapIcon  /> Район {" "}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        
        <div className="flex  flex-col  w-full  justify-start ">
          {Array.from(new Set(filteblackProps.districts.map((district) => district)))
            .filter((district) => district !=='' && district !== 'Не указан' && district !== 'Район не найден')
            .map((district) => (
                district !=='' && district !== 'Не указан' && district !== 'Район не найден'?
           
                <FormControlLabel
              key={district}
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
                    checked={currentFilter.district?.includes(district)}
                  />
                </Box>
              }

             label = {district}
              onClick={() => {
                setCurrentFilter((prevFilterState) => {
                  return {
                    ...prevFilterState,
                    district: prevFilterState?.district
                      ? prevFilterState.district.includes(district)
                        ? prevFilterState.district.filter(
                            (el) => el !== district
                          )
                        : [...(prevFilterState.district ?? []), district]
                      : [district],
                  };
                });
                resetPageAndReloadData()
              }}
            />
            : null 

          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );





  
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
