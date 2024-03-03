"use client"
import { Avatar, Card, CardContent, CardHeader } from "@mui/material";
import { ObjectIntrum } from "@prisma/client";
import Image from 'next/image';
import { numberWithSpaces } from "./functionCard";
import ProgressBar from "../../progressBar/ProgressBar";
import { Dispatch, SetStateAction } from "react";
import { PaginationRow } from "../../paginationRow/PaginatiowRow";
import LocationOnIcon from '@mui/icons-material/LocationOn';


type Props = {
    filteredHouse: ObjectIntrum[],
    loading: boolean,
    allPages: number,
    currentPage: number,
    setCurrentPage: Dispatch<SetStateAction<number>>,
    handlePageChange: (page: number) => void;
}

export function ObjectCards({ filteredHouse, loading, allPages, currentPage, setCurrentPage, handlePageChange }: Props) {

    let style = loading ?
        "flex-col items-center  h-[100vh]  justify-center  flex-nowrap"
        :
        " flex-row  items-start  justify-around  h-full  flex-wrap"


    return <>
        <main className={`flex  w-[80%]  p-7 ${style} `} >
            {loading ? (
                <ProgressBar />
            ) : (
                <>
                    {
                        filteredHouse.map(object =>
                            // <div key={object.id_intrum}
                            //     className="flex  flex-col  w-[300px]  h-[400px]  p-10px  mt-[10px]
                            //     rounded  color-[black]  border-[solid]  border-[1px]  border-[black]"
                            // >


                            //     <div className="flex w-[100%] h-[200px]  relative">
                            //         <Image
                            //             src={object.img[0]}
                            //             alt={object.category}
                            //             layout="fill"
                            //             sizes="(max-width: 750px) 50vw,
                            //                             (max-width: 828px) 40vw,
                            //                             (max-width: 1080px) 33vw,
                            //                             20vw"
                            //             loading="lazy"
                            //         />
                            //     </div>

                            //     <h3 className="">{object.price}</h3>

                            // </div>

                            <Card
                                key={object.id}
                                sx={{
                                    width: 300, height: 400, display: 'flex', border: '1px solid #0000099',
                                    flexDirection: 'column', marginTop: '10px', transition: ' 0.2s linear',
                                    cursor: 'pointer', padding: '3px',
                                    '&:hover': {
                                        transform: 'scale(1.01)',
                                        boxShadow: '4px 4px 27px 0px rgba(34, 60, 80, 0.2)'
                                    }
                                }}
                            >
                                <CardHeader
                                    // avatar={
                                    //     <Avatar sx={{}} aria-label="recipe"
                                    //         src={logoFind(LogoList, object.category)}>

                                    //     </Avatar>
                                    // }
                                    sx={{ display: 'flex', height: '50pxfilteredHouse', dispaly: 'flex', alignItems: 'center' }}
                                    title={object.id_intrum}
                                    subheader={`${object.city} , ${object.street}`}
                                />
                                <div className="flex w-[100%] h-[300px]  relative">
                                    <Image
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

                                <CardContent>
                                    <div className="flex  flex-col  w-full  gap-[5px]">
                                        <h2>Категория: {object.category}</h2>

                                        <div className='flex  font-bold  text-lg  '>
                                            <h3>{numberWithSpaces(Number(object.price))} ₽</h3>
                                        </div>
                                        <div className="flex  text-md text-[#00000099]">
                                            {object.companyName}
                                        </div>

                                        <div className='flex  font-bold  text-md'>
                                            <h4 className='flex text-xs  gap-[5px]  items-center text-[#00000099]'>
                                                {object.city}
                                                <LocationOnIcon sx={{ fontSize: '14px' }} />
                                            </h4>
                                        </div>


                                    </div>
                                </CardContent>
                            </Card>
                        )
                    }
                    <PaginationRow currentPage={currentPage} totalPages={allPages} handlePageChange={handlePageChange} />
                </>
            )}
        </main >
    </>
}