"use client";

import { AccordionDetails, Box, Checkbox, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import React, { useState, useEffect, useMemo, useRef } from "react";
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

function CityFilter({
  filteblackProps,
  currentFilter,
  setCurrentFilter,
  resetPageAndReloadData,
}: Props) {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const accordionRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = useToggleAccordion(setIsExpanded);

  const handleCityToggle = (city: string) => {
    setCurrentFilter((prevFilterState) => {
      const isCitySelected = prevFilterState.city?.includes(city);
      return {
        ...prevFilterState,
        city: isCitySelected ? [] : [city], // Убираем город, если он уже выбран
      };
    });
    resetPageAndReloadData();
    setIsExpanded(false); // Закрываем аккордеон после выбора
  };

  const selectedCity = useMemo(() => {
    return currentFilter.city?.[0] || "Выберите город";
  }, [currentFilter.city]);

  // Закрытие аккордеона при клике вне его пределов
  useOutsideClick(accordionRef, () => setIsExpanded(false));

  return (
    <Box ref={accordionRef} sx={accordionContainerStyles(theme)}>
      {/* Заголовок аккордеона */}
      <Box onClick={toggleAccordion} sx={accordionHeaderStyles(isExpanded)}>
        <Typography
          sx={{ fontSize: "14px", display: "flex", alignItems: "center" }}
        >
          <LocationCityIcon style={{ marginRight: "8px", fontSize: "19px" }} />{" "}
          {selectedCity}
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
            {Array.from(new Set(filteblackProps.cities.map((city) => city)))
              .filter((city) => city !== "")
              .map((city) => (
                <Box
                  key={city}
                  onClick={() => handleCityToggle(city)}
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
                    checked={currentFilter.city?.includes(city)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Typography
                    sx={{
                      marginLeft: "8px",
                      fontSize: "0.875rem",
                    }}
                  >
                    {city}
                  </Typography>
                </Box>
              ))}
          </div>
        </AccordionDetails>
      )}
    </Box>
  );
}

export default React.memo(CityFilter);
