"use client";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import PropertyInfo from "../../currentObjComponents/description/PropertyInfo";
import size from "/public/svg/size.svg";
import plan from "/public/svg/plan.svg";
import floor from "/public/svg/floor.svg";
import { Circle } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { addToFavorite, deleteFavorite} from "@/lib/favoriteFunc";
import { FavoriteObj } from "../../../../../@types/dto";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Link from "next/link";
import { getRoomsEnding, logoFind, numberWithSpaces } from "../../main-block-filter/objectsCards/functionCard";

type Props = {
  setFavArr: Dispatch<SetStateAction<FavoriteObj[]>>;
  favArr: FavoriteObj[];
};

export function ObjectsFavCards({ setFavArr, favArr }: Props) {

  let style = "flex-row justify-center gap-[0px] sm:gap-[20px] lg:gap-[0px] md:items-center md:items-start   h-full  flex-wrap ";

  useEffect(() => {
    // console.log(favArr.length);
  }, [favArr]);


  return (
    <>
      <main
        className={`flex w-full  md:w-[100%]   p-7   ${style} relative `}
      >
             <div className="flex w-full  mt-[20px] items-center pb-5">
            <h1 className="flex justify-center  text-black gap-[5px] ">
              <span className="flex text-[18px] lg:text-[25px] text-black items-center font-semibold">Избранное</span>
              {favArr && favArr.length > 0 && (
                <span className="flex text-[18px] lg:text-[25px] text-black">
                  {favArr && favArr.length > 0 ? (
                    <>
                    <FavoriteBorderIcon sx={{ display:'flex', fontSize: "20px", alignItems:'center' }} />
                    <span className="text-sm">{favArr.length}</span>
                  </>
                  ) : (
                    ""
                  )}
                </span>
              )}
            </h1>
          </div>
          <>
            {favArr.map((object) => (
              <>
                <div
                  key={object.object.id}
                  className="flex  justify-center  md:justify-start md:w-full  mt-[20px] md:mt-[0px]"
                >
                  <article
                    key={object.object.id}
                    className="flex   flex-col  md:flex-row  w-[300px] md:w-full  h-[100%] md:h-[300px]  sm:p-2  mt-[10px]  md:gap-[50px]
                                 md:border-none md:border-[transparent] md:border-[0px] 
                                cursor-pointer md:hover:scale-[1.01]  md:duration-700   md:ease-in-out   md:hover:shadow-2xl"
                  >
                    <div className="flex  flex-col  w-[auto]  h-[100%]    md:justify-around">
                      <div className="flex   w-[100%] h-[200px] sm:h-[250px]  md:w-[312px]  md:h-[70%]    relative">
                        <Link href={`/object/${object.object.id}`} className="w-[100%] h-[100%]">
                          <Image
                            className=" rounded md:rounded-t-lg"
                            src={object.object.img[0]}
                            alt={object.object.category}
                            layout="fill"
                            sizes="(max-width: 750px) 85vw,
                                              (max-width: 828px) 40vw,
                                              (max-width: 1080px) 33vw,
                                               30vw"
                            loading="lazy"
                            
                          />
                        </Link>

                          <div className="flex absolute w-[100%] justify-end p-[4px]">
                            {favArr.find(
                              (obj) => obj.object.id === object.object.id
                            ) ? (
                              <FavoriteIcon
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignContent: "center",
                                  padding: "1px",
                                  // background: "#f5eeee7d",
                                  borderRadius: "100%",
                                  color: "red",
                                  "&:hover": { color: "black" },
                                }}
                                onClick={() =>
                                  deleteFavorite(object.object.id, setFavArr)
                                }
                              />
                            ) : (<FavoriteBorderIcon
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignContent: "center",
                                  padding: "1px",
                                  // background: "#f5eeee7d",
                                  borderRadius: "100%",
                                  color: "white",
                                  "&:hover": { color: "red" },
                                }}
                                onClick={() =>
                                  addToFavorite(object.object.id, setFavArr)
                                }
                              />
                            )}
                          </div>
                 
                      </div>
                      <Link href={`/object/${object.object.id}`} >
                        <div className="hidden md:flex  mt-[5px] w-[100%] md:w-[312px] h-[50px] md:h-[60px]  justify-between sm:mt-[5px] ">
                          {object.object.img.slice(1, 4).map((image, index) => (
                            <div
                              key={index}
                              className="flex h-[50px] w-[95px] md:h-[50px] md:w-[100px] relative"
                            >
                              <Image
                                className="rounded"
                                src={image}
                                alt={object.object.category}
                                layout="fill"
                                sizes="(max-width: 750px) 60vw,
                                                      (max-width: 828px) 60vw,
                                                      (max-width: 1080px) 66vw,
                                                      70vw"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      </Link>
                    </div>

                    <Link href={`/object/${object.object.id}`} className="w-[100%]">
                      <>
                        <div className="flex mt-[5px] gap-[5px] md:mt-[0px] flex-col  w-full  h-full   items-start md:gap-[20px] text-black">
                          <h3 className="hidden md:flex  w-full text-sm ">
                            Категория: {object.object.category}
                          </h3>

                          <h3 className="flex md:hidden w-full text-sm  text-black gap-[5px] items-center">
                            {object.object.objectType
                              ? object.object.objectType
                              : object.object.category}

                            {object.object.square && (
                              <Circle
                                sx={{
                                  backgroundColor: "#c9d1e5",
                                  borderRadius: "10px",
                                  fontSize: "3px",
                                }}
                              />
                            )}

                            {object.object.square ? `${object.object.square}м²` : null}

                            {object.object.rooms && (
                              <Circle
                                sx={{
                                  backgroundColor: "#c9d1e5",
                                  borderRadius: "10px",
                                  fontSize: "3px",
                                }}
                              />
                            )}
                            {object.object.rooms
                              ? `${object.object.rooms} ${getRoomsEnding(
                                  object.object.rooms
                                )}`
                              : null}
                          </h3>

                          <h2 className="flex text-[#9da1ab] text-[12px]  md:text-[16px]">
                            {`${object.object.state},${object.object.city},${object.object.street}`
                              .length > 70
                              ? `${`${object.object.state},${object.object.city},${object.object.street}`.slice(
                                  0,
                                  70
                                )}...`
                              : `${object.object.state},${object.object.city},${object.object.street}`}{" "}
                          </h2>
                          <div className="flex md:hidden  w-full">
                            <Image
                              className="flex md:hidden"
                              src={logoFind(object.object.companyName) ?? ""}
                              alt={object.object.category}
                              width={70}
                              height={25}
                              loading="lazy"
                            />
                          </div>
                          {/* <h2 className="flex text-[#9da1ab] text-sm  text-[16px]">{`${object.state},${object.city},${object.street}`}</h2> */}
                          <h1 className="flex w-full  font-bold  text-[22px]">
                            {numberWithSpaces(Number(object.object.price))} ₽
                          </h1>
                          <div className="hidden md:flex  flex-col md:flex-row  gap-[5px]  md:gap-[40px]  mt-[5px]  md:mt-[30px]">
                            {object.object.square && (
                              <PropertyInfo
                                icon={plan}
                                label="Общая площадь"
                                value={`${
                                  object.object.square
                                    ? Math.round(parseInt(object.object.square))
                                    : ""
                                } м²`}
                              />
                            )}
                            {object.object.ceilingHeight && (
                              <PropertyInfo
                                icon={size}
                                label="Высота потолков"
                                value={`${
                                  object.object.ceilingHeight
                                    ? parseInt(object.object.ceilingHeight)
                                    : ""
                                } м`}
                              />
                            )}
                            {(object.object.floor && object.object.category == "Квартиры") ||
                            object.object.category == "Комнаты" ? (
                              <PropertyInfo
                                icon={floor}
                                label="Этаж"
                                value={`${
                                  object.object.floor
                                    ? Math.round(parseInt(object.object.floor))
                                    : ""
                                } из ${
                                  object.object.floors
                                    ? Math.round(parseInt(object.object.floors))
                                    : ""
                                }`}
                              />
                            ) : (
                              <PropertyInfo
                                icon={floor}
                                label={
                                  object.object.floors
                                    ? +object.object.floors < 5
                                      ? "Этажа"
                                      : "Этажей"
                                    : ""
                                }
                                value={`${
                                  object.object.floors
                                    ? Math.round(parseInt(object.object.floors))
                                    : ""
                                }  `}
                              />
                            )}
                          </div>

                          <div className="hidden md:flex w-full md:justify-end">
                            <Image
                              className="hidden md:flex "
                              src={logoFind(object.object.companyName) ?? ""}
                              alt={object.object.category}
                              width={150}
                              height={60}
                              loading="lazy"
                            />
                          </div>

                          {/* <h4 dangerouslySetInnerHTML={{ __html: object.description? object.description : '' }}></h4> */}
                        </div>
                      </>
                    </Link>
                  </article>
                </div>
                <div className="hidden md:flex w-full justify-center">
                  <div className="flex  w-[95%]  h-[0.80px]  bg-[#f1f2f4] "></div>
                </div>
              </>
            ))}
          </>
      </main>
    </>
  );
}
