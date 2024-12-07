"use client";
import { ObjectIntrum } from "@prisma/client";
import bg3 from "/public/images/photo/house.webp";
// import bg3 from "/public/images/mainPage/1.webp";
import bg1 from "/public/images/photo/flat2.webp";
// import bg1 from "/public/images/mainPage/2.webp";
import bg2 from "/public/images/photo/commecial.webp";
// import bg2 from "/public/images/mainPage/5.webp";
import bg4 from "/public/images/photo/room.webp";
// import bg4 from "/public/images/mainPage/4.webp";
import Image from "next/image";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
} from "react";
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
import { usePathname, useSearchParams } from "next/navigation";
import { SliderCategory } from "./SliderCategory";
import { useTheme } from "../provider/ThemeProvider";

type Props = {
  objects: allObjects;
  currentFilter: FilterUserOptions;
  setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
  setFilteredHouse: Dispatch<SetStateAction<ObjectIntrum[]>>;
  refCardsObjects: RefObject<HTMLDivElement>;
};

export function SelectCategory({
  objects,
  currentFilter,
  setCurrentFilter,
  setFilteredHouse,
  refCardsObjects,
}: Props) {

  const { theme, toggleTheme } = useTheme();

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

  const searchParams = useSearchParams();
  const pathname = usePathname();

  //функция изменения состояния по клику на картинку
  const createCategoryHandler = (categoryName: string) => () => {
    setCurrentFilter((prevFilterState) => {
      const currentCategory = prevFilterState.category ?? [];
      const newCategory = currentCategory.includes(categoryName)
        ? currentCategory.filter((el) => el !== categoryName)
        : [categoryName];

      // Обновляем URL параметры
      const params = new URLSearchParams(searchParams);
      params.delete("category");
      newCategory.forEach((category) => params.append("category", category));

      const newUrl = `${pathname}?${params.toString()}`;
      window.history.replaceState(null, "", newUrl);

      return {
        ...prevFilterState,
        category: newCategory,
      };
    });
    if (refCardsObjects.current) {
      refCardsObjects.current.scrollIntoView({ behavior: "smooth" });
    }
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
    {
      title: "Комнаты",
      bgSrc: bg4.src,
      handler: () => createCategoryHandler("Комнаты"),
    },
  ];

  const styleCard = `flex  h-[100px] w-[180px]  relative rounded
    xs:w-[300px] xs:h-[150px]
    sm:w-[400px] sm:h-[200px]
    md:w-[500px] md:h-[200px]
    lg:w-[700px] lg:h-[270px] 
    after:duration-[1000ms]   after:ease-in-out   overflow-hidden
    after:w-full after:h-full hover:after:bg-[#0000003f] hover:after:absolute`;

  const title = `flex mt-[5px] w-full text-[14px]  xs:text-[16px] md:text-[20px] ${
    theme === 'dark' ? 'text-white' : 'text-black'
  }`;


  return (
    <>
      <section 
        className={`flex  flex-col  h-full  w-full  items-center sm:items-stretch  
        sm:flex-row sm:flex-wrap justify-center  mt-[40px] gap-[10px]`}
      >
        {categories.map((category, index) => (
          <figure
            key={index}
            className="hidden sm:flex flex-col-reverse sm:flex-col w-[auto] cursor-pointer"
          >
            <div
              className={styleCard}
              onClick={createCategoryHandler(category.title)}
            >
              <Image
                src={category.bgSrc}
                alt={category.title}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                loading="lazy"
                sizes="(max-width: 600px) 80vw,
                 (max-width: 900px) 70vw,
                 (max-width: 1200px) 95vw,
                 95vw"
              />
            </div>
            <figcaption className={title}>{category.title}</figcaption>
          </figure>
        ))}
         
         <SliderCategory
          categories={categories}
          styleCard={styleCard}
          titleClass={title}
          createCategoryHandler={createCategoryHandler}
        />
      </section>
    </>
  );
}


