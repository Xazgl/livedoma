"use client";
import FilterPrice from "../../../filterFields/price/new/RangeSlider";
import FilterCompany from "../../../filterFields/company/new/FilterCompany";
import FilterRenovation from "../../../filterFields/renovation/new/renovation";
import SkeletonLoader from "../sketelot-filter";
import { Props } from "./type";
import React from "react";


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
    <div className={`flex mt-[20px] w-[100%] justify-between`}>
      {loading ? (
        <SkeletonLoader count={3} width="33%" />
      ) : (
        <>
          <div className={`flex w-[32%]`}>
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
          <div className={`flex w-[32%]`}>
            <FilterCompany
              filteblackProps={filteblackProps}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
              resetPageAndReloadData={resetPageAndReloadData}
            />
          </div>
          <div className={`flex w-[32%]`}>
            <FilterRenovation
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
