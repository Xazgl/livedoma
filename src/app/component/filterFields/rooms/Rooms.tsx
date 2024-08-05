import React from "react";
import {Accordion, AccordionDetails, AccordionSummary, MenuItem, Select, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SchemaIcon from "@mui/icons-material/Schema";
import { FilteblackProps, FilterUserOptions } from "../../../../../@types/dto";
import { Dispatch, SetStateAction } from "react";
import { useTheme } from "../../provider/ThemeProvider";

type Props = {
  filteblackProps: FilteblackProps;
  currentFilter: FilterUserOptions;
  setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
  resetPageAndReloadData:() => void;
};

export function RoomsSelector({filteblackProps,currentFilter,setCurrentFilter, resetPageAndReloadData}: Props) {
  const { theme } = useTheme();
  const roomOptions = filteblackProps.rooms
    .filter((room) => room.trim() !== "") // Exclude empty strings
    .sort((a, b) => {
      // Custom sorting logic
      const isANumber = !isNaN(Number(a));
      const isBNumber = !isNaN(Number(b));

      if (isANumber && isBNumber) {
        // Both are numbers, compare as numbers
        return Number(a) - Number(b);
      } else if (isANumber) {
        // Only 'a' is a number, 'b' comes after
        return -1;
      } else if (isBNumber) {
        // Only 'b' is a number, 'a' comes after
        return 1;
      } else {
        // Both are words, compare as strings
        return a.localeCompare(b);
      }
    });

  return (
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
          <SchemaIcon /> Кол-во комнат
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="flex flex-col w-full text-black">

        <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={currentFilter.rooms ?? []}
                label=""
                onChange={(event) => {
                    const selectedRoom = event.target.value as string;
                    setCurrentFilter((prevFilterState) => {
                        const updatedRooms = prevFilterState.rooms?.includes(selectedRoom)
                            ? prevFilterState.rooms.filter((room) => room !== selectedRoom)
                            : [...(prevFilterState.rooms ?? []), selectedRoom];
                        return {
                            ...prevFilterState,
                            rooms: updatedRooms,
                        };
                    });
                    resetPageAndReloadData();
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
            {roomOptions.map((room) => (
              <MenuItem key={room} value={room}>{room}</MenuItem>
            ))
            }

          </Select>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
