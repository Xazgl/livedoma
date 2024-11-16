"use client";

import { ObjectIntrum } from "@prisma/client";
import {
  FilteblackProps,
  FilterUserOptions,
  allObjects,
} from "../../../../../@types/dto";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Link,
  Slide,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RangeSlider from "../../filterFields/price/RangeSlider";
import { CategoriesCheckbox } from "../../filterFields/categories/CategoriesCheckbox";
import { StreetSelect } from "../../filterFields/adress/StreetSelect";
import styles from "./Filter.module.css";
import { CompanySelect } from "../../filterFields/company/CompanySelect";
import CurrencyRubleIcon from "@mui/icons-material/CurrencyRuble";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import { RoomsSelector } from "../../filterFields/rooms/Rooms";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Renovation } from "../../filterFields/renovation/Renovation";
import { Floor } from "../../filterFields/floor/Floor";
import { CitySelect } from "../../filterFields/adress/CitySelect";
import { DistSelect } from "../../filterFields/adress/DistSelect";
import { useTheme } from "../../provider/ThemeProvider";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

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
};

const filterRow = "flex w-full p-4 h-auto ";

export default function Filter({
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
}: Props) {
  const { favorites } = useSelector((state: RootState) => state.favorite);
  const { theme } = useTheme();

  //функция для сброса фильтров
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
      sortOrder: [],
    }));
    resetPageAndReloadData();
  }

  const showFilter = isVisibleFilter ? "hidden md:flex" : "hidden ";

  return (
    <>
      <Slide direction="left" in={isVisibleFilter}  timeout={500}>
        <aside
          style={{ transition: "all 0.5s" }}
          className={`${showFilter}  flex-col  w-[20%]  h-[full] md:h-[80vh]  items-center 
            sticky  top-0  right-0    rounded  overflow-auto  ${
              theme === "dark" ? "bg-[#3a3f4635]" : "bg-[transparent]"
            } `}
          id={styles.aside}
        >
          <div className={filterRow}>
            <StreetSelect
              filteblackProps={filteblackProps}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
              resetPageAndReloadData={resetPageAndReloadData}
            />
          </div>

          <div className={filterRow}>
            <CitySelect
              filteblackProps={filteblackProps}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
              resetPageAndReloadData={resetPageAndReloadData}
            />
          </div>
          <div className={filterRow}>
            <DistSelect
              filteblackProps={filteblackProps}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
              resetPageAndReloadData={resetPageAndReloadData}
            />
          </div>

          <div className={filterRow}>
            <CategoriesCheckbox
              filteblackProps={filteblackProps}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
              resetPageAndReloadData={resetPageAndReloadData}
            />
          </div>

          {/* {!currentFilter.category ||currentFilter.category.length === 0 ||currentFilter.category[0] !== "Земельные участки"   && currentFilter.category[0] !== "Гаражи и машиноместа" ?  */}
          <div className={filterRow}>
            <RoomsSelector
              filteblackProps={filteblackProps}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
              resetPageAndReloadData={resetPageAndReloadData}
            />
          </div>
          {/* :  null
         }  */}

          <div className={filterRow}>
            <Renovation
              filteblackProps={filteblackProps}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
            />
          </div>

          <div className={filterRow}>
            <CompanySelect
              filteblackProps={filteblackProps}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
              resetPageAndReloadData={resetPageAndReloadData}
            />
          </div>

          <div className={filterRow}>
            <Floor
              filteblackProps={filteblackProps}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
            />
          </div>

          <div className={filterRow}>
            <Accordion
              sx={{
                width: "100%",
                bgcolor: theme === "dark" ? "#3a3f467a" : "white",
                color: theme === "dark" ? "white" : "black",
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    sx={{ color: theme === "dark" ? "white" : "#0000008a" }}
                  />
                }
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography sx={{ fontSize: "14px" }}>
                  <CurrencyRubleIcon /> Цена
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <RangeSlider
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  valueSliderPrice={valueSliderPrice}
                  setValueSliderPrice={setValueSliderPrice}
                  setMinPrice={setMinPrice}
                  setMaxPrice={setMaxPrice}
                  resetPageAndReloadData={resetPageAndReloadData}
                />
              </AccordionDetails>
            </Accordion>
          </div>

          <div className={filterRow}>
            <button
              id="button"
              type="button"
              onClick={resetFilteblackCars}
              style={{ transition: "all 0.5s" }}
              className={` flex  justify-center  items-center  w-[100%] 
            h-[40px] block w-full rounded  bg-[#55529fbd]    
           text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)]
           hover:bg-[#55529f]
            hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)]
            focus:bg-[#55529fda] focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)]
            active:bg-[#54529F] active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal 
            transition duration-150 ease-in-out focus:outline-none focus:ring-0`}
            >
              Очистить фильтр
            </button>
          </div>

          <div className="flex w-full p-4 h-auto">
            {countObjects == 1 ? (
              <h6 className="text-[#88898b]">
                <MapsHomeWorkIcon /> {countObjects} объект
              </h6>
            ) : countObjects > 1 && countObjects <= 4 ? (
              <h6 className="text-[#d1d7dd]">
                <MapsHomeWorkIcon /> {countObjects} объекта
              </h6>
            ) : (
              <h6 className="text-[#d1d7dd]">
                {" "}
                <MapsHomeWorkIcon /> {countObjects} объекта
              </h6>
            )}
          </div>

          {favorites && favorites.length > 0 && (
            <div className={filterRow}>
              {favorites && favorites.length > 0 ? (
                <div
                  className={`flex justify-end  w-[100%]   ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  <div className="cursor-pointer  gap-[5px] items-center  transition  duration-700  ease-in-out ">
                    <Link
                      href={`/cart/${favorites[0].sessionId}`}
                      style={{ textDecoration: "none" }}
                      className={`w-[100%] h-[100%]   ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      <a rel="noopener noreferrer">
                        <FavoriteBorderIcon sx={{ fontSize: "20px" }} />
                        <span
                          className={`text-sm  ${
                            theme === "dark" ? "text-white" : "text-black"
                          }`}
                        >
                          {favorites.length}
                        </span>
                      </a>
                    </Link>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </aside>
      </Slide>
    </>
  );
}
