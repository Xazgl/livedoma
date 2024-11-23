"use client";

import { AccordionDetails, Box, Checkbox, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SchemaIcon from "@mui/icons-material/Schema";
import { useState, useMemo, useRef } from "react";
import React from "react";
import { useTheme } from "@/app/component/provider/ThemeProvider";
import { checkTheme } from "@/shared/utils";
import {
  accordionContainerStyles,
  accordionContentStyles,
  accordionHeaderStyles,
  useOutsideClick,
  useToggleAccordion,
} from "@/app/component/shortFilters/filters/utils";
import { Props } from "./type";

function FilterRooms({
  filteblackProps,
  currentFilter,
  setCurrentFilter,
  resetPageAndReloadData,
}: Props) {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const accordionRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = useToggleAccordion(setIsExpanded);

  const roomOptions = useMemo(
    () =>
      filteblackProps.rooms
        .filter((room: string) => room.trim() !== "") // Исключаем пустые строки
        .sort((a, b) => {
          // Логика сортировки
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
        }),
    [filteblackProps.rooms]
  );

  const selectedRooms = useMemo(() => {
    return currentFilter.rooms?.join(", ") || "Кол-во комнат";
  }, [currentFilter.rooms]);

  const handleRoomToggle = (room: string) => {
    setCurrentFilter((prevFilterState) => {
      const isRoomSelected = prevFilterState.rooms?.includes(room);
      const updatedRooms = isRoomSelected
        ? prevFilterState?.rooms?.filter((r) => r !== room)
        : [...(prevFilterState.rooms ?? []), room];
      return { ...prevFilterState, rooms: updatedRooms };
    });
    resetPageAndReloadData();
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
          <SchemaIcon style={{ marginRight: "8px", fontSize: "19px" }} />
          {selectedRooms}
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
            {roomOptions.map((room: string) => (
              <Box
                key={room}
                onClick={() => handleRoomToggle(room)}
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
                  checked={currentFilter.rooms?.includes(room) || false}
                  onClick={(e) => e.stopPropagation()}
                />
                <Typography sx={{ marginLeft: "8px", fontSize: "0.875rem" }}>
                  {room}
                </Typography>
              </Box>
            ))}
          </div>
        </AccordionDetails>
      )}
    </Box>
  );
}

export default React.memo(FilterRooms);
