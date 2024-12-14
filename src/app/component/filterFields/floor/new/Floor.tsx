import React, { useState, useRef, useMemo } from "react";
import { Box, Typography, AccordionDetails, Checkbox } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import { Dispatch, SetStateAction } from "react";
import {
  FilteblackProps,
  FilterUserOptions,
} from "../../../../../../@types/dto";
import { useTheme } from "../../../provider/ThemeProvider";
import {
  accordionContainerStyles,
  accordionContentStyles,
  accordionHeaderStyles,
  useOutsideClick,
} from "@/app/component/shortFilters/filters/utils";
import { checkTheme } from "@/shared/utils";

type Props = {
  filteblackProps: FilteblackProps;
  currentFilter: FilterUserOptions;
  setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
};

const FloorFilter: React.FC<Props> = ({
  filteblackProps,
  currentFilter,
  setCurrentFilter,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const accordionRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = () => setIsExpanded((prev) => !prev);

  useOutsideClick(accordionRef, () => setIsExpanded(false));

  const floorsOptions = filteblackProps.floors
    .map((floors) => (floors.trim() === "" ? "Не указан" : floors.trim()))
    .sort((a, b) => {
      const isANumber = !isNaN(Number(a));
      const isBNumber = !isNaN(Number(b));
      return isANumber && isBNumber
        ? Number(a) - Number(b)
        : a.localeCompare(b);
    });

    const handleFloorToggle = (floor: string) => {
      setCurrentFilter((prev) => ({
        ...prev,
        floors: prev.floors?.some((f) => f === floor)
          ? prev.floors.filter((f) => f !== floor) 
          : [...(prev.floors || []), floor], 
      }));
    };

  const selectedFloors = useMemo(() => {
    const selected = currentFilter.floors || [];
    return selected.length > 0 ? selected[0] : "Этажей в доме";
  }, [currentFilter.floors]);

  return (
    <Box ref={accordionRef} sx={accordionContainerStyles(theme)}>
      <Box onClick={toggleAccordion} sx={accordionHeaderStyles(isExpanded)}>
        <Typography
          sx={{ fontSize: "14px", display: "flex", alignItems: "center" }}
        >
          <MapsHomeWorkIcon sx={{ marginRight: "8px", fontSize: "19px" }} />
          {selectedFloors}
        </Typography>
        <ExpandMoreIcon
          sx={{
            transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
            transition: "0.3s",
          }}
        />
      </Box>
      {isExpanded && (
        <AccordionDetails sx={accordionContentStyles(theme)}>
          <div className="flex flex-col w-full justify-start">
            {floorsOptions.map((floor) => (
              <Box
                key={floor}
                onClick={() => handleFloorToggle(floor)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "2px 16px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  "&:hover": {
                    backgroundColor: checkTheme(theme, "#4a4f567a", "white"),
                  },
                }}
              >
                <Checkbox
                  color="default"
                  checked={currentFilter.floors?.includes(floor)}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    "& .MuiSvgIcon-root": { fontSize: "14px" },
                    color: checkTheme(theme, "white", "black"),
                  }}
                />
                <Typography sx={{ marginLeft: "8px", fontSize: "0.875rem" }}>
                  {floor}
                </Typography>
              </Box>
            ))}
          </div>
        </AccordionDetails>
      )}
    </Box>
  );
};

export default React.memo(FloorFilter);
