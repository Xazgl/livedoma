import React, { useState, useRef, useMemo } from "react";
import { Box, Typography, AccordionDetails, Checkbox } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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

const FloorSelector: React.FC<Props> = ({
  filteblackProps,
  currentFilter,
  setCurrentFilter,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const accordionRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = () => setIsExpanded((prev) => !prev);

  useOutsideClick(accordionRef, () => setIsExpanded(false));

  const floorOptions = filteblackProps.floor
    .map((floor) => (floor.trim() === "" ? "Не указан" : floor.trim()))
    .sort((a, b) => {
      const isANumber = !isNaN(Number(a));
      const isBNumber = !isNaN(Number(b));
      return isANumber && isBNumber
        ? Number(a) - Number(b)
        : a.localeCompare(b);
    });

  const handleFloorSelect = (floor: string) => {
    setCurrentFilter((prev) => ({
      ...prev,
      floor: prev.floor?.includes(floor) ? [] : [floor], // Сбрасываем выбор, если выбран тот же этаж
    }));
  };


  const selectedFloor = useMemo(() => {
    const selected = currentFilter.floor || [];
    return selected.length > 0 ? selected[0] : "Этаж";
  }, [currentFilter.floor]);

  return (
    <>
      {currentFilter.floors &&
        currentFilter.floors.length > 0 &&
        currentFilter.category &&
        currentFilter.category[0] !== "Дома, дачи, коттеджи" && (
          <Box ref={accordionRef} sx={accordionContainerStyles(theme)}>
            <Box
              onClick={toggleAccordion}
              sx={accordionHeaderStyles(isExpanded)}
            >
              <Typography
                sx={{ fontSize: "14px", display: "flex", alignItems: "center" }}
              >
                <ExpandMoreIcon sx={{ marginRight: "8px", fontSize: "19px" }} />
                {selectedFloor}
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
                  {floorOptions.map((floor) => (
                    <Box
                      key={floor}
                      onClick={() => handleFloorSelect(floor)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "2px 16px",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        "&:hover": {
                          backgroundColor: checkTheme(
                            theme,
                            "#4a4f567a",
                            "#f0f0f0"
                          ),
                        },
                      }}
                    >
                      <Checkbox
                        color="default"
                        checked={currentFilter.floor?.includes(floor)}
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          "& .MuiSvgIcon-root": { fontSize: "14px" },
                          color: checkTheme(theme, "white", "black"),
                        }}
                      />
                      <Typography
                        sx={{ marginLeft: "8px", fontSize: "0.875rem" }}
                      >
                        {floor}
                      </Typography>
                    </Box>
                  ))}
                </div>
              </AccordionDetails>
            )}
          </Box>
        )}
    </>
  );
};

export default React.memo(FloorSelector);
