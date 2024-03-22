'use client'
import { ObjectIntrum } from "@prisma/client";
import { useEffect, useState } from "react";
import { FilteblackProps, FilterUserOptions } from "../../../../@types/dto";
import { Filter } from "./filter-sidebar/Filter";
import { ObjectsCardsTest } from "./objectsCards/ObjectsCardsTest";
import { FilterMobile } from "./filter-sidebar/FilterMobile";
import { SelectCategory } from "../selectCategory/SelectCategory";
import { categoryFilter, ceilingHeightFilter, cityFilter, companyNameFilter, floorFilter, floorsFilter, freightElevatorFilter, operationTypeFilter, passengerElevatorFilter, priceFilter, renovationFilter, roomsFilter, squareFilter, stateFilter, streetFilter, wallsTypeFilter } from "./filter-sidebar/myFilters";

type Props = {
    objects: ObjectIntrum[],
    pages:number,
    page:number
}



export function ParentFilterBlock({ objects,pages, page }: Props) {

    //Отфильтрованные Квартиры, по умолчанию все квартиры
    const [filteredHouse, setFilteredHouse] = useState<ObjectIntrum[]>(objects.length > 0 ? objects.slice(0, 30) : [])
    const [minPrice, setMinPrice] = useState<number>(0)
    const [maxPrice, setMaxPrice] = useState<number>(Math.max(...objects.map(object => object.price ? object.price : 0)))
    const [loading, setLoading] = useState<boolean>(true);// загрузка при фильтрации

    /////// Состояния для паганации 
    const [currentPage, setCurrentPage] = useState(page); // текущая страница
 
    const [allPages, setAllPages] = useState<number>(pages) //Всего страниц

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
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
    })

    //Загрузка при изменении фильтра и сброс страницы на 1
    useEffect(() => {
        setLoading(true);
        setCurrentPage(1);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, [currentFilter]);
 
  const [valueSliderPrice, setValueSliderPrice] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  const [countObjects, setCountObjects] = useState(0)

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

  useEffect(() => {
    const params = new URLSearchParams();
    //параметры запроса к api для фильтра
    if (currentFilter.category) {
      currentFilter.category.forEach((cat) => {
        params.append("category", cat);
      });
    }
    if (currentFilter.rooms) {
      currentFilter.rooms.forEach((room) => {
        params.append("rooms", room);
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
    if (currentFilter.minPrice) {
      params.append("minPrice", String(currentFilter.minPrice));
    }
    if (currentFilter.maxPrice) {
      params.append("maxPrice", String(currentFilter.maxPrice));
    }
    if (currentPage) {
      params.append("page", String(currentPage));
    }

    // params.append("page", page);
    fetch("/api/objects/?" + params)
      .then((res) => res.json())
      .then((el) => {
        setCountObjects(el.countObjects)
        setAllPages(el.totalPages)
        setFilteredHouse(el.allObjects);
        setFilteblackProps((prevFilterState) => {
          return {
            ...prevFilterState,
            categories: el.filter.category,
            rooms: el.filter.rooms,
            streets: el.filter.street,
            companyNames: el.filter.companyName,
            price:[el.filter.minPrice,el.filter.maxPrice]
          };
        });
      });
    console.log(filteblackProps);
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
  });


  useEffect(() => {
    changeFilter({
      minPrice: valueSliderPrice[0],
      maxPrice: valueSliderPrice[1],
    });
  }, [valueSliderPrice]);

    return <div className="flex  flex-col  w-full  h-auto  justify-center">

        <SelectCategory
            objects={objects}
            currentFilter={currentFilter} setCurrentFilter={setCurrentFilter}
            setFilteredHouse={setFilteredHouse}
        />

        <section className="flex  flex-col  md:flex-row w-full  h-full  relative   mt-[50px]">
            <FilterMobile
                objects={objects}
                currentFilter={currentFilter} setCurrentFilter={setCurrentFilter}
                filteredHouse={filteredHouse} setFilteredHouse={setFilteredHouse}
                minPrice={minPrice} maxPrice={maxPrice}
                setMinPrice={setMinPrice} setMaxPrice={setMaxPrice}
                currentPage={currentPage} setAllPages={setAllPages} 
                setCurrentPage={setCurrentPage}
                filteblackProps={filteblackProps}
                valueSliderPrice={valueSliderPrice}
                setValueSliderPrice={setValueSliderPrice}
                countObjects={countObjects}
            />

            <ObjectsCardsTest
                setCurrentPage={setCurrentPage}
                allPages={allPages}
                currentPage={currentPage}
                loading={loading}
                filteredHouse={filteredHouse}
                handlePageChange={handlePageChange}
            />

            <Filter
                 objects={objects}
                 currentFilter={currentFilter} setCurrentFilter={setCurrentFilter}
                 filteredHouse={filteredHouse} setFilteredHouse={setFilteredHouse}
                 minPrice={minPrice} maxPrice={maxPrice}
                 setMinPrice={setMinPrice} setMaxPrice={setMaxPrice}
                 currentPage={currentPage} setAllPages={setAllPages} 
                 setCurrentPage={setCurrentPage}
                 filteblackProps={filteblackProps}
                 valueSliderPrice={valueSliderPrice}
                 setValueSliderPrice={setValueSliderPrice}
                 countObjects={countObjects}
            />
        </section>
    </div>
}



