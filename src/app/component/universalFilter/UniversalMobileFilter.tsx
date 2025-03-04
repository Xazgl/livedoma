"use client";

import React, { useState, useMemo, Dispatch, SetStateAction } from "react";
import {
  Box,
  Typography,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  Slide,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@/app/component/provider/ThemeProvider";
import { checkTheme } from "@/shared/utils";
import {
  accordionContainerStyles,
  accordionHeaderStyles,
} from "@/app/component/shortFilters/filters/utils";
import { TransitionProps } from "@mui/material/transitions";
import { modalTitleMap } from "./utils";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type UniversalFilterAccordionProps = {
  filterKey: string; // Например "category", "operationType", "rooms", "companyName"
  options: string[]; // Массив опций для выбора
  defaultLabel: string; // Метка по умолчанию, если ничего не выбрано
  icon: React.ReactNode; // Иконка для заголовка фильтра
  currentFilter: any; // Текущее состояние фильтра (при необходимости можно типизировать строже)
  setCurrentFilter: Dispatch<SetStateAction<any>>;
  resetPageAndReloadData: () => void;
  multiple?: boolean; // Множественный выбор (по умолчанию false – одиночный выбор)
  collapseOnSelect?: boolean; // Если true, после выбора новой опции диалог закрывается (по умолчанию true)
  getDisplayLabel?: (selected: string[]) => string; // Функция для формирования метки из выбранных опций
  transformOption?: (option: string) => string; // Функция для преобразования отображаемого названия опции
  loading: boolean;
};

const UniversalMobileFilter: React.FC<UniversalFilterAccordionProps> = ({
  filterKey,
  options,
  defaultLabel,
  icon,
  currentFilter,
  setCurrentFilter,
  resetPageAndReloadData,
  multiple = false,
  collapseOnSelect = true,
  getDisplayLabel,
  transformOption,
  loading,
}) => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Если фильтр "rooms" – сортируем опции по возрастанию (числовая сортировка)
  const sortedOptions = useMemo(() => {
    if (filterKey === "rooms") {
      return options.filter((room) => room.trim() !== "").sort((a, b) => {
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
    }
    return options;
  }, [filterKey, options]);

  // Получаем выбранные значения для данного фильтра
  const selectedValues: string[] = currentFilter[filterKey] || [];

  // Формируем метку заголовка фильтра
  const displayLabel = useMemo(() => {
    if (getDisplayLabel) {
      return getDisplayLabel(selectedValues);
    }
    return selectedValues.length > 0 ? selectedValues.join(", ") : defaultLabel;
  }, [selectedValues, defaultLabel, getDisplayLabel]);

  const handleOptionToggle = (option: string) => {
    setCurrentFilter((prev: any) => {
      const currentValues: string[] = prev[filterKey] || [];
      const isAdding = !currentValues.includes(option);
      let updatedValues: string[];
      if (multiple) {
        updatedValues = isAdding
          ? [...currentValues, option]
          : currentValues.filter((val) => val !== option);
      } else {
        updatedValues = isAdding ? [option] : [];
      }
      // Закрываем диалог только если добавили новую опцию
      if (isAdding && collapseOnSelect) {
        setIsModalOpen(false);
      }
      return { ...prev, [filterKey]: updatedValues };
    });
    resetPageAndReloadData();
  };

  const renderOptionsList = () => (
    <Box sx={{ display: "flex", marginTop: "10px", flexDirection: "column", width: "100%" }}>
      {sortedOptions.map((option) => (
        <Box
          key={option}
          onClick={() => handleOptionToggle(option)}
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "12px 1px",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          <Checkbox
            color="default"
            sx={{
              "& .MuiSvgIcon-root": { fontSize: "18px" },
              color: theme === "dark" ? "white" : "black",
            }}
            checked={selectedValues.includes(option)}
          />
          <Typography sx={{ marginLeft: "8px", fontSize: "1rem", color: checkTheme(theme, "white", "black") }}>
            {transformOption ? transformOption(option) : option}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  const modalTitle = modalTitleMap[filterKey] || displayLabel;

  return (
    <>
      <Box sx={accordionContainerStyles(theme)}>
        <Box onClick={() => setIsModalOpen(true)} sx={accordionHeaderStyles(false)}>
          <Typography sx={{ fontSize: "12px", display: "flex", alignItems: "center" }}>
            {icon}
            {transformOption ? transformOption(displayLabel) : displayLabel}
          </Typography>
          <ExpandMoreIcon sx={{ transition: "0.3s" }} />
        </Box>
      </Box>
   
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            backgroundColor: checkTheme(theme, "#111827", "f2f2f229"),
          },
        }}
        sx={{
          backgroundColor: checkTheme(theme, "#111827", "f2f2f229"),
        }}
      >
        <DialogTitle
          sx={{
            height: "50px",
            backgroundColor: checkTheme(theme, "#37455b", "black"),
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {modalTitle}{" "}
            {loading && <CircularProgress size={"1rem"} sx={{ color: "white" }} />}
          </Typography>
          <IconButton onClick={() => setIsModalOpen(false)}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            overflowY: "auto",
            maxHeight: "calc(100vh - 64px)",
            backgroundColor: checkTheme(theme, "#111827", "f2f2f229"),
          }}
        >
          {renderOptionsList()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default React.memo(UniversalMobileFilter);
