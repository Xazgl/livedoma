"use client";

import { AccordionDetails, Box, Checkbox, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HouseIcon from "@mui/icons-material/House";
import { useState, useEffect, useMemo, useRef } from "react";
import React from "react";
import { useTheme } from "@/app/component/provider/ThemeProvider";
import { checkTheme } from "@/shared/utils";
import { Props } from "./type";
import {
  accordionContainerStyles,
  accordionContentStyles,
  accordionHeaderStyles,
  useOutsideClick,
  useToggleAccordion,
} from "@/app/component/shortFilters/filters/utils";

function FilterCategories({
  filteblackProps,
  currentFilter,
  setCurrentFilter,
  resetPageAndReloadData,
}: Props) {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const accordionRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = useToggleAccordion(setIsExpanded);

  const handleCategoryToggle = (category: string) => {
    setCurrentFilter((prevFilterState) => {
      const isCategorySelected = prevFilterState.category?.includes(category);
      return {
        ...prevFilterState,
        category: isCategorySelected ? [] : [category], // Сбрасываем состояние, если категория уже выбрана
      };
    });
    resetPageAndReloadData();
    setIsExpanded(false);
  };

  const selectedCategories = useMemo(() => {
    return currentFilter.category?.join(", ") || "Категория";
  }, [currentFilter.category]);

  // Закрытие аккордеона при клике вне его пределов
  useOutsideClick(accordionRef, () => setIsExpanded(false));

  return (
    <Box ref={accordionRef} sx={accordionContainerStyles(theme)}>
      {/* Заголовок аккордеона */}
      <Box
        onClick={toggleAccordion}
        sx={accordionHeaderStyles(isExpanded)}
      >
        <Typography
          sx={{ fontSize: "14px", display: "flex", alignItems: "center" }}
        >
          <HouseIcon style={{ marginRight: "8px", fontSize: "19px" }} />
          {selectedCategories}
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
            {filteblackProps.categories.map((category) => (
              <Box
                key={category}
                onClick={() => handleCategoryToggle(category)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "2px 16px",
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
                  checked={currentFilter.category?.includes(category)}
                  onClick={(e) => e.stopPropagation()}
                />
                <Typography sx={{ marginLeft: "8px", fontSize: "0.875rem" }}>
                  {category}
                </Typography>
              </Box>
            ))}
          </div>
        </AccordionDetails>
      )}
    </Box>
  );
}

export default React.memo(FilterCategories);
