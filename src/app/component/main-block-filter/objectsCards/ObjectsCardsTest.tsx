"use client"
import { ObjectIntrum } from "@prisma/client";
import Image from 'next/image';
import { logoFind, numberWithSpaces } from "./functionCard";
import ProgressBar from "../../progressBar/ProgressBar";
import { Dispatch, SetStateAction, useState } from "react";
import { PaginationRow } from "../../paginationRow/PaginatiowRow";
import Link from "next/link";
import PropertyInfo from "../../currentObjComponents/description/PropertyInfo";
import size from "/public/svg/size.svg"
import plan from "/public/svg/plan.svg"
import floor from "/public/svg/floor.svg"
import styles from "./Object.module.css";


type Props = {
    filteredHouse: ObjectIntrum[],
    loading: boolean,
    allPages: number,
    currentPage: number,
    setCurrentPage: Dispatch<SetStateAction<number>>,
    handlePageChange: (page: number) => void;
}

export function ObjectsCardsTest({ filteredHouse, loading, allPages, currentPage, setCurrentPage, handlePageChange }: Props) {

    const [loadingImg, setLoadingImg] = useState(true)


    let style = loading ?
        "flex-col items-center  h-[100vh]  justify-center  flex-nowrap"
        :
        "flex-col  md:items-center md:items-start   h-full md:h-[100vh]  md:overflow-auto "


    return <>
        <main
            id={styles.main}
            className={`flex w-full  md:w-[80%]   p-7   ${style} `}
        >
            {loading ? (
                <ProgressBar />
            ) : (
                <>
                    {
                        filteredHouse.map(object =>
                            <>
                                <Link
                                    href={`/object/${object.id}`}
                                    key={object.id}
                                    className="flex  justify-center md:justify-start md:w-full  mt-[10px] md:mt-[0px]"
                                >
                                    <article key={object.id}
                                        className="flex   flex-col  md:flex-row  w-[300px] md:w-full  h-[100%] md:h-[300px]  p-2  mt-[10px]  md:gap-[50px]
                                rounded-[12px] border-[solid] rounded border-[#c9d1e5] border-[0.60px] md:border-none md:border-[transparent] md:border-[0px]
                                cursor-pointer hover:scale-[1.01] duration-700  ease-in-out  hover:shadow-2xl"
                                    // font-['RobotoSans']
                                    >

                                        <div className="flex  flex-col  w-[auto]  h-[100%]    md:justify-around">
                                            <div className="flex   w-[100%] h-[250px]  md:w-[312px]  md:h-[70%]    relative">
                                                <Image
                                                    className="rounded"
                                                    src={object.img[0]}
                                                    alt={object.category}
                                                    layout="fill"
                                                    sizes="(max-width: 750px) 50vw,
                                              (max-width: 828px) 40vw,
                                              (max-width: 1080px) 33vw,
                                               20vw"
                                                    loading="lazy"
                                                 
                                                />
                                            </div>
                                            <div className="flex  w-[100%] md:w-[312px] h-[70px] md:h-[60px]  justify-between mt-[10px] ">
                                                {object.img.slice(1, 4).map((image, index) => (
                                                    <div key={index} className="flex h-[70px] w-[90px] md:h-[60px] md:w-[100px] relative">
                                                        <Image
                                                            className="rounded"
                                                            src={image}
                                                            alt={object.category}
                                                        
                                                            layout="fill"
                                                            sizes="(max-width: 750px) 50vw,
                                                      (max-width: 828px) 40vw,
                                                      (max-width: 1080px) 33vw,
                                                      20vw"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                ))}

                                            </div>
                                        </div>

                                        <div className="flex mt-[20px] md:mt-[0px] flex-col  w-full  h-full   items-start gap-[20px] text-black">
                                            <h3 className="hidden md:flex  w-full text-sm ">Категория: {object.category}</h3>
                                            <h2 className="flex text-[#9da1ab] text-sm  text-[16px]">{`${object.state},${object.city},${object.street}`}</h2>
                                            <h1 className="flex w-full  font-bold  text-lg  text-[22px]">{numberWithSpaces(Number(object.price))} ₽</h1>
                                            <div className="hidden md:flex  flex-col md:flex-row  gap-[5px]  md:gap-[40px]  mt-[5px]  md:mt-[30px]">
                                                {object.square &&
                                                    <PropertyInfo icon={plan} label="Общая площадь" value={`${object.square ? Math.round(parseInt(object.square)) : ''} м²`} />
                                                }
                                                {object.ceilingHeight &&
                                                    <PropertyInfo icon={size} label="Высота потолков" value={`${object.ceilingHeight ? parseInt(object.ceilingHeight) : ''} м`} />
                                                }
                                                {object.floor &&
                                                    <PropertyInfo icon={floor} label="Этаж" value={`${object.floor ? Math.round(parseInt(object.floor)) : ''} из ${object.floors ? Math.round(parseInt(object.floors)) : ''}`} />
                                                }
                                            </div>

                                            <div className="flex w-full justify-end">
                                                <Image
                                                    className="rounded"
                                                    src={logoFind(object.companyName) ?? ''}
                                                    alt={object.category}
                                                    width={80}
                                                    height={80}
                                                    loading="lazy"
                                                />
                                            </div>

                                            {/* <h4 dangerouslySetInnerHTML={{ __html: object.description? object.description : '' }}></h4> */}
                                        </div>


                                    </article>
                                </Link>
                                <div className="hidden md:flex w-full justify-center">
                                    <div className="flex  w-[95%]  h-[0.80px]  bg-[#f1f2f4] "></div>
                                </div>
                            </>
                        )
                    }
                    <PaginationRow currentPage={currentPage} totalPages={allPages} handlePageChange={handlePageChange} />
                </>
            )}
        </main >
    </>
}