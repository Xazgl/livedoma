"use client";

import { ObjectIntrum } from "@prisma/client";
import {
  FavoriteObj,
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
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RangeSlider from "../../filterFields/price/RangeSlider";
import { CategoriesCheckbox } from "../../filterFields/categories/CategoriesCheckbox";
import { StreetSelect } from "../../filterFields/adress/StreetSelect";
import styles from "./Filter.module.css";
import { CompanySelect } from "../../filterFields/company/CompanySelect";
import TuneIcon from "@mui/icons-material/Tune";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

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
  setAllPages: Dispatch<SetStateAction<number>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  currentPage: number;
  filteblackProps: FilteblackProps;
  valueSliderPrice: [number, number];
  setValueSliderPrice: Dispatch<SetStateAction<[number, number]>>;
  countObjects: number;
  setFavArr: Dispatch<SetStateAction<FavoriteObj[]>>;
  favArr: FavoriteObj[];
};

const filterRow = "flex  w-full  p-4  h-auto";

export function FilterMobile({
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
  favArr,
  setFavArr,
}: Props) {
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

  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChangeBar =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <aside className="flex  md:hidden  w-full  justify-center  sticky  top-0  left-0  z-[999]">
      <div className="flex  flex-col  items-center  w-[90%]  h-[auto]  ">
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChangeBar("panel1")}
          sx={{
            backgroundColor: "#131313f0",
            color: "white",
            margin: "1px",
            width: "100%",
            position:'relative'
          }}
        >
          <AccordionSummary
            expandIcon={<TuneIcon sx={{ color: "white", width: "40px" }} />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <h1 className="flex w-[100%] text-[14px] s:text-[16px]">
              Параметры поиска
              {favArr && favArr.length > 0 ? (
                <div className="flex pl-[10%] md:pl-[50%] items-center gap-[3px]">
                  <FavoriteBorderIcon sx={{ fontSize: "18px" }} />{" "}
                  {favArr.length}
                </div>
              ) : (
                ""
              )}
            </h1>
          </AccordionSummary>
          <AccordionDetails
            sx={{  backgroundColor: "#f2f2f21a", width: "100%"  }}
            // sx={{zIndex:'999', backgroundColor: "#f2f2f21a", width: "100%",position:`${expanded ? ' absolute' : 'relative'}`    }}
          >
            <div
              className={`flex  flex-col w-full  md:w-[20%]   h-[100%]  items-center 
                                    sticky  top-0  right-0`}
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
                <Accordion sx={{ width: "100%" }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography sx={{ fontSize: "14px" }}>Цена, ₽</Typography>
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

              {favArr && favArr.length > 0 && (
                <div className={filterRow}>
                  {favArr && favArr.length > 0 ? (
                    <Link
                      href={`/cart/${favArr[0].sessionId}`}
                      className="w-[100%] h-[100%] text-white"
                      style={{textDecoration:'none'}}
                    >
                      <a rel="noopener noreferrer">
                        <button
                          className={`flex justify-center  gap-[5px] items-center w-[100%]  h-[40px] rounded
                 bg-[#54529F] #54529F  hover:bg-[#F15281]  cursor-pointer 
                       transition  duration-700  ease-in-out 
                 `}
                        >
                          <>
                            Избранное
                            <FavoriteBorderIcon sx={{ fontSize: "15px" }} />
                            <span className="text-sm">{favArr.length}</span>
                          </>
                        </button>
                      </a>
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
              )}

              <div className={filterRow}>
                <button
                  className="flex  justify-center  items-center  w-[100%]  h-[40px] rounded color-[white] 
                     bg-[#F15281]  hover:bg-[#54529F]  cursor-pointer 
                       transition  duration-700  ease-in-out "
                  onClick={resetFilteblackCars}
                >
                  Очистить фильтр
                </button>
              </div>

              <div className="flex w-full p-4 h-auto">
                {countObjects == 1 ? (
                  <h6 className="text-[#88898b]">{countObjects} объект</h6>
                ) : countObjects > 1 && countObjects <= 4 ? (
                  <h6 className="text-[#d1d7dd]">{countObjects} объекта</h6>
                ) : (
                  <h6 className="text-[#d1d7dd]"> {countObjects} объекта</h6>
                )}
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </aside>
  );
}
