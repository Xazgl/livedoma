"use client";
import { Props } from "./type";
import { calculateFilterWidth, getClassFilterBox } from "../utils";
import React, { useMemo } from "react";
import { getFilterConfig } from "./firstRowFilter/first-row-filter";
import SkeletonLoader from "./sketelot-filter";
import SecondFilterRow from "./secondRowFilter/second-row-filter";

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
}: Props) => {
  const classFilterBox = useMemo(() => getClassFilterBox(theme), [theme]);

  console.log(loading)

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
    </div>
  );
};

export default React.memo(FilterContainer);
