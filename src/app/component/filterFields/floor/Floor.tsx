import React from "react";
import { Accordion,AccordionDetails,AccordionSummary,MenuItem,Select,Typography,} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FilteblackProps, FilterUserOptions } from "../../../../../@types/dto";
import { Dispatch, SetStateAction } from "react";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import { useTheme } from "../../provider/ThemeProvider";

type Props = {
  filteblackProps: FilteblackProps;
  currentFilter: FilterUserOptions;
  setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
};

export function Floor({ filteblackProps,currentFilter,setCurrentFilter}: Props) {
  const { theme } = useTheme();
  const floorOptions = filteblackProps.floor
    .map((floor) => (floor.trim() === "" ? "Не указан" : floor.trim()))
    .sort((a, b) => {
      const isANumber = !isNaN(Number(a));
      const isBNumber = !isNaN(Number(b));

      if (isANumber && isBNumber) {
        return Number(a) - Number(b);
      } else if (isANumber) {
        return -1;
      } else if (isBNumber) {
        return 1;
      } else {
        return a.localeCompare(b);
      }
    });

  const floorsOptions = filteblackProps.floors
    .map((floors) => (floors.trim() === "" ? "Не указан" : floors.trim()))
    .sort((a, b) => {
      const isANumber = !isNaN(Number(a));
      const isBNumber = !isNaN(Number(b));

      if (isANumber && isBNumber) {
        return Number(a) - Number(b);
      } else if (isANumber) {
        return -1;
      } else if (isBNumber) {
        return 1;
      } else {
        return a.localeCompare(b);
      }
    });

  return (
    <div className="flex flex-col  w-full gap-[5px]">
        <Accordion 
            sx={{
             width: "100%",
             bgcolor: theme === "dark" ? "#3a3f467a" : "white",
             color: theme === "dark" ? "white" : "black"
            }}
        >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon  sx={{ color: theme === "dark" ? "white" : "#0000008a"  }}/>}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography sx={{ fontSize: "14px" }}>
            {" "}
            <MapsHomeWorkIcon /> Этаж
          </Typography>
        </AccordionSummary>
        <AccordionDetails>

          <div className="flex flex-col w-full text-black">
            <h4 className={`${theme === "dark" ? "text-[white]" : "text-[black]"}`}>Этажей в доме</h4>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={currentFilter.floors ?? []}
              label=""
              onChange={(event) => {
                const selectedFloors = event.target.value as string;
                setCurrentFilter((prevFilterState) => {
                  const updatedFloors = prevFilterState.floors?.includes(
                    selectedFloors
                  )
                    ? prevFilterState.floors.filter(
                        (flr) => flr !== selectedFloors
                      )
                    : [...(prevFilterState.floors ?? []), selectedFloors];
                  return {
                    ...prevFilterState,
                    floors: updatedFloors,
                  };
                });
              }}
              sx={{
                bgcolor: theme === "dark" ? "#3a3f467a" : "white",
                color: theme === "dark" ? "white" : "black",
                '& .MuiSvgIcon-root': {
                    color: theme === "dark" ? "white" : "black",
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme === "dark" ? "white" : "black",
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme === "dark" ? "white" : "black",
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme === "dark" ? "white" : "black",
                }
              }}
            >
              {floorsOptions.map((el) => (
                <MenuItem key={el} value={el}>
                  {el}
                </MenuItem>
              ))}
            </Select>

            {currentFilter.floors && currentFilter.floors.length > 0 && currentFilter.category && currentFilter.category[0] !== "Дома, дачи, коттеджи" && (
              <>
                <h4 className={`${theme === "dark" ? "text-[white]" : "text-[black]"}`}>Этаж</h4>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={currentFilter.floor ?? []}
                  label=""
                  onChange={(event) => {
                    const selectedFloor = event.target.value as string;
                    setCurrentFilter((prevFilterState) => {
                      const updatedFloor = prevFilterState.floor?.includes(
                        selectedFloor
                      )
                        ? prevFilterState.floor.filter(
                            (flr) => flr !== selectedFloor
                          )
                        : [...(prevFilterState.floor ?? []), selectedFloor];
                      return {
                        ...prevFilterState,
                        floor: updatedFloor,
                      };
                    });
                  }}
                  sx={{
                    bgcolor: theme === "dark" ? "#3a3f467a" : "white",
                    color: theme === "dark" ? "white" : "black",
                    '& .MuiSvgIcon-root': {
                        color: theme === "dark" ? "white" : "black",
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme === "dark" ? "white" : "black",
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme === "dark" ? "white" : "black",
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme === "dark" ? "white" : "black",
                    }
                  }}
                >
                  {floorOptions.map((el) => (
                    <MenuItem key={el} value={el}>
                      {el}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
