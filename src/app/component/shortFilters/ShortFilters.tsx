import React from "react";
import StreetSelectBig from "../filterFields/adress/searchStreetNew/StreetSelectBig";
import { Props } from "./type";
import { getClassFilterBox } from "./utils";
import FilterContainer from "./filters/filter-container";

function ShortFilters({
  loading,
  theme,
  filteblackProps,
  objects,
  currentFilter,
  setCurrentFilter,
  setFilteredHouse,
  maxPrice,
  minPrice,
  setMinPrice,
  setMaxPrice,
  valueSliderPrice,
  setValueSliderPrice,
  countObjects,
  resetPageAndReloadData,
  isVisibleFilter,
  setIsVisibleFilter,
  filteredHouse
}: Props) {

  return (
    <>
      <section className="hidden md:flex flex-col w-full mt-[20px] items-center ">
        <div className="flex flex-end w-[90%] ">
          <StreetSelectBig
            filteblackProps={filteblackProps}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            resetPageAndReloadData={resetPageAndReloadData}
          />
        </div>
        <FilterContainer
         loading={loading}
         theme={theme}
         setIsVisibleFilter={setIsVisibleFilter}
         isVisibleFilter={isVisibleFilter}
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
        />
      </section>
    </>
  );
}

export default React.memo(ShortFilters);
