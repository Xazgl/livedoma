"use client";
import { ObjectIntrum } from "@prisma/client";
import { useEffect, useMemo, useRef, useState } from "react";
import { FilteblackProps, FilterUserOptions } from "../../../../@types/dto";
import { SelectCategory } from "../selectCategory/SelectCategory";
import {
  categoryFilter,
  ceilingHeightFilter,
  cityFilter,
  companyNameFilter,
  districtFilter,
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
} from "./filter-sidebar/myFilters";
import { usePathname, useSearchParams } from "next/navigation";
import { PaginationRow } from "../paginationRow/PaginatiowRow";
import { useTheme } from "../provider/ThemeProvider";
import ObjectsMap from "../mapObject/objectsMap";
import dynamic from "next/dynamic";
import React from "react";
import ObjectsCardsTest from "./objectsCards/ObjectsCardsTest";

// Динамический импорт компонентов фильтра
const FilterMobile = dynamic(() => import('./filter-sidebar/FilterMobile'));
const Filter = dynamic(() => import('./filter-sidebar/Filter'));

type Props = {
  objects: ObjectIntrum[];
  pages: number;
  page: number;
  priceMax: number;
};

 function ParentFilterBlock({ objects, pages, page, priceMax }: Props) {
  const { theme } = useTheme();
  const refCardsObjects = useRef<HTMLDivElement>(null);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [countObjects, setCountObjects] = useState(0);
  const [mobile, setMobile] = useState(false);
  //Отфильтрованные Квартиры, по умолчанию все квартиры
  const [filteredHouse, setFilteredHouse] = useState<ObjectIntrum[]>(
    objects.length > 0 ? objects.slice(0, 30) : []
  );
  const [mapObj, setMapObj] = useState<ObjectIntrum[]>();
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(
    priceMax
  );
  const [loading, setLoading] = useState<boolean>(true); // загрузка при фильтрации
  /////// Состояния для паганации
  const [currentPage, setCurrentPage] = useState(page); // текущая страница
  const [allPages, setAllPages] = useState<number>(pages); //Всего страниц
  //search params url
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Получаем значения параметров из URL
  const filterFromParams = useMemo(() => {
    const params = new URLSearchParams(searchParams);
    const filter: Partial<FilterUserOptions> = {};
    if (params.has("category")) {
      filter.category = params.getAll("category");
    }
    if (params.has("city")) {
      filter.city = params.getAll("city");
    }
    if (params.has("rooms")) {
      filter.rooms = params.getAll("rooms");
    }
    if (params.has("renovation")) {
      filter.renovation = params.getAll("renovation");
    }
    if (params.has("floor")) {
      filter.floor = params.getAll("floor");
    }
    if (params.has("floors")) {
      filter.floors = params.getAll("floors");
    }
    if (params.has("district")) {
      filter.district = params.getAll("district");
    }
    if (params.has("street")) {
      filter.street = params.getAll("street");
    }
    if (params.has("companyName")) {
      filter.companyName = params.getAll("companyName");
    }
    if (params.has("sortOrder")) {
      filter.sortOrder = params.getAll("sortOrder");
    }
    if (params.has("sortPrice")) {
      filter.sortPrice = params.getAll("sortPrice");
    }
    if (params.has("maxPrice")) {
      const maxPriceParam = params.getAll("maxPrice");
      if (maxPriceParam.length > 0) {
        filter.maxPrice = Number(maxPriceParam[0]);
      }
    }
    if (params.has("minPrice")) {
      const minPriceParam = params.getAll("minPrice");
      if (minPriceParam.length > 0) {
        filter.minPrice = Number(minPriceParam[0]);
      }
    }
    if (params.has("page")) {
      setCurrentPage(parseInt(params.getAll("page")[0], 10));
    }
    return filter;
  }, [searchParams]);


  useEffect(() => {
    if (isFirstRender) {
      
      function handleResize() {
        if (window.innerWidth < 1100) {
            setMobile(true);
       } else if (window.innerWidth > 1100) {
        setMobile(false);
        }   
      }

    window.addEventListener("resize", handleResize);
    // Вызываем handleResize сразу при монтировании компонента

      setCurrentFilter((prevFilterState) => {
        const newFilterState = { ...prevFilterState, ...filterFromParams };
        if (JSON.stringify(prevFilterState) !== JSON.stringify(newFilterState)) {
          return newFilterState;
        }
        return prevFilterState;
      });

      // Проверяем, совпадают ли параметры в currentFilter с URL и отправляем запрос
      const urlParamsCount = Array.from(new URLSearchParams(searchParams).keys()).length;
      const currentFilterParamsCount = Object.keys(filterFromParams).length;

      if (urlParamsCount === currentFilterParamsCount) {
        // Запрос при первом рендере
        const params = new URLSearchParams(searchParams);
        fetch("/api/objects/?" + params.toString())
          .then((res) => res.json())
          .then((el) => {
            setCountObjects(el.countObjects);
            setAllPages(el.totalPages);
            setFilteredHouse(el.allObjects);
            setMapObj(el.allFilteredObject);
            setFilteblackProps((prevFilterState) => ({
              ...prevFilterState,
              categories: el.filter.category,
              cities: el.filter.city,
              rooms: el.filter.rooms,
              renovationTypes: el.filter.renovation,
              floor: el.filter.floor,
              floors: el.filter.floors,
              districts: el.filter.district,
              streets: el.filter.street,
              companyNames: el.filter.companyName,
              price: [el.filter.minPrice, el.filter.maxPrice],
            }));
          });
        setIsFirstRender(false); // Отмечаем, что первый рендер завершен
      }
      handleResize();
      // Убираем обработчик события при размонтировании компонента
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [filterFromParams, isFirstRender, searchParams]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  //Конкретные выбранные фильтры
  const [currentFilter, setCurrentFilter] = useState<FilterUserOptions>({
    category: [],
    operationType: [],
    state: [],
    city: [],
    district: [],
    street: [],
    minPrice: minPrice,
    maxPrice: maxPrice,
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
    sortPrice: [],
  });

  // Инициализация currentFilter при первом рендере
  useEffect(() => {
    if (isFirstRender) {
      setCurrentFilter((prevFilterState) => ({
        ...prevFilterState,
        ...filterFromParams,
      }));
      setIsFirstRender(false);
    }
  }, [filterFromParams, isFirstRender]);

  //Загрузка при изменении фильтра и сброс страницы на 1
 useEffect(() => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
  }, [currentFilter]);

  const resetPageAndReloadData = () => {
    setLoading(true);
    setCurrentPage(1);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const [valueSliderPrice, setValueSliderPrice] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  const changeFilter = (filter: FilterUserOptions) => {
    setCurrentFilter((prevFilterState) => {
      const newFilterState = { ...prevFilterState, ...filter };
      if (JSON.stringify(prevFilterState) !== JSON.stringify(newFilterState)) {
        return newFilterState;
      }
      return prevFilterState;
    });
  };

  useEffect(() => {
    if (
      currentFilter.minPrice !== valueSliderPrice[0] ||
      currentFilter.maxPrice !== valueSliderPrice[1]
    ) {
      changeFilter({
        minPrice: valueSliderPrice[0],
        maxPrice: valueSliderPrice[1],
      });
    }
  }, [valueSliderPrice]);

  useEffect(() => {
    setFilteredHouse(
      objects.filter((object) => {
        return (
          categoryFilter(object, currentFilter) &&
          operationTypeFilter(object, currentFilter) &&
          stateFilter(object, currentFilter) &&
          cityFilter(object, currentFilter) &&
          districtFilter(object, currentFilter) &&
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

  
  useEffect(() => {
    if (!isFirstRender) { // Логика для обычного обновления после первого рендера
      const params = new URLSearchParams();

      if (currentFilter.category) {
        currentFilter.category.forEach((cat) => {
          params.append("category", cat);
        });
      }
      if (currentFilter.city) {
        currentFilter.city.forEach((cit) => {
          params.append("city", cit);
        });
      }
      if (currentFilter.rooms) {
        currentFilter.rooms.forEach((room) => {
          params.append("rooms", room);
        });
      }
      if (currentFilter.renovation) {
        currentFilter.renovation.forEach((renovation) => {
          params.append("renovation", renovation);
        });
      }
      if (currentFilter.district) {
        currentFilter.district.forEach((dist) => {
          params.append("district", dist);
        });
      }
      if (currentFilter.street) {
        currentFilter.street.forEach((str) => {
          params.append("street", str);
        });
      }
      if (currentFilter.companyName) {
        currentFilter.companyName.forEach((compName) => {
          params.append("companyName", compName);
        });
      }
      if (currentFilter.floor) {
        currentFilter.floor.forEach((flr) => {
          params.append("floor", flr);
        });
      }
      if (currentFilter.floors) {
        currentFilter.floors.forEach((flr) => {
          params.append("floors", flr);
        });
      }
      if (currentFilter.sortOrder && (!currentFilter.sortPrice || currentFilter.sortPrice.length === 0)) {
        currentFilter.sortOrder.forEach((dateSort) => {
          params.append("sortOrder", dateSort);
        });
      } else if (
        currentFilter.sortPrice &&
        (!currentFilter.sortOrder || currentFilter.sortOrder.length === 0)
      ) {
        currentFilter.sortPrice.forEach((priceSort) => {
          params.append("sortPrice", priceSort);
        });
      }
      if (currentFilter.minPrice) {
        params.append("minPrice", String(currentFilter.minPrice));
      }
      if (currentFilter.maxPrice) {
        params.append("maxPrice", String(currentFilter.maxPrice));
      }
      if (currentPage) {
        params.append("page", String(currentPage));
      }

      window.history.replaceState(null, "", `${pathname}?${params}`);
      // Выполняем запрос с текущими параметрами фильтра
      fetch("/api/objects/?" + params.toString())
        .then((res) => res.json())
        .then((el) => {
          setCountObjects(el.countObjects);
          setAllPages(el.totalPages);
          setFilteredHouse(el.allObjects);
          setMapObj(el.allFilteredObject);
          setFilteblackProps((prevFilterState) => ({
            ...prevFilterState,
            categories: el.filter.category,
            cities: el.filter.city,
            rooms: el.filter.rooms,
            renovationTypes: el.filter.renovation,
            floor: el.filter.floor,
            floors: el.filter.floors,
            districts: el.filter.district,
            streets: el.filter.street,
            companyNames: el.filter.companyName,
            price: [el.filter.minPrice, el.filter.maxPrice],
          }));
        });
    }
  }, [currentFilter, currentPage, isFirstRender]);

  //Конкретные выбранные фильтры
  const [filteblackProps, setFilteblackProps] = useState<FilteblackProps>({
    categories: [],
    operationTypes: [],
    states: [],
    cities: [],
    districts: [],
    streets: [],
    companyNames: [],
    price: [],
    passengerElevators: [],
    freightElevators: [],
    ceilingHeight: [],
    renovationTypes: [],
    rooms: [],
    square: [],
    floors: [],
    floor: [],
    wallsTypes: [],
    sortOrder: [],
    sortPrice: [],
  } as {
    categories: string[];
    operationTypes: string[];
    states: string[];
    cities: string[];
    districts: string[];
    streets: string[];
    companyNames: string[];
    price: number[];
    passengerElevators: string[];
    freightElevators: string[];
    ceilingHeight: string[];
    renovationTypes: string[];
    rooms: string[];
    square: string[];
    floors: string[];
    floor: string[];
    wallsTypes: string[];
    sortOrder: string[];
    sortPrice: string[];
  });

 

  return (
    <div className="flex  flex-col  w-full  h-auto  justify-center">
      {currentPage == 1 && (
        <>
          <SelectCategory
            objects={objects}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            setFilteredHouse={setFilteredHouse}
            refCardsObjects={refCardsObjects}
          />

          <div className="flex flex-col   items-center lg:items-center  w-full  justify-center ">
            <h1
              className={`w-[90%] text-[16px] sm:text-[25px] md:text-[30px] lg:text-[35px] xl:text-[40px] mt-[50px]
               font-semibold ${
                 theme === "dark" ? "text-[white]" : "text-[black]"
               } `}
            >
              Лучшие предложения для
              <span
                className={` border-b-2 lg:border-b-3    xl:border-b-4  border-[#54529F] ${
                  theme === "dark" ? "text-[white]" : "text-[#54529F]"
                } `}
              >
                <br />
                ВАШИХ КЛИЕНТОВ НА ОДНОМ САЙТЕ
              </span>
            </h1>
          </div>
          <ObjectsMap  currentFilter={currentFilter} mapObj={mapObj}/>
        </>
      )}

      <section className="flex  flex-col  md:flex-row w-full  h-full  relative   mt-[50px] ">
       {mobile  &&
        <FilterMobile
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
       }

        <ObjectsCardsTest
          allPages={allPages}
          currentPage={currentPage}
          loading={loading}
          filteredHouse={filteredHouse}
          handlePageChange={handlePageChange}
          refCardsObjects={refCardsObjects}
          resetPageAndReloadData={resetPageAndReloadData}
          currentFilter={currentFilter}
          setCurrentFilter={setCurrentFilter}
        />
      {mobile == false  &&
        <Filter
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
      }
      </section>
      <div className="hidden sm:flex">
        <PaginationRow
          currentPage={currentPage}
          totalPages={allPages}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
}


export default React.memo(ParentFilterBlock);