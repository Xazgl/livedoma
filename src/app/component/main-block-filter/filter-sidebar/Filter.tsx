"use client";

import { ObjectIntrum } from "@prisma/client";
import {
  FilteblackProps,
  FilterUserOptions,
  allObjects,
} from "../../../../../@types/dto";
import { Dispatch, SetStateAction } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RangeSlider from "../../filterFields/price/RangeSlider";
import { CategoriesCheckbox } from "../../filterFields/categories/CategoriesCheckbox";
import { StreetSelect } from "../../filterFields/adress/StreetSelect";
import styles from "./Filter.module.css";
// import { CitySelect } from "../../filterFields/adress/CitySelect";
import { CompanySelect } from "../../filterFields/company/CompanySelect";
import CurrencyRubleIcon from "@mui/icons-material/CurrencyRuble";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import { RoomsSelector } from "../../filterFields/rooms/Rooms";

type Props = {
  objects: allObjects;
  currentFilter: FilterUserOptions,
  setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>,
  setFilteredHouse: Dispatch<SetStateAction<ObjectIntrum[]>>,
  filteredHouse: ObjectIntrum[],
  maxPrice: number,
  minPrice: number,
  setMinPrice: Dispatch<SetStateAction<number>>;
  setMaxPrice: Dispatch<SetStateAction<number>>;
  setAllPages: Dispatch<SetStateAction<number>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  currentPage:number;
  filteblackProps:FilteblackProps;
  valueSliderPrice:[number, number];
  setValueSliderPrice: Dispatch<SetStateAction<[number, number]>>;
  countObjects:number;
};

const filterRow = "flex w-full p-4 h-auto ";

export function Filter({ filteblackProps,objects, currentFilter, setCurrentFilter, setFilteredHouse, maxPrice, minPrice,setMinPrice, setMaxPrice, 
  valueSliderPrice ,setValueSliderPrice, countObjects }: Props) {

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
  }));
}



  return (
    <>
      <aside
        className={`hidden md:flex  flex-col  w-[20%]   h-[80vh]  items-center 
             sticky  top-0  right-0    rounded overflow-auto `}
        id={styles.aside}
      >
        <div className={filterRow}>
          <StreetSelect
            filteblackProps={filteblackProps}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
          />
        </div>

        <div className={filterRow}>
          <CategoriesCheckbox
            filteblackProps={filteblackProps}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
          />
        </div>

        <div className={filterRow}>
          <RoomsSelector
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
          />
        </div>

        {/* <div className={filterRow}>
                <CitySelect
                    filteblackProps={filteblackProps}
                    currentFilter={currentFilter}
                    setCurrentFilter={setCurrentFilter}
                />
            </div> */}

        <div className={filterRow}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
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
              />
            </AccordionDetails>
          </Accordion>
        </div>

        <div className={filterRow}>
          <button
            className="flex  justify-center  items-center  w-[100%]  h-[40px] rounded color-[white] 
                     bg-[#F15281]  hover:bg-[#3C3C3D]  cursor-pointer 
                       transition  duration-700  ease-in-out "
            onClick={resetFilteblackCars}
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
      </aside>
    </>
  );
}
