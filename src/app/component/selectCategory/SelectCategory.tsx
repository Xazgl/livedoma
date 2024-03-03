'use client'
import { ObjectIntrum } from "@prisma/client"
import bg1 from "/public/images/1.png"
import bg2 from "/public/images/2.png"
import bg3 from "/public/images/3.png"
import { Dispatch, SetStateAction, useEffect, useMemo, } from "react"
import {
    categoryFilter, ceilingHeightFilter, cityFilter, companyNameFilter, floorFilter,
    floorsFilter, freightElevatorFilter, operationTypeFilter, passengerElevatorFilter,
    priceFilter, renovationFilter, roomsFilter, squareFilter, stateFilter, streetFilter,
    wallsTypeFilter
} from "../main-block-filter/filter-sidebar/myFilters"
import { FilterUserOptions, allObjects } from "../../../../@types/dto"
import { Slide } from "@mui/material"


type Props = {
    objects: allObjects;
    currentFilter: FilterUserOptions,
    setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>,
    setFilteredHouse: Dispatch<SetStateAction<ObjectIntrum[]>>,
    filteredHouse: ObjectIntrum[]
}



export function SelectCategory({ objects, currentFilter, filteredHouse, setCurrentFilter, setFilteredHouse }: Props) {


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



    //функция изменения состояния по клику на картинку
    const createCategoryHandler = (categoryName: string) => () => {
        setCurrentFilter(prevFilterState => {
            const currentCategory = prevFilterState.category ?? [];
            if (currentCategory.includes(categoryName)) {
                return {
                    ...prevFilterState,
                    category: currentCategory.filter(el => el !== categoryName)
                };
            }
            return { ...prevFilterState, category: [...currentCategory, categoryName] };
        });
    };

    const styleCard = 'flex  w-[200px] md:w-[300px]  after:rounded-t-lg after:duration-700 h-full  after:ease-in-out relative rounded-t-lg after:w-full after:h-full hover:after:bg-[#0000003f] hover:after:absolute"'
    const title ='flex mt-[5px] w-full text-black text-[14px] md:text-[20px]'
    return <>
        <Slide in={true} direction="right" timeout={3000}>
            <section className="flex  flex-wrap justify-center gap-[20px] sm:gap-[0px] w-full h-[200px] sm:justify-around  md:justify-between mt-[20px]">
                <div className="flex  flex-col w-[auto]  cursor-pointer ">
                    <div
                        className={styleCard}
                        style={{ background: `url(${bg1.src})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
                        onClick={createCategoryHandler('Квартиры')}
                    >
                    </div>
                    <h1 className={title}>Квартиры</h1>
                </div>

                <div className="flex  flex-col w-[auto]  cursor-pointer ">
                    <div
                        className={styleCard}
                        style={{ background: `url(${bg2.src})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
                        onClick={createCategoryHandler('Коммерческая недвижимость')}
                    >
                    </div>
                    <h1 className={title}>Коммерческая недвижимость</h1>
                </div>

                <div className="flex  flex-col w-[auto]  cursor-pointer ">
                    <div
                        className={styleCard}
                        style={{ background: `url(${bg3.src})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
                        onClick={createCategoryHandler('Дома, дачи, коттеджи')}
                    >
                    </div>
                    <h1 className={title}>Дома, дачи, коттеджи</h1>
                </div>

            </section >
        </Slide>
    </>
}

