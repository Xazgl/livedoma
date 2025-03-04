// MobileFiltersContainer.tsx
"use client";

import React from "react";
import HouseIcon from "@mui/icons-material/House";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import SchemaIcon from "@mui/icons-material/Schema";
import FormatPaintIcon from "@mui/icons-material/FormatPaint";
import StoreIcon from "@mui/icons-material/Store";
import UniversalMobileFilter from "../universalFilter/UniversalMobileFilter";

import { checkTheme } from "@/shared/utils";
import { operationTypeNormalize } from "../filterFields/operationType/utils";
import { ObjectIntrum } from "@prisma/client";
import { FilterUserOptions, FilteblackProps } from "../../../../@types/dto";
import FilterMobile from "../main-block-filter/filter-sidebar/FilterMobile";
import { filterNonEmptyOptions } from "./utils";

interface MobileFiltersContainerProps {
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

const MobileFiltersContainer: React.FC<MobileFiltersContainerProps> = ({
  theme,
  filteblackProps,
  currentFilter,
  setCurrentFilter,
  resetPageAndReloadData,
  loading,
  objects,
  filteredHouse,
  setFilteredHouse,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  valueSliderPrice,
  setValueSliderPrice,
  countObjects,
}) => {
  function resetFilteblackCars() {
    setFilteredHouse(objects);
    setCurrentFilter((prevFilterState) => ({
      ...prevFilterState,
      category: [],
      operationType: [],
      state: [],
      city: [],
      street: [],
      minPrice: 0,
      maxPrice: undefined,
      companyName: [],
      passengerElevator: [],
      freightElevator: [],
      ceilingHeight: [],
      renovation: [],
      rooms: [],
      square: [],
      floors: [],
      floor: [],
      wallsType: [],
    }));
    resetPageAndReloadData();
  }
  return (
    <div className="flex items-center flex-col gap-2">
      <div
        className={`flex p-5 rounded-[10px] flex-col gap-4 w-[90%] ${checkTheme(
          theme,
          "bg-[#3a3f4635]",
          "bg-gradient-to-r from-[rgb(227,247,255)] to-[rgb(244,238,254)]"
        )}`}
      >
        {/* Первая строка фильтров */}
        <div className="flex wrap w-full hight-[40px] gap-2 justify-between">
          <UniversalMobileFilter
            filterKey="category"
            options={filterNonEmptyOptions(filteblackProps.categories)}
            defaultLabel="Категория"
            icon={
              <HouseIcon style={{ marginRight: "8px", fontSize: "16px" }} />
            }
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            resetPageAndReloadData={resetPageAndReloadData}
            multiple={false}
            collapseOnSelect={true}
            loading={loading}
          />
          <UniversalMobileFilter
            filterKey="operationType"
            options={filterNonEmptyOptions(filteblackProps.operationTypes)}
            defaultLabel="Выберите тип"
            icon={
              <WysiwygIcon style={{ marginRight: "8px", fontSize: "16px" }} />
            }
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            resetPageAndReloadData={resetPageAndReloadData}
            multiple={false}
            collapseOnSelect={true}
            transformOption={operationTypeNormalize}
            loading={loading}
          />
        </div>
        {/* Вторая строка фильтров */}
        <div className="flex w-full hight-[40px] gap-2 justify-between">
          <UniversalMobileFilter
            filterKey="rooms"
            options={filterNonEmptyOptions(filteblackProps.rooms)}
            defaultLabel="Комнат"
            icon={
              <SchemaIcon style={{ marginRight: "8px", fontSize: "16px" }} />
            }
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            resetPageAndReloadData={resetPageAndReloadData}
            multiple={true}
            collapseOnSelect={false}
            loading={loading}
          />
          <UniversalMobileFilter
            filterKey="renovationTypes"
            options={filterNonEmptyOptions(filteblackProps.renovationTypes)}
            defaultLabel="Ремонт"
            icon={
              <FormatPaintIcon
                style={{ marginRight: "8px", fontSize: "16px" }}
              />
            }
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            resetPageAndReloadData={resetPageAndReloadData}
            multiple={true}
            collapseOnSelect={false}
            loading={loading}
          />
        </div>
        {/* Третья строка фильтров */}
        <div className="flex w-full hight-[40px] gap-2 justify-between">
          <UniversalMobileFilter
            filterKey="companyName"
            options={filterNonEmptyOptions(filteblackProps.companyNames)}
            defaultLabel="Компании"
            icon={<StoreIcon sx={{ marginRight: "8px", fontSize: "16px" }} />}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            resetPageAndReloadData={resetPageAndReloadData}
            multiple={true}
            collapseOnSelect={true}
            transformOption={(name) =>
              name === 'Агентство "Партнер"' ? "Партнер" : name
            }
            loading={loading}
          />
          <FilterMobile
            objects={objects}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            filteredHouse={filteredHouse}
            setFilteredHouse={setFilteredHouse}
            minPrice={minPrice}
            maxPrice={maxPrice}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
            filteblackProps={filteblackProps}
            valueSliderPrice={valueSliderPrice}
            setValueSliderPrice={setValueSliderPrice}
            countObjects={countObjects}
            resetPageAndReloadData={resetPageAndReloadData}
            loading={loading}
          />
        </div>

        <div className="flex ">
          <button
            style={{
              transition: "all 1s",
              backgroundColor:  checkTheme(theme, "#3a3f46c9", "rgba(255, 255, 255, .7)"),
              fontSize: "12px",
              color: checkTheme(theme, "white", "black"),
              borderRadius: "8px",
            }}
            className="flex  justify-center  items-center  w-[100%]  h-[40px] rounded color-[white] 
                              cursor-pointer transition  duration-700  ease-in-out "
            onClick={resetFilteblackCars}
          >
            Сбросить
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MobileFiltersContainer);
