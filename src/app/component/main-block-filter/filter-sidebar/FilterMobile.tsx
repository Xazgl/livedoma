"use client";
import { ObjectIntrum } from "@prisma/client";
import {
  FilteblackProps,
  FilterUserOptions,
  allObjects,
} from "../../../../../@types/dto";
import { Dispatch, SetStateAction, useState } from "react";
import "./style.css";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Link,
  Skeleton,
  Slide,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RangeSlider from "../../filterFields/price/RangeSlider";
import { CategoriesCheckbox } from "../../filterFields/categories/CategoriesCheckbox";
import { CompanySelect } from "../../filterFields/company/CompanySelect";
import TuneIcon from "@mui/icons-material/Tune";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Renovation } from "../../filterFields/renovation/Renovation";
import { Floor } from "../../filterFields/floor/Floor";
import { CitySelect } from "../../filterFields/adress/CitySelect";
import { RoomsSelector } from "../../filterFields/rooms/Rooms";
import { DistSelect } from "../../filterFields/adress/DistSelect";
import { useTheme } from "../../provider/ThemeProvider";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import CloseIcon from "@mui/icons-material/Close";
import { checkTheme } from "@/shared/utils";
import StreetSelectBig from "../../filterFields/adress/searchStreetNew/StreetSelectBig";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import FilterSkeleton from "./skeleton/Skeleton";
import { OperationTypeSelect } from "../../filterFields/operationType/OperationTypeSelect";

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
  loading: boolean;
};

const filterRow = "flex  w-full  p-4  h-auto";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FilterMobile({
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
  loading,
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
    }));
    resetPageAndReloadData();
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    // <div className="flex md:hidden w-full justify-center sticky top-0 left-0 z-[999]">
    <div className="flex ">
      <Button
        onClick={handleOpenModal}
        sx={{
          // backgroundColor: checkTheme(
          //   theme,
          //   "#37455b",
          //   "#131313f0"
          // ),
          // color: "white",
          backgroundColor: checkTheme(
            theme,
            "#3a3f46c9",
            "rgba(255, 255, 255, .7)"
          ),
          color: checkTheme(theme, "white", "black"),
          width: "100%",
          display: "flex",
          justifyContent: "center",
          borderRadius: "8px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          // padding: "10px",
          // "&:hover": {
          //   backgroundColor: "#131313f0",
          //   opacity: 1,
          // },
        }}
      >
        <Typography
          sx={{ fontSize: "14px", display: "flex", alignItems: "center" }}
        >
          <TuneIcon sx={{ marginRight: "8px", fontSize: "19px" }} />
          {/* Параметры поиска  */}
        </Typography>
        {favorites && favorites.length > 0 && (
          <div className="flex items-center gap-[3px]">
            <FavoriteBorderIcon sx={{ fontSize: "18px" }} /> {favorites.length}
          </div>
        )}
      </Button>

      {/* Модальное окно */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            height: "100vh",
            backgroundColor: checkTheme(theme, "#111827", "f2f2f229"),
          },
        }}
        sx={{
          backgroundColor: checkTheme(theme, "#111827", "f2f2f229"),
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: checkTheme(theme, "#37455b", "black"),
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>
            {loading ? (
              <CircularProgress size={"17px"} color="inherit" />
            ) : (
              "Ваши фильтры"
            )}
          </Typography>
          <CloseIcon sx={{ cursor: "pointer" }} onClick={handleCloseModal} />
        </DialogTitle>
        <DialogContent
          sx={{
            width: "100%",
            padding: 0,
            backgroundColor: checkTheme(theme, "#111827", "f2f2f229"),
            color: "white",
          }}
        >
          <div
            id="aside"
            className="flex flex-col w-full items-center mt-[5px] justify-start "
            style={{ height: "100vh", overflow: "auto" }}
          >
            {/*контент */}

            <div className={filterRow}>
              {loading ? (
                <Skeleton
                  variant="rectangular"
                  animation="pulse"
                  width="100%"
                  height="56px"
                  sx={{
                    borderRadius: "20px",
                    bgcolor: checkTheme(
                      theme,
                      "#3a3f46c9",
                      "rgba(255, 255, 255, .7)"
                    ),
                  }}
                />
              ) : (
                <StreetSelectBig
                  filteblackProps={filteblackProps}
                  currentFilter={currentFilter}
                  setCurrentFilter={setCurrentFilter}
                  resetPageAndReloadData={resetPageAndReloadData}
                />
              )}
            </div>

            <div className={filterRow}>
              {loading ? (
                <FilterSkeleton height={"48px"} borderRadius={"4px"} />
              ) : (
                <OperationTypeSelect
                  filteblackProps={filteblackProps}
                  currentFilter={currentFilter}
                  setCurrentFilter={setCurrentFilter}
                  resetPageAndReloadData={resetPageAndReloadData}
                />
              )}
            </div>

            <div className={filterRow}>
              {loading ? (
                <FilterSkeleton height={"48px"} borderRadius={"4px"} />
              ) : (
                <CitySelect
                  filteblackProps={filteblackProps}
                  currentFilter={currentFilter}
                  setCurrentFilter={setCurrentFilter}
                  resetPageAndReloadData={resetPageAndReloadData}
                />
              )}
            </div>

            <div className={filterRow}>
              {loading ? (
                <FilterSkeleton height={"48px"} borderRadius={"4px"} />
              ) : (
                <DistSelect
                  filteblackProps={filteblackProps}
                  currentFilter={currentFilter}
                  setCurrentFilter={setCurrentFilter}
                  resetPageAndReloadData={resetPageAndReloadData}
                />
              )}
            </div>

            <div className={filterRow}>
              {loading ? (
                <FilterSkeleton height={"48px"} borderRadius={"4px"} />
              ) : (
                <CategoriesCheckbox
                  filteblackProps={filteblackProps}
                  currentFilter={currentFilter}
                  setCurrentFilter={setCurrentFilter}
                  resetPageAndReloadData={resetPageAndReloadData}
                />
              )}
            </div>

            <div className={filterRow}>
              {loading ? (
                <FilterSkeleton height={"48px"} borderRadius={"4px"} />
              ) : (
                <RoomsSelector
                  filteblackProps={filteblackProps}
                  currentFilter={currentFilter}
                  setCurrentFilter={setCurrentFilter}
                  resetPageAndReloadData={resetPageAndReloadData}
                />
              )}
            </div>

            <div className={filterRow}>
              {loading ? (
                <FilterSkeleton height={"48px"} borderRadius={"4px"} />
              ) : (
                <CompanySelect
                  filteblackProps={filteblackProps}
                  currentFilter={currentFilter}
                  setCurrentFilter={setCurrentFilter}
                  resetPageAndReloadData={resetPageAndReloadData}
                />
              )}
            </div>

            <div className={filterRow}>
              {loading ? (
                <FilterSkeleton height={"48px"} borderRadius={"4px"} />
              ) : (
                <Renovation
                  filteblackProps={filteblackProps}
                  currentFilter={currentFilter}
                  setCurrentFilter={setCurrentFilter}
                />
              )}
            </div>

            <div className={filterRow}>
              {loading ? (
                <FilterSkeleton height={"48px"} borderRadius={"4px"} />
              ) : (
                <Floor
                  filteblackProps={filteblackProps}
                  currentFilter={currentFilter}
                  setCurrentFilter={setCurrentFilter}
                />
              )}
            </div>

            <div className={filterRow}>
              {loading ? (
                <FilterSkeleton height={"48px"} borderRadius={"4px"} />
              ) : (
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
                      resetPageAndReloadData={resetPageAndReloadData}
                    />
                  </AccordionDetails>
                </Accordion>
              )}
            </div>

            {favorites && favorites.length > 0 && (
              <div className={filterRow}>
                {favorites && favorites.length > 0 ? (
                  <Link
                    href={`/cart/${favorites[0].sessionId}`}
                    className="w-[100%] h-[100%] text-white"
                    style={{ textDecoration: "none" }}
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
                          <span className="text-sm">{favorites.length}</span>
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
                style={{
                  transition: "all 1s",
                  backgroundColor: checkTheme(theme, "#37455b", "#131313f0"),
                }}
                className="flex  justify-center  items-center  w-[100%]  h-[40px] rounded color-[white] 
                      cursor-pointer transition  duration-700  ease-in-out "
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
        </DialogContent>
      </Dialog>
    </div>
    // </div>
  );
}
