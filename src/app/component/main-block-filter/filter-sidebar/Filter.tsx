'use client'

import { ObjectIntrum } from "@prisma/client"
import { FilterUserOptions, allObjects } from "../../../../../@types/dto"
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { categoryFilter, ceilingHeightFilter, cityFilter, companyNameFilter, floorFilter, floorsFilter, freightElevatorFilter, operationTypeFilter, passengerElevatorFilter, priceFilter, renovationFilter, roomsFilter, squareFilter, stateFilter, streetFilter, wallsTypeFilter } from "./myFilters"
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RangeSlider from "../../filterFields/price/RangeSlider"
import { CategoriesCheckbox } from "../../filterFields/categories/CategoriesCheckbox"
import { StreetSelect } from "../../filterFields/adress/StreetSelect"
import styles from "./Filter.module.css";
import { CitySelect } from "../../filterFields/adress/CitySelect"
import { CompanySelect } from "../../filterFields/company/CompanySelect"
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import { RoomsSelector } from "../../filterFields/rooms/Rooms"


type Props = {
    objects: allObjects;
    currentFilter: FilterUserOptions,
    setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>,
    setFilteredHouse: Dispatch<SetStateAction<ObjectIntrum[]>>,
    filteredHouse: ObjectIntrum[],
    maxPrice: number,
    minPrice: number,

}


const filterRow = "flex w-full p-4 h-auto ";


export function Filter({ objects, currentFilter, filteredHouse, setCurrentFilter, setFilteredHouse, maxPrice, minPrice }: Props) {

    const [valueSliderPrice, setValueSliderPrice] = useState<[number, number]>([minPrice, maxPrice]);

    const changeFilter = (filter: FilterUserOptions) => {
        setCurrentFilter(prevFilterState => {
            return { ...prevFilterState, ...filter }
        })
    }

    useEffect(() => {
        setFilteredHouse(objects.filter(object => {
            return categoryFilter(object, currentFilter)
                && operationTypeFilter(object, currentFilter)
                && stateFilter(object, currentFilter)
                && cityFilter(object, currentFilter)
                && streetFilter(object, currentFilter)
                && priceFilter(object, currentFilter)
                && companyNameFilter(object, currentFilter)
                && passengerElevatorFilter(object, currentFilter)
                && freightElevatorFilter(object, currentFilter)
                && ceilingHeightFilter(object, currentFilter)
                && renovationFilter(object, currentFilter)
                && roomsFilter(object, currentFilter)
                && squareFilter(object, currentFilter)
                && floorsFilter(object, currentFilter)
                && floorFilter(object, currentFilter)
                && wallsTypeFilter(object, currentFilter)

        }))
    }, [currentFilter])

    //filteblackProps выводит все возможные фильтры для выбора по данным из БД
    const filteblackProps = useMemo(() => {
        let filteredObjectProps = {
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
            categories: string[],
            operationTypes: string[],
            states: string[],
            cities: string[],
            streets: string[],
            companyNames: string[],
            price: number[],
            passengerElevators: string[],
            freightElevators: string[],
            ceilingHeight: string[],
            renovationTypes: string[],
            rooms: string[],
            square: string[],
            floors: string[],
            floor: string[],
            wallsTypes: string[]
        }

        filteredHouse.forEach(object => {
            filteredObjectProps.categories.push(object.category)
            filteredObjectProps.operationTypes.push(object.operationType)
            filteredObjectProps.states.push(object.state ? object.state : '')
            filteredObjectProps.cities.push(object.city ? object.city : '')
            filteredObjectProps.streets.push(object.street ? object.street : '')
            filteredObjectProps.companyNames.push(object.companyName ? object.companyName : '')
            filteredObjectProps.passengerElevators.push(object.passengerElevator ? object.passengerElevator : '')
            filteredObjectProps.freightElevators.push(object.freightElevator ? object.freightElevator : '')
            filteredObjectProps.ceilingHeight.push(object.ceilingHeight ? object.ceilingHeight : '')
            filteredObjectProps.renovationTypes.push(object.renovation ? object.renovation : '')
            filteredObjectProps.rooms.push(object.rooms ? object.rooms : '')
            filteredObjectProps.square.push(object.square ? object.square : '')
            filteredObjectProps.floors.push(object.floors ? object.floors : '')
            filteredObjectProps.floor.push(object.floor ? object.floor : '')
            filteredObjectProps.wallsTypes.push(object.wallsType ? object.wallsType : '')

        })

        return {
            categories: [...new Set(filteredObjectProps.categories)],
            operationTypes: [...new Set(filteredObjectProps.operationTypes)], // TODO es6-set polyfill
            states: [...new Set(filteredObjectProps.states)],
            cities: [...new Set(filteredObjectProps.cities)],
            streets: [...new Set(filteredObjectProps.streets)],
            companyNames: [...new Set(filteredObjectProps.companyNames)],
            passengerElevators: [...new Set(filteredObjectProps.passengerElevators)],
            freightElevators: [...new Set(filteredObjectProps.passengerElevators)],
            ceilingHeight: [...new Set(filteredObjectProps.ceilingHeight)],
            renovationTypes: [...new Set(filteredObjectProps.renovationTypes)],
            rooms: [...new Set(filteredObjectProps.rooms)],
            square: [...new Set(filteredObjectProps.square)],
            floors: [...new Set(filteredObjectProps.floors)],
            floor: [...new Set(filteredObjectProps.floor)],
            wallsTypes: [...new Set(filteredObjectProps.wallsTypes)],
        }

    }, [filteredHouse])

    //функция для сброса фильтров 
    function resetFilteblackCars() {
        setFilteredHouse(objects);
        setCurrentFilter(prevFilterState => ({
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

    useEffect(() => {
        changeFilter({
            minPrice: valueSliderPrice[0],
            maxPrice: valueSliderPrice[1]
        })
    }, [valueSliderPrice])


    return <>
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
                        <Typography sx={{ fontSize: '14px' }}><CurrencyRubleIcon /> Цена</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <RangeSlider
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            valueSliderPrice={valueSliderPrice}
                            setValueSliderPrice={setValueSliderPrice}
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

            <div className='flex w-full p-4 h-auto'>
                {
                    filteredHouse.length == 1 ? (
                        <h6 className='text-[#88898b]' ><MapsHomeWorkIcon /> {filteredHouse.length} объект</h6>
                    ) : filteredHouse.length > 1 && filteredHouse.length <= 4 ? (
                        <h6 className='text-[#d1d7dd]'><MapsHomeWorkIcon /> {filteredHouse.length}  объекта</h6>
                    ) : (
                        <h6 className='text-[#d1d7dd]'> <MapsHomeWorkIcon /> {filteredHouse.length}  объекта</h6>
                    )
                }
            </div>
        </aside>
    </>

}

