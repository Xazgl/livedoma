"use client";
import FilterPrice from "../../../filterFields/price/new/RangeSlider";
import FloorFilter from "@/app/component/filterFields/floor/new/Floor";
import FilterRenovation from "../../../filterFields/renovation/new/renovation";
import SkeletonLoader from "../sketelot-filter";
import { Props } from "./type";
import React from "react";
import FloorSelector from "@/app/component/filterFields/floor/new/FloorSelector";

const SecondFilterRow: React.FC<Props> = ({
  loading,
  minPrice,
  maxPrice,
  valueSliderPrice,
  setValueSliderPrice,
  setMinPrice,
  setMaxPrice,
  resetPageAndReloadData,
  filteblackProps,
  currentFilter,
  setCurrentFilter,
}) => {
  
  return (
    <div className={`flex  h-[44px] mt-[20px] w-[100%] justify-between`}>
      {loading ? (
        <SkeletonLoader count={4} width="24%" />
      ) : (
        <>
          <div className={`flex w-[24%]`}>
            <FilterPrice
              minPrice={minPrice}
              maxPrice={maxPrice}
              valueSliderPrice={valueSliderPrice}
              setValueSliderPrice={setValueSliderPrice}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              resetPageAndReloadData={resetPageAndReloadData}
            />
          </div>
          <div className={`flex w-[24%]`}>
            <FilterRenovation
              filteblackProps={filteblackProps}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
            />
          </div>
          <div className={`flex w-[24%] `}>
            <FloorFilter
              filteblackProps={filteblackProps}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
            />
          </div>
          <div className={`flex w-[24%] `}>
            <FloorSelector
              filteblackProps={filteblackProps}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(SecondFilterRow);
