"use client";

import React, { useState, useEffect, useRef } from "react";
import MobileFilterContainer from "./MobileFilterContainer";
import { FilterUserOptions, FilteblackProps } from "../../../../@types/dto";
import { ObjectIntrum } from "@prisma/client";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { checkTheme } from "@/shared/utils";
import TuneIcon from '@mui/icons-material/Tune';

interface StickyMobileFilterProps {
  theme: string;
  filteblackProps: FilteblackProps;
  currentFilter: FilterUserOptions;
  setCurrentFilter: React.Dispatch<React.SetStateAction<FilterUserOptions>>;
  resetPageAndReloadData: () => void;
  loading: boolean;
  objects: ObjectIntrum[];
  filteredHouse: ObjectIntrum[];
  setFilteredHouse: React.Dispatch<React.SetStateAction<ObjectIntrum[]>>;
  minPrice: number;
  maxPrice: number;
  setMinPrice: React.Dispatch<React.SetStateAction<number>>;
  setMaxPrice: React.Dispatch<React.SetStateAction<number>>;
  valueSliderPrice: [number, number];
  setValueSliderPrice: React.Dispatch<React.SetStateAction<[number, number]>>;
  countObjects: number;
}

const StickyMobileFilter: React.FC<StickyMobileFilterProps> = (props) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  // Сохраним исходное расстояние от контейнера до верха страницы
  const [initialOffset, setInitialOffset] = useState<number>(0);

  useEffect(() => {
    if (containerRef.current) {
      const offset =
        containerRef.current.getBoundingClientRect().top + window.scrollY;
      setInitialOffset(offset);
    }
  }, []);

  const handleScroll = () => {
    if (window.scrollY >= initialOffset) {
      setIsSticky(true);
      // При липкости по умолчанию фильтр сворачивается
      setIsExpanded(false);
    } else {
      setIsSticky(false);
      setIsExpanded(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [initialOffset]);

  const handleToggle = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className={`transition-all duration-300 ${
        isSticky ? "fixed top-0 left-0 right-0 z-50" : ""
      }`}
      style={
        isSticky
          ? {
              backgroundColor: props.theme === "dark" ? "#111827" : "#f2f2f229",
            }
          : {}
      }
    >
      {isSticky ? (
        !isExpanded ? (
          // Если липкий и свернут, показываем кнопку "Показать фильтр"
          <div
            className="cursor-pointer py-2 text-center shadow-md  rounded-bl-[10px] rounded-br-[10px]"
            onClick={handleToggle}
            style={{
              backgroundColor: props.theme === "dark" ? "#37455b" : "#fff",
              color: checkTheme(props.theme, "white", "black"),
            }}
          >
            <span className="text-base font-medium">Недвижимость<TuneIcon sx={{fontSize:'20px',paddingLeft:'3px'}}/></span>
          </div>
        ) : (
          // Если липкий и развёрнут, показываем полный фильтр и стрелку для сворачивания
          <div>
            <MobileFilterContainer {...props} />
            <div
              className="cursor-pointer  text-center"
              onClick={handleToggle}
            >
              <div className="flex justify-center w-full">
                <div
                  className={`w-[90%] mt-[5px] rounded-[10px] ${checkTheme(
                    props.theme,
                    "bg-[#3a3f4635]",
                    "bg-gradient-to-r from-[rgb(227,247,255)] to-[rgb(244,238,254)]"
                  )}`}
                >
                  <ExpandLessIcon
                    sx={{ color: checkTheme(props.theme, "white", "black") }}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        // Если не липкий, показываем обычное состояние фильтра
        <MobileFilterContainer {...props} />
      )}
    </div>
  );
};

export default StickyMobileFilter;
