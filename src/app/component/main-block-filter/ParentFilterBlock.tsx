'use client'
import { ObjectIntrum } from "@prisma/client";
import { useEffect, useState } from "react";
import { FilterUserOptions } from "../../../../@types/dto";
import { Filter } from "./filter-sidebar/Filter";
import { ObjectsCardsTest } from "./objectsCards/ObjectsCardsTest";
import { FilterMobile } from "./filter-sidebar/FilterMobile";
import { SelectCategory } from "../selectCategory/SelectCategory";

type Props = {
    objects: ObjectIntrum[],
}

// Функция для разбиения массива на группы
function chunkArray(array: ObjectIntrum[], size: number) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}



export function ParentFilterBlock({ objects }: Props) {

    //Отфильтрованные Квартиры, по умолчанию все квартиры
    const [filteredHouse, setFilteredHouse] = useState<ObjectIntrum[]>(objects.length > 0 ? objects.slice(0, 30) : [])
    const [minPrice, setMinPrice] = useState<number>(0)
    const [maxPrice, setMaxPrice] = useState<number>(Math.max(...objects.map(object => object.price ? object.price : 0)))
    const [loading, setLoading] = useState<boolean>(true);// загрузка при фильтрации



    /////// Состояния для паганации 
    const [currentPage, setCurrentPage] = useState(1); // текущая страница
    const pageSize = 15; // количество объектов на странице
    const [allPages, setAllPages] = useState<number>(Math.ceil(objects.length / pageSize)) //Всего страниц
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    // Когда filteredHouse обновляется, обновляем количество страниц
    useEffect(() => {
        setAllPages(Math.ceil(filteredHouse.length > 0 ? filteredHouse.length / pageSize : objects.length / pageSize));
    }, [filteredHouse]);

    // Разбиваем массив на страницы
    const paginatedObjects = chunkArray(filteredHouse.length > 0 ? filteredHouse : objects, pageSize);
    // Вычисляем текущую страницу
    const currentObjects = paginatedObjects[currentPage - 1] || [];
    /////////


    
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



    return <div className="flex  flex-col  w-full  h-auto  justify-center">

        <SelectCategory
            objects={objects}
            currentFilter={currentFilter} setCurrentFilter={setCurrentFilter}
            filteredHouse={filteredHouse} setFilteredHouse={setFilteredHouse}
        />

        <section className="flex  flex-col  md:flex-row w-full  h-full  relative   mt-[50px]">
            <FilterMobile
                objects={objects}
                currentFilter={currentFilter} setCurrentFilter={setCurrentFilter}
                filteredHouse={filteredHouse} setFilteredHouse={setFilteredHouse}
                minPrice={minPrice} maxPrice={maxPrice}
            />

            <ObjectsCardsTest
                setCurrentPage={setCurrentPage}
                allPages={allPages}
                currentPage={currentPage}
                loading={loading}
                filteredHouse={currentObjects}
                handlePageChange={handlePageChange}
            />

            <Filter
                objects={objects}
                currentFilter={currentFilter} setCurrentFilter={setCurrentFilter}
                filteredHouse={filteredHouse} setFilteredHouse={setFilteredHouse}
                minPrice={minPrice} maxPrice={maxPrice}
            />

        </section>
    </div>
}



