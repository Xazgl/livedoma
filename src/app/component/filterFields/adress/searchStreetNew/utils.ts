import { FilterOptionsState } from "@mui/material";
import { useEffect } from "react";

// Синхронизация выбранного значения из currentFilter
export const useSyncStreetValue = (
  street: string[] | undefined,
  setSelectedValue: (value: string | null) => void,
  setInputValue: (value: string) => void
) => {
  useEffect(() => {
    if (street && street[0]) {
      const streetValue = street[0].trim();
      setSelectedValue(streetValue);
      setInputValue(streetValue);
    }
  }, [street, setSelectedValue, setInputValue]);
};

// Управление темой
export const useThemeEffect = (theme: string) => {
  useEffect(() => {
    const body = document.body;
    if (theme === "dark") {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
    return () => {
      body.classList.remove("dark-mode");
    };
  }, [theme]);
};



export const createFilterOptions = (
    options: string[]
  ): ((options: string[], state: FilterOptionsState<string>) => string[]) => {
    return (availableOptions: string[], state: FilterOptionsState<string>) => {
      const { inputValue } = state;
      const filtered = availableOptions.filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
  
      if (inputValue && !filtered.includes(inputValue)) {
        filtered.unshift(inputValue);
      }
  
      return filtered;
    };
  };