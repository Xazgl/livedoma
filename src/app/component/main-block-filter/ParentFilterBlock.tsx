"use client";
import { ObjectIntrum } from "@prisma/client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FavoriteObj,
  FilteblackProps,
  FilterUserOptions,
} from "../../../../@types/dto";
import { Filter } from "./filter-sidebar/Filter";
import { ObjectsCardsTest } from "./objectsCards/ObjectsCardsTest";
import { FilterMobile } from "./filter-sidebar/FilterMobile";
import { SelectCategory } from "../selectCategory/SelectCategory";
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
} from "./filter-sidebar/myFilters";
import { usePathname, useSearchParams } from "next/navigation";


type Props = {
  objects: ObjectIntrum[];
  pages: number;
  page: number;
};

export function ParentFilterBlock({ objects, pages, page }: Props) {
  const refCardsObjects = useRef<HTMLDivElement>(null);

  //Отфильтрованные Квартиры, по умолчанию все квартиры
  const [filteredHouse, setFilteredHouse] = useState<ObjectIntrum[]>(
    objects.length > 0 ? objects.slice(0, 30) : []
  );
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(
    Math.max(...objects.map((object) => (object.price ? object.price : 0)))
  );
  const [loading, setLoading] = useState<boolean>(true); // загрузка при фильтрации
  const [favArr, setFavArr] = useState<FavoriteObj[]>([]); //массив избранного из базы

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
    if (params.has("page")) {
      setCurrentPage(parseInt(params.getAll("page")[0], 10));
    }
    return filter;
  }, [searchParams]);

  //Устанавливаем их в состояние currentFilter из url
  useEffect(() => {
    setCurrentFilter((prevFilterState) => {
      const newFilterState = { ...prevFilterState, ...filterFromParams };
      if (JSON.stringify(prevFilterState) !== JSON.stringify(newFilterState)) {
        return newFilterState;
      }
      return prevFilterState;
    });
  }, [filterFromParams]);


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
    sortPrice:[]
  });

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

  const [countObjects, setCountObjects] = useState(0);

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
    const params = new URLSearchParams();
    //параметры запроса к api для фильтра
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
    // Взаимоисключающие условия для sortOrder и sortPrice
    if (currentFilter.sortOrder && (!currentFilter.sortPrice || currentFilter.sortPrice.length === 0)) {
      currentFilter.sortOrder.forEach((dateSort) => { params.append("sortOrder", dateSort)});
    } else if (currentFilter.sortPrice && (!currentFilter.sortOrder || currentFilter.sortOrder.length === 0)) {
      currentFilter.sortPrice.forEach((priceSort) => {
       params.append("sortPrice", priceSort)});
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

    fetch("/api/objects/?" + params)
      .then((res) => res.json())
      .then((el) => {
        setCountObjects(el.countObjects);
        setAllPages(el.totalPages);
        setFilteredHouse(el.allObjects);
        setFilteblackProps((prevFilterState) => {
          return {
            ...prevFilterState,
            categories: el.filter.category,
            cities: el.filter.city,
            rooms: el.filter.rooms,
            renovationTypes: el.filter.renovation,
            floor: el.filter.floor,
            floors: el.filter.floors,
            streets: el.filter.street,
            companyNames: el.filter.companyName,
            price: [el.filter.minPrice, el.filter.maxPrice],
          };
        });
      });
  }, [currentFilter, currentPage]);

  //Конкретные выбранные фильтры
  const [filteblackProps, setFilteblackProps] = useState<FilteblackProps>({
    categories: [],
    operationTypes: [],
    states: [],
    cities: [],
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
    sortPrice:[]
  } as {
    categories: string[];
    operationTypes: string[];
    states: string[];
    cities: string[];
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
    sortPrice:string[];
  });


  useEffect(() => {
    async function getFav() {
      await new Promise((resolve) => setTimeout(resolve, 6000));
      const res = await fetch("/api/favorite/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const result = await res.json();
        setFavArr(result.favoriteObjects);
      }
    }
    getFav();
  }, []);

  return (
    <div className="flex  flex-col  w-full  h-auto  justify-center">
      <SelectCategory
        objects={objects}
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
        setFilteredHouse={setFilteredHouse}
        refCardsObjects={refCardsObjects}
      />

      <div className="flex flex-col  items-center lg:items-center w-full justify-center ">
        <h1 className="w-[90%] text-[16px] sm:text-[25px] md:text-[30px] lg:text-[35px] xl:text-[40px] text-black mt-[50px] font-semibold">
          Лучшие предложения для
          <span className="text-[#54529F] border-b-2 lg:border-b-3    xl:border-b-4  border-[#54529F]">
            <br />
            ВАШИХ КЛИЕНТОВ НА ОДНОМ САЙТЕ
          </span>
        </h1>
      </div>


      <section className="flex  flex-col  md:flex-row w-full  h-full  relative   mt-[50px] ">
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
          favArr={favArr}
          setFavArr={setFavArr}
          resetPageAndReloadData={resetPageAndReloadData}
        />

        <ObjectsCardsTest
          allPages={allPages}
          currentPage={currentPage}
          loading={loading}
          filteredHouse={filteredHouse}
          handlePageChange={handlePageChange}
          favArr={favArr}
          setFavArr={setFavArr}
          refCardsObjects={refCardsObjects}
          
          resetPageAndReloadData={resetPageAndReloadData}
          currentFilter={currentFilter}
          setCurrentFilter={setCurrentFilter}
        />

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
          favArr={favArr}
          setFavArr={setFavArr}
          resetPageAndReloadData={resetPageAndReloadData}
        />
      </section>
    </div>
  );
}
