import React from "react";
import {Accordion, AccordionDetails, AccordionSummary, MenuItem, Select, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import { FilteblackProps, FilterUserOptions } from "../../../../../@types/dto";
import { Dispatch, SetStateAction } from "react";

type Props = {
  filteblackProps: FilteblackProps;
  currentFilter: FilterUserOptions;
  setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
};

export function Renovation ({filteblackProps,currentFilter,setCurrentFilter}: Props) {

  // console.log(filteblackProps.renovationTypes)
  // const renovationOptions = filteblackProps.renovationTypes
  //   .filter((room) => room.trim() !== "") // Exclude empty strings
  //   .sort((a, b) => {
  //     // Custom sorting logic
  //     const isANumber = !isNaN(Number(a));
  //     const isBNumber = !isNaN(Number(b));

  //     if (isANumber && isBNumber) {
  //       // Both are numbers, compare as numbers
  //       return Number(a) - Number(b);
  //     } else if (isANumber) {
  //       // Only 'a' is a number, 'b' comes after
  //       return -1;
  //     } else if (isBNumber) {
  //       // Only 'b' is a number, 'a' comes after
  //       return 1;
  //     } else {
  //       // Both are words, compare as strings
  //       return a.localeCompare(b);
  //     }
  //   });

  return (
    <></>
    // <Accordion  sx={{ width: "100%" }}>
    //   <AccordionSummary
    //     expandIcon={<ExpandMoreIcon />}
    //     aria-controls="panel1a-content"
    //     id="panel1a-header"
    //   >
    //     <Typography sx={{ fontSize: "14px" }}>
    //       {" "}
    //       <FormatPaintIcon /> Ремонт
    //     </Typography>
    //   </AccordionSummary>
    //   <AccordionDetails>
    //     <div className="flex flex-col w-full text-black">

    //       <Select
    //         labelId="demo-simple-select-label"
    //         id="demo-simple-select"
    //         value={currentFilter.renovation ?? []}
    //         label=""
    //         onChange={(event) => {
    //           const selectedRenovation = event.target.value as string; 
    //           setCurrentFilter((prevFilterState) => {
    //             const updatedRenovation = prevFilterState.renovation?.includes(selectedRenovation)
    //               ? prevFilterState.renovation.filter((renov) => renov !== selectedRenovation)
    //               : [...(prevFilterState.renovation ?? []), selectedRenovation];
    //             return {
    //               ...prevFilterState,
    //               renovation: updatedRenovation,
    //             };
    //           });
    //         }}
    //       >
    //         {renovationOptions.map((el) => (
    //           <MenuItem key={el} value={el}>{el}</MenuItem>
    //         ))
    //         }

    //       </Select>
    //     </div>
    //   </AccordionDetails>
    // </Accordion>
  );
}
