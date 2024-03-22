'use client'

import { ObjectIntrum } from "@prisma/client"
import { FilteblackProps, FilterUserOptions, allObjects } from "../../../../../@types/dto"
import { Dispatch, SetStateAction, useState } from "react"
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RangeSlider from "../../filterFields/price/RangeSlider"
import { CategoriesCheckbox } from "../../filterFields/categories/CategoriesCheckbox"
import { StreetSelect } from "../../filterFields/adress/StreetSelect"
import styles from "./Filter.module.css";
import { CompanySelect } from "../../filterFields/company/CompanySelect"
import TuneIcon from '@mui/icons-material/Tune';


type Props = {
    objects: allObjects;
    currentFilter: FilterUserOptions,
    setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>,
    setFilteredHouse: Dispatch<SetStateAction<ObjectIntrum[]>>,
    filteredHouse: ObjectIntrum[],
    maxPrice: number,
    minPrice: number,
    setMinPrice: Dispatch<SetStateAction<number>>;
    setMaxPrice: Dispatch<SetStateAction<number>>;
    setAllPages: Dispatch<SetStateAction<number>>;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    currentPage:number;
    filteblackProps:FilteblackProps;
    valueSliderPrice:[number, number];
    setValueSliderPrice: Dispatch<SetStateAction<[number, number]>>;
    countObjects:number;
}


const filterRow = "flex  w-full  p-4  h-auto";


export function FilterMobile({ filteblackProps,objects, currentFilter, setCurrentFilter, setFilteredHouse, maxPrice, minPrice,setMinPrice, setMaxPrice, 
    valueSliderPrice ,setValueSliderPrice, countObjects }: Props) {

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

    return <div className="flex  md:hidden  w-full  justify-center  sticky  top-0  left-0  z-20">
        <aside className="flex  flex-col  items-center  w-[90%]  h-[auto] ">
            <Accordion expanded={expanded === 'panel1'} onChange={handleChangeBar('panel1')}
                sx={{ backgroundColor: '#131313f0', color: 'white', margin: '1px', width: '100%' }}
            >
                <AccordionSummary
                    expandIcon={<TuneIcon sx={{ color: 'white', width: '40px' }} />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography sx={{ width: '100%' }}>
                        Параметры поиска
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: '#f2f2f2', width: '100%' }}>
                    <div
                        className={`flex  flex-col w-full  md:w-[20%]   h-[100%]  items-center 
                                    sticky  top-0  right-0`
                        }
                        id={styles.aside}
                    >

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
                            <StreetSelect
                                filteblackProps={filteblackProps}
                                currentFilter={currentFilter}
                                setCurrentFilter={setCurrentFilter}
                            />
                        </div>


                        <div className={filterRow}>
                            <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontSize: '14px' }}>Цена,    ₽</Typography>
                                </AccordionSummary>
                                <AccordionDetails >
                                    <RangeSlider
                                        minPrice={minPrice}
                                        maxPrice={maxPrice}
                                        valueSliderPrice={valueSliderPrice}
                                        setValueSliderPrice={setValueSliderPrice}
                                        setMinPrice = {setMinPrice}
                                        setMaxPrice = {setMaxPrice}
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
                                countObjects == 1 ? (
                                    <h6 className='text-[#88898b]' >{countObjects} объект</h6>
                                ) : countObjects> 1 && countObjects <= 4 ? (
                                    <h6 className='text-[#d1d7dd]'>{countObjects}  объекта</h6>
                                ) : (
                                    <h6 className='text-[#d1d7dd]'> {countObjects}  объекта</h6>
                                )
                            }
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion >
        </aside>
    </div>
}

