"use client";

import {
  AccordionDetails,
  Box,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CurrencyRubleIcon from "@mui/icons-material/CurrencyRuble";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../../provider/ThemeProvider";
import {
  accordionContainerStyles,
  accordionContentStyles,
  accordionHeaderStyles,
  useOutsideClick,
  useToggleAccordion,
} from "@/app/component/shortFilters/filters/utils";

type Props = {
  minPrice: number;
  maxPrice: number;
  setMinPrice: React.Dispatch<React.SetStateAction<number>>;
  setMaxPrice: React.Dispatch<React.SetStateAction<number>>;
  valueSliderPrice: [number, number];
  setValueSliderPrice: React.Dispatch<React.SetStateAction<[number, number]>>;
  resetPageAndReloadData: () => void;
};

function FilterPrice({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  valueSliderPrice,
  setValueSliderPrice,
  resetPageAndReloadData,
}: Props) {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const accordionRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = useToggleAccordion(setIsExpanded);

  const [inputMin, setInputMin] = useState<string>(String(minPrice));
  const [inputMax, setInputMax] = useState<string>(String(maxPrice));
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    setValueSliderPrice([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const handleInputChangeMin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputMin(newValue);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      const parsedValue = Number(newValue.replace(/\D/g, ""));
      if (
        !isNaN(parsedValue) &&
        parsedValue <= Number(inputMax.replace(/\D/g, ""))
      ) {
        setMinPrice(parsedValue);
      }
    }, 1000);
  };

  const handleInputChangeMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputMax(newValue);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      const parsedValue = Number(newValue.replace(/\D/g, ""));
      if (
        !isNaN(parsedValue) &&
        parsedValue >= Number(inputMin.replace(/\D/g, ""))
      ) {
        setMaxPrice(parsedValue);
      }
    }, 1000);
  };

  // const selectedPriceRange = useMemo(() => {
  //   return valueSliderPrice[1] ? `От ${valueSliderPrice[0] ? valueSliderPrice[0] : 0} до ${valueSliderPrice[1]} ₽`: 'Цена';
  // }, [valueSliderPrice]);

  const commonTextFieldStyles = {
    width: "50%",
    paddingRight: "2px",
    paddingLeft: "2px",
    "& .MuiInputBase-input": {
      color: theme === "dark" ? "white" : "black",
    },
    "& .MuiInputLabel-root": {
      color: theme === "dark" ? "white" : "black",
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: theme === "dark" ? "white" : "black",
    },
    "& .MuiInput-underline:hover:before": {
      borderBottomColor: theme === "dark" ? "white" : "black",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: theme === "dark" ? "white" : "black",
    },
    "& .MuiInput-underline.Mui-focused:after": {
      borderBottomColor: theme === "dark" ? "white" : "black",
    },
  };

  // Закрытие аккордеона при клике вне его пределов
  useOutsideClick(accordionRef, () => setIsExpanded(false));

  return (
    <Box ref={accordionRef} sx={accordionContainerStyles(theme)}>
      {/* Заголовок аккордеона */}
      <Box onClick={toggleAccordion} sx={accordionHeaderStyles(isExpanded)}>
        <Typography
          sx={{ fontSize: "14px", display: "flex", alignItems: "center" }}
        >
          <CurrencyRubleIcon style={{ marginRight: "8px", fontSize: "19px" }} />
          Цена
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
          <div className="flex w-full gap-[8px] items-center p-3">
            <TextField
              size="small"
              sx={commonTextFieldStyles}
              label="От"
              variant="standard"
              value={inputMin}
              onChange={handleInputChangeMin}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CurrencyRubleIcon
                      sx={{
                        fontSize: "14px",
                        color: theme === "dark" ? "white" : "black",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              size="small"
              sx={commonTextFieldStyles}
              label="До"
              variant="standard"
              value={inputMax}
              onChange={handleInputChangeMax}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CurrencyRubleIcon
                      sx={{
                        fontSize: "14px",
                        color: theme === "dark" ? "white" : "black",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </AccordionDetails>
      )}
    </Box>
  );
}

export default React.memo(FilterPrice);
