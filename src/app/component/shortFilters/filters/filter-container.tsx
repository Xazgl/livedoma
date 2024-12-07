"use client";
import { Props } from "./type";
import { calculateFilterWidth, getClassFilterBox } from "../utils";
import React, { useMemo } from "react";
import { getFilterConfig } from "./firstRowFilter/first-row-filter";
import SkeletonLoader from "./sketelot-filter";
import SecondFilterRow from "./secondRowFilter/second-row-filter";
import FloorFilter from "@/app/component/filterFields/floor/new/Floor";
import FloorSelector from "../../filterFields/floor/new/FloorSelector";
import { checkTheme } from "@/shared/utils";
import { Typography } from "@mui/material";

const FilterContainer = ({
  filteblackProps,
  currentFilter,
  setCurrentFilter,
  resetPageAndReloadData,
  theme,
  loading,
  maxPrice,
  minPrice,
  valueSliderPrice,
  setValueSliderPrice,
  setMinPrice,
  setMaxPrice,
  setFilteredHouse,
  objects,
}: Props) => {
  const classFilterBox = useMemo(() => getClassFilterBox(theme), [theme]);

  // Получаем конфигурацию фильтров
  const filtersFirstRow = useMemo(
    () =>
      getFilterConfig({
        filteblackProps,
        currentFilter,
        setCurrentFilter,
        resetPageAndReloadData,
      }),
    [filteblackProps, currentFilter, setCurrentFilter, resetPageAndReloadData]
  );

  // Фильтруем видимые фильтры
  const visibleFiltersFirstRow = useMemo(
    () => filtersFirstRow.filter((filter) => filter.isVisible),
    [filtersFirstRow]
  );

  // Определяем ширину фильтров в зависимости от их количества
  const firstRowWidth = useMemo(
    () => calculateFilterWidth(visibleFiltersFirstRow.length),
    [visibleFiltersFirstRow.length]
  );

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
    <div className={classFilterBox}>
      <div className={`flex w-[100%] justify-between`}>
        {loading ? (
          <SkeletonLoader count={3} width="33%" />
        ) : (
          visibleFiltersFirstRow.map((filter) => (
            <div
              key={filter.key}
              style={{ width: firstRowWidth }}
              className="flex"
            >
              {filter.component}
            </div>
          ))
        )}
      </div>
      <SecondFilterRow
        loading={loading}
        minPrice={minPrice}
        maxPrice={maxPrice}
        valueSliderPrice={valueSliderPrice}
        setValueSliderPrice={setValueSliderPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        resetPageAndReloadData={resetPageAndReloadData}
        filteblackProps={filteblackProps}
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
      />
      <div className={`flex mt-[20px] w-[100%] justify-between`}>
        <div className={`flex w-[49%] `}>
          <FloorFilter
            filteblackProps={filteblackProps}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
          />
        </div>
        <div className={`flex w-[49%] `}>
          <FloorSelector
            filteblackProps={filteblackProps}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
          />
        </div>
      </div>
      <div className={`flex mt-[20px] w-[100%] justify-end`}>
        <div className={`flex  w-[15%]`}>
          <button
            style={{
              transition: "all 1s",
              color: checkTheme(theme, "white", "black"),
              backgroundColor: checkTheme(theme, "#3a3f4669", "white"),
              whiteSpace: "nowrap",
            }}
            className="flex  justify-center  items-center  w-[100%]  h-[40px] rounded 
           p-3  hover:bg-[#54529F]  cursor-pointer"
            onClick={resetFilteblackCars}
          >
            <Typography
              sx={{ fontSize: "14px", display: "flex", alignItems: "center" }}
            >
              Сбросить фильтры
            </Typography>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FilterContainer);
