import React, { useMemo, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormatPaintIcon from "@mui/icons-material/FormatPaint";
import {
  FilteblackProps,
  FilterUserOptions,
} from "../../../../../../@types/dto";
import { Dispatch, SetStateAction } from "react";
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

function FilterRenovation({
  filteblackProps,
  currentFilter,
  setCurrentFilter,
}: Props) {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const accordionRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = () => setIsExpanded((prev) => !prev);

  const handleRenovationToggle = (renovationType: string) => {
    setCurrentFilter((prev) => {
      const isSelected = prev.renovation?.includes(renovationType);
      const updatedRenovations = isSelected
        ? prev.renovation?.filter((type) => type !== renovationType)
        : [...(prev.renovation || []), renovationType];
      return { ...prev, renovation: updatedRenovations };
    });
    toggleAccordion();
  };

  const selectedRenovations = useMemo(() => {
    const selected = currentFilter.renovation || [];
    return selected.length > 0 ? selected.join(", ") : "Ремонт";
  }, [currentFilter.renovation]);

  useOutsideClick(accordionRef, () => setIsExpanded(false));

  return (
    <Box ref={accordionRef} sx={accordionContainerStyles(theme)}>
      {/* Заголовок аккордеона */}
      <Box onClick={toggleAccordion} sx={accordionHeaderStyles(isExpanded)}>
        <Typography
          sx={{ fontSize: "14px", display: "flex", alignItems: "center" }}
        >
          <FormatPaintIcon sx={{ marginRight: "8px", fontSize: "19px" }} />
          {selectedRenovations}
        </Typography>
        <ExpandMoreIcon
          sx={{
            transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
            transition: "0.3s",
          }}
        />
      </Box>

      {/* Контент аккордеона */}
      {isExpanded && (
        <AccordionDetails sx={accordionContentStyles(theme)}>
          <div className="flex flex-col w-full justify-start">
            {filteblackProps.renovationTypes.map((renovation) => (
              <Box
                key={renovation}
                onClick={() => handleRenovationToggle(renovation)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "2px 16px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  "&:hover": {
                    backgroundColor: checkTheme(theme, "#4a4f567a", "#f0f0f0"),
                  },
                }}
              >
                <Checkbox
                  color="default"
                  checked={currentFilter.renovation?.includes(renovation)}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    "& .MuiSvgIcon-root": { fontSize: "14px" },
                    color: checkTheme(theme, "white", "black"),
                  }}
                />
                <Typography sx={{ marginLeft: "8px", fontSize: "0.875rem" }}>
                  {renovation === "" ? "Не указан" : renovation.trim()}
                </Typography>
              </Box>
            ))}
          </div>
        </AccordionDetails>
      )}
    </Box>
  );
}

export default React.memo(FilterRenovation);
