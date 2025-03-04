"use client";

import { AccordionDetails, Box, Checkbox, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import React, { useState, useMemo, useRef } from "react";
import { useTheme } from "@/app/component/provider/ThemeProvider";
import { checkTheme } from "@/shared/utils";

import {
  accordionContainerStyles,
  accordionContentStyles,
  accordionHeaderStyles,
  useOutsideClick,
  useToggleAccordion,
} from "@/app/component/shortFilters/filters/utils";
import { Props } from "../../adress/new/type";
import { operationTypeNormalize } from "../utils";

function OperationTypeSelectDesktop({
  filteblackProps,
  currentFilter,
  setCurrentFilter,
  resetPageAndReloadData,
}: Props) {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const accordionRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = useToggleAccordion(setIsExpanded);

  const handleOperationTypeToggle = (type: string) => {
    setCurrentFilter((prevFilterState) => {
      const isTypeSelected = prevFilterState.operationType?.includes(type);
      return {
        ...prevFilterState,
        operationType: isTypeSelected ? [] : [type],
      };
    });
    resetPageAndReloadData();
    setIsExpanded(false);
  };

  const selectedType = useMemo(() => {
    const label = currentFilter.operationType?.[0]
      ? operationTypeNormalize(currentFilter.operationType?.[0])
      : "Выберите тип";
    return label;
  }, [currentFilter.operationType]);

  // Закрытие аккордеона при клике вне его пределов
  useOutsideClick(accordionRef, () => setIsExpanded(false));

  return (
    <Box ref={accordionRef} sx={accordionContainerStyles(theme)}>
      {/* Заголовок аккордеона */}
      <Box onClick={toggleAccordion} sx={accordionHeaderStyles(isExpanded)}>
        <Typography
          sx={{ fontSize: "14px", display: "flex", alignItems: "center"}}
        >
          <WysiwygIcon style={{ marginRight: "8px", fontSize: "19px" }} />{" "}
          {selectedType}
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
            {Array.from(
              new Set(filteblackProps.operationTypes.map((type) => type))
            )
              .filter((type) => type !== "")
              .map((type) => (
                <Box
                  key={type}
                  onClick={() => handleOperationTypeToggle(type)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "2px 14px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    "&:hover": {
                      bgcolor: checkTheme(theme, "#4a4f567a", "#f0f0f0"),
                    },
                  }}
                >
                  <Checkbox
                    color="default"
                    sx={{
                      "& .MuiSvgIcon-root": { fontSize: "14px" },
                      color: checkTheme(theme, "white", "black"),
                    }}
                    checked={currentFilter.operationType?.includes(type)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Typography
                    sx={{
                      marginLeft: "8px",
                      fontSize: "0.875rem",
                    }}
                  >
                    {operationTypeNormalize(type)}
                  </Typography>
                </Box>
              ))}
          </div>
        </AccordionDetails>
      )}
    </Box>
  );
}

export default React.memo(OperationTypeSelectDesktop);
