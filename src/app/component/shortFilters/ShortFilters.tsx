import { RootState } from "@/app/redux/store";
import { useTheme } from "../provider/ThemeProvider";
import { useSelector } from "react-redux";
import {
  allObjects,
  FilteblackProps,
  FilterUserOptions,
} from "../../../../@types/dto";
import { Dispatch, SetStateAction } from "react";
import { ObjectIntrum } from "../../../../prisma";
import React from "react";
import { StreetSelectBig } from "../filterFields/adress/searchStreetNew/StreetSelectBig";

type Props = {
  objects: allObjects;
  currentFilter: FilterUserOptions;
  setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
  setFilteredHouse: Dispatch<SetStateAction<ObjectIntrum[]>>;
  filteredHouse: ObjectIntrum[];
  maxPrice: number;
  minPrice: number;
  setMinPrice: Dispatch<SetStateAction<number>>;
  setMaxPrice: Dispatch<SetStateAction<number>>;
  filteblackProps: FilteblackProps;
  valueSliderPrice: [number, number];
  setValueSliderPrice: Dispatch<SetStateAction<[number, number]>>;
  countObjects: number;
  resetPageAndReloadData: () => void;
  isVisibleFilter: boolean;
  setIsVisibleFilter: Dispatch<SetStateAction<boolean>>;
};

const filterRow = "flex w-full p-4 h-auto ";

function ShortFilters({
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
}: Props) {
  const { favorites } = useSelector((state: RootState) => state.favorite);
  const { theme } = useTheme();

  const toggleVisibility = () => {
    setIsVisibleFilter(!isVisibleFilter);
  };

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
        <div className="flex flex-end w-[90%]">
          <button
            onClick={toggleVisibility}
            className=" bg-blue-500 text-white rounded"
          >
            {isVisibleFilter ? "Скрыть фильтры" : "Показать фильтры"}
          </button>
        </div>
      </section>
    </>
  );
}

export default React.memo(ShortFilters);
