"use client";
import { ObjectIntrum } from "@prisma/client";
import bg1 from "/public/images/1.png";
import bg2 from "/public/images/2.png";
import bg3 from "/public/images/3.png";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  categoryFilter,
  ceilingHeightFilter,
  cityFilter,
  companyNameFilter,
  floorFilter,
  floorsFilter,
  freightElevatorFilter,
  operationTypeFilter,
  passengerElevatorFilter,
  priceFilter,
  renovationFilter,
  roomsFilter,
  squareFilter,
  stateFilter,
  streetFilter,
  wallsTypeFilter,
} from "../main-block-filter/filter-sidebar/myFilters";
import { FilterUserOptions, allObjects } from "../../../../@types/dto";
// import { Slide } from "@mui/material"

type Props = {
  objects: allObjects;
  currentFilter: FilterUserOptions;
  setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
  setFilteredHouse: Dispatch<SetStateAction<ObjectIntrum[]>>;
};

export function SelectCategory({
  objects,
  currentFilter,
  setCurrentFilter,
  setFilteredHouse,
}: Props) {
  const changeFilter = (filter: FilterUserOptions) => {
    setCurrentFilter((prevFilterState) => {
      return { ...prevFilterState, ...filter };
    });
  };

  useEffect(() => {
    setFilteredHouse(
      objects.filter((object) => {
        return (
          categoryFilter(object, currentFilter) &&
          operationTypeFilter(object, currentFilter) &&
          stateFilter(object, currentFilter) &&
          cityFilter(object, currentFilter) &&
          streetFilter(object, currentFilter) &&
          priceFilter(object, currentFilter) &&
          companyNameFilter(object, currentFilter) &&
          passengerElevatorFilter(object, currentFilter) &&
          freightElevatorFilter(object, currentFilter) &&
          ceilingHeightFilter(object, currentFilter) &&
          renovationFilter(object, currentFilter) &&
          roomsFilter(object, currentFilter) &&
          squareFilter(object, currentFilter) &&
          floorsFilter(object, currentFilter) &&
          floorFilter(object, currentFilter) &&
          wallsTypeFilter(object, currentFilter)
        );
      })
    );
  }, [currentFilter]);

  //функция изменения состояния по клику на картинку
  const createCategoryHandler = (categoryName: string) => () => {
    setCurrentFilter((prevFilterState) => {
      const currentCategory = prevFilterState.category ?? [];
      if (currentCategory.includes(categoryName)) {
        return {
          ...prevFilterState,
          category: currentCategory.filter((el) => el !== categoryName),
        };
      }
      return {
        ...prevFilterState,
        category: [...currentCategory, categoryName],
      };
    });
  };

  const categories = [
    {
      title: "Квартиры",
      bgSrc: bg1.src,
      handler: () => createCategoryHandler("Квартиры"),
    },
    {
      title: "Коммерческая недвижимость",
      bgSrc: bg2.src,
      handler: () => createCategoryHandler("Коммерческая недвижимость"),
    },
    {
      title: "Дома, дачи, коттеджи",
      bgSrc: bg3.src,
      handler: () => createCategoryHandler("Дома, дачи, коттеджи"),
    },
  ];

  const styleCard = `flex h-[95px] w-[250px] md:w-[300px] relative rounded-bl-lg  rounded-tr-lg
   sm:after:rounded-t-lg after:duration-700 sm:h-full  after:ease-in-out  
   after:w-full after:h-full hover:after:bg-[#0000003f] hover:after:absolute`;
  
    const title = "flex mt-[5px] w-full text-black text-[14px] md:text-[20px]";
  
  return (
    <>
      <section className="flex  flex-col  h-full     w-full  items-center sm:items-stretch sm:h-[200px]   sm:flex-row sm:flex-wrap justify-center gap-[20px] sm:gap-[0px] sm:justify-around  md:justify-between mt-[40px]">

        {categories.map((category, index) => (
          <div key={index} className="flex  flex-col-reverse  sm:flex-col w-[auto] cursor-pointer">
            <div
              className={styleCard}
              style={{
                background: `url(${category.bgSrc})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              onClick={createCategoryHandler(category.title)}
            ></div>
            <h1 className={title}>{category.title}</h1>
          </div>
        ))}
      </section>



      {/*
       <Slide in={true} direction="right" timeout={3000}> 

      {/* 
      <section className="flex  flex-wrap justify-center gap-[20px] sm:gap-[0px] w-full h-[200px] sm:justify-around  md:justify-between mt-[40px]">
        <div className="flex  flex-col w-[auto]  cursor-pointer ">
          <div
            className={styleCard}
            style={{
              background: `url(${bg1.src})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            onClick={createCategoryHandler("Квартиры")}
          ></div>
          <h1 className={title}>Квартиры</h1>
        </div>

        <div className="flex  flex-col w-[auto]  cursor-pointer ">
          <div
            className={styleCard}
            style={{
              background: `url(${bg2.src})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            onClick={createCategoryHandler("Коммерческая недвижимость")}
          ></div>
          <h1 className={title}>Коммерческая недвижимость</h1>
        </div>

        <div className="flex  flex-col w-[auto]  cursor-pointer ">
          <div
            className={styleCard}
            style={{
              background: `url(${bg3.src})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            onClick={createCategoryHandler("Дома, дачи, коттеджи")}
          ></div>
          <h1 className={title}>Дома, дачи, коттеджи</h1>
        </div>
      </section> 
      </Slide> 
      */}


    </>
  );
}
