"use client";
import { ObjectIntrum } from "@prisma/client";
import Image from "next/image";
import { getRoomsEnding, logoFind, numberWithSpaces } from "./functionCard";
import ProgressBar from "../../progressBar/ProgressBar";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PaginationRow } from "../../paginationRow/PaginatiowRow";
import PropertyInfo from "../../currentObjComponents/description/PropertyInfo";
import size from "/public/svg/size.svg";
import plan from "/public/svg/plan.svg";
import floor from "/public/svg/floor.svg";
import styles from "./Object.module.css";
// import { CardActions, IconButton } from "@mui/material";
import { Circle } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { addToFavorite, deleteFavorite} from "@/lib/favoriteFunc";
import { FavoriteObj } from "../../../../../@types/dto";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Link from "next/link";

type Props = {
  filteredHouse: ObjectIntrum[];
  loading: boolean;
  allPages: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  handlePageChange: (page: number) => void;
  setFavArr: Dispatch<SetStateAction<FavoriteObj[]>>;
  favArr: FavoriteObj[];
};

export function ObjectsCardsTest({ filteredHouse, loading, allPages, currentPage,
setCurrentPage, handlePageChange, setFavArr, favArr }: Props) {
  const [loadingImg, setLoadingImg] = useState(true);

  let style = loading
    ? "flex-col items-center  h-[100vh]  justify-center  flex-nowrap"
    : "flex-row justify-center gap-[0px] sm:gap-[20px] lg:gap-[0px] md:items-center md:items-start   h-full  flex-wrap ";
    //Если нужен скрол объектов
    // : "flex-col  md:items-center md:items-start   h-full md:h-[100vh]  md:overflow-auto ";

  useEffect(() => {
    async function start() {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const res = await fetch("/api/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const answer = await res.json();
        console.log(answer);
        setLoadingImg(false);
      }
    }
    start();
  }, []);

  useEffect(() => {
    // console.log(favArr.length);
  }, [favArr]);







  return (
    <>
      <main
        id={styles.main}
        className={`flex w-full  md:w-[80%]   p-7   ${style} relative `}
      >
        {loading ? (
          <ProgressBar />
        ) : (
          <>
          {/* <div className="flex w-[100%] sticky">
          <ShoppingBagIcon sx={{color:"black"}}/>
          </div> */}
            {filteredHouse.map((object) => (
              <>
                <div
                  // href={`/object/${object.id}`}
                  key={object.id}
                  className="flex  justify-center  md:justify-start md:w-full  mt-[20px] md:mt-[0px]"
                >
                  <article
                    key={object.id}
                    // rounded-[12px] border-[solid] rounded border-[#c9d1e5]   border-[0.60px]
                    className="flex   flex-col  md:flex-row  w-[300px] md:w-full  h-[100%] md:h-[300px]  sm:p-2  mt-[10px]  md:gap-[50px]
                                 md:border-none md:border-[transparent] md:border-[0px] 
                                cursor-pointer md:hover:scale-[1.01]  md:duration-700   md:ease-in-out   md:hover:shadow-2xl"
                  >
                    <div className="flex  flex-col  w-[auto]  h-[100%]    md:justify-around">
                      <div className="flex   w-[100%] h-[200px] sm:h-[250px]  md:w-[312px]  md:h-[70%]    relative">
                        <Link href={`/object/${object.id}`} className="w-[100%] h-[100%]">
                          <Image
                            className=" rounded md:rounded-t-lg"
                            src={object.img[0]}
                            alt={object.category}
                            layout="fill"
                            sizes="(max-width: 750px) 85vw,
                                              (max-width: 828px) 40vw,
                                              (max-width: 1080px) 33vw,
                                               30vw"
                            loading="lazy"
                            
                          />
                        </Link>
                        {loadingImg == false && (
                          <div className="flex absolute w-[100%] justify-end p-[4px]">
                            {favArr.find(
                              (obj) => obj.object.id === object.id
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
                                  deleteFavorite(object.id, setFavArr)
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
                                  addToFavorite(object.id, setFavArr)
                                }
                              />
                            )}
                          </div>
                        )}
                      </div>
                      <Link href={`/object/${object.id}`} >
                        <div className="hidden md:flex  mt-[5px] w-[100%] md:w-[312px] h-[50px] md:h-[60px]  justify-between sm:mt-[5px] ">
                          {object.img.slice(1, 4).map((image, index) => (
                            <div
                              key={index}
                              className="flex h-[50px] w-[95px] md:h-[50px] md:w-[100px] relative"
                            >
                              <Image
                                className="rounded"
                                src={image}
                                alt={object.category}
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

                    <Link href={`/object/${object.id}`} className="w-[100%]">
                      <>
                        <div className="flex mt-[5px] gap-[5px] md:mt-[0px] flex-col  w-full  h-full   items-start md:gap-[20px] text-black">
                          <h3 className="hidden md:flex  w-full text-sm ">
                            Категория: {object.category}
                          </h3>

                          <h3 className="flex md:hidden w-full text-sm  text-black gap-[5px] items-center">
                            {object.objectType
                              ? object.objectType
                              : object.category}

                            {object.square && (
                              <Circle
                                sx={{
                                  backgroundColor: "#c9d1e5",
                                  borderRadius: "10px",
                                  fontSize: "3px",
                                }}
                              />
                            )}

                            {object.square ? `${object.square}м²` : null}

                            {object.rooms && (
                              <Circle
                                sx={{
                                  backgroundColor: "#c9d1e5",
                                  borderRadius: "10px",
                                  fontSize: "3px",
                                }}
                              />
                            )}
                            {object.rooms
                              ? `${object.rooms} ${getRoomsEnding(
                                  object.rooms
                                )}`
                              : null}
                          </h3>

                          <h2 className="flex text-[#9da1ab] text-[12px]  md:text-[16px]">
                            {`${object.state},${object.city},${object.street}`
                              .length > 70
                              ? `${`${object.state},${object.city},${object.street}`.slice(
                                  0,
                                  70
                                )}...`
                              : `${object.state},${object.city},${object.street}`}{" "}
                          </h2>
                          <div className="flex md:hidden  w-full">
                            <Image
                              className="flex md:hidden"
                              src={logoFind(object.companyName) ?? ""}
                              alt={object.category}
                              width={70}
                              height={25}
                              loading="lazy"
                            />
                          </div>
                          {/* <h2 className="flex text-[#9da1ab] text-sm  text-[16px]">{`${object.state},${object.city},${object.street}`}</h2> */}
                          <h1 className="flex w-full  font-bold  text-[22px]">
                            {numberWithSpaces(Number(object.price))} ₽
                          </h1>
                          <div className="hidden md:flex  flex-col md:flex-row  gap-[5px]  md:gap-[40px]  mt-[5px]  md:mt-[30px]">
                            {object.square && (
                              <PropertyInfo
                                icon={plan}
                                label="Общая площадь"
                                value={`${
                                  object.square
                                    ? Math.round(parseInt(object.square))
                                    : ""
                                } м²`}
                              />
                            )}
                            {object.ceilingHeight && (
                              <PropertyInfo
                                icon={size}
                                label="Высота потолков"
                                value={`${
                                  object.ceilingHeight
                                    ? parseInt(object.ceilingHeight)
                                    : ""
                                } м`}
                              />
                            )}
                            {(object.floor && object.category == "Квартиры") ||
                            object.category == "Комнаты" ? (
                              <PropertyInfo
                                icon={floor}
                                label="Этаж"
                                value={`${
                                  object.floor
                                    ? Math.round(parseInt(object.floor))
                                    : ""
                                } из ${
                                  object.floors
                                    ? Math.round(parseInt(object.floors))
                                    : ""
                                }`}
                              />
                            ) : (
                              <PropertyInfo
                                icon={floor}
                                label={
                                  object.floors
                                    ? +object.floors < 5
                                      ? "Этажа"
                                      : "Этажей"
                                    : ""
                                }
                                value={`${
                                  object.floors
                                    ? Math.round(parseInt(object.floors))
                                    : ""
                                }  `}
                              />
                            )}
                          </div>

                          <div className="hidden md:flex w-full md:justify-end">
                            <Image
                              className="hidden md:flex "
                              src={logoFind(object.companyName) ?? ""}
                              alt={object.category}
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
            <PaginationRow
              currentPage={currentPage}
              totalPages={allPages}
              handlePageChange={handlePageChange}
            />
          </>
        )}
      </main>
    </>
  );
}
