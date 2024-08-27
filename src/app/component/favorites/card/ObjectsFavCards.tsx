"use client";
import Image from "next/image";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import PropertyInfo from "../../currentObjComponents/description/PropertyInfo";
import size from "/public/svg/size.svg";
import plan from "/public/svg/plan.svg";
import floor from "/public/svg/floor.svg";
import { Circle } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FavoriteObj } from "../../../../../@types/dto";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Link from "next/link";
import { getRoomsEnding, logoFind, numberWithSpaces } from "../../main-block-filter/objectsCards/functionCard";
import { useTheme } from "../../provider/ThemeProvider";
import DynamicCardImg from "../../main-block-filter/objectsCards/DynamicCardImg";
import noPhoto from "/public/images/noPhoto.jpg";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { addFavorite, deleteFavorite, fetchFavorites } from "@/app/redux/slice/favoriteSlice";

type Props = {
  favArr: FavoriteObj[];
};

export function ObjectsFavCards({ favArr }: Props) {
  const [loadingImg, setLoadingImg] = useState(true);
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>(); 
  
  const handleAddFavorite = (id: string) => {
    dispatch(addFavorite(id));
  };

  const handleDeleteFavorite = (id: string) => {
    dispatch(deleteFavorite(id)).then(() => {
      dispatch(fetchFavorites()); // Обновляем список избранного после удаления
    });
  };
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
        await res.json();
        setLoadingImg(false);
      }
    }
    start();
  }, []);

  let style = "flex-row justify-center gap-[0px] sm:gap-[20px] lg:gap-[0px] md:items-center md:items-start  max-h-[full]  min-h-[100vh]  flex-wrap ";

  return (
    <>
      <main
        className={`flex w-full  md:w-[100%]   p-7   ${style} relative `}
      >
             <div className="flex w-full  mt-[20px] items-center pb-5">
            <h1 className={`flex justify-center items-center gap-[5px]  ${theme === "dark"? "text-white":"text-black"}` }>
              <span className={`flex text-[18px] lg:text-[25px] ${theme === "dark"? "text-white":"text-black"} items-center font-semibold`}>Избранное</span>
              {favArr && favArr.length > 0 && (
                <span className={`flex text-[18px] lg:text-[25px] ${theme === "dark"? "text-white":"text-black"}`}>
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
                <Fragment key={object.object.id}>
                <div className="flex  justify-center  md:justify-start md:w-full  mt-[35px] md:mt-[0px]">
                  <article
                    key={object.object.id}
                    style={{ transition: "all 1s" }}
                    className={`flex   flex-col  md:flex-row  h-[100%] w-[300px] xs:w-[310px] md:w-full  md:h-[250px] xxl:h-[300px]   sm:p-2  md:mt-[10px]  md:gap-[50px]
                                 md:border-none md:border-[transparent] md:border-[0px] 
                                cursor-pointer   md:duration-700   md:ease-in-out    ${theme === "dark"? "dark:md:hover:shadow-dark-2xl":"md:hover:shadow-2xl"}`} 
                  >
                    <div className="flex  flex-col  w-[auto]  h-[100%]    md:justify-around">
                      <div className="flex   w-[100%] h-[200px] sm:w-[300px]  sm:h-[260px]   lg:w-[400px] lg:h-[98%]  relative overflow-hidden">
                        <Link
                          href={`/object/${object.object.id}`}
                          className="w-[100%] h-[100%]"
                        >
                          <DynamicCardImg
                            alt={object.object.category}
                            src={
                              object.object.thubmnail[0]
                                ? object.object.thubmnail[0]
                                : object.object.img[0]
                                ? object.object.img[0]
                                : object.object.imgUrl.length > 0 &&
                                  object.object.imgUrl[0] !== ""
                                ? object.object.imgUrl[0]
                                : noPhoto.src
                            }
                          />
                        </Link>
                        {loadingImg == false && (
                          <div className="flex absolute w-[100%] justify-end p-[4px]">
                            {favArr.find(
                              (obj) => obj.object.id === object.object.id
                            ) ? (
                              <FavoriteIcon
                                sx={{
                                  background:'#80757529',
                                  display: "flex",
                                  transition: "all 0.5s",
                                  justifyContent: "center",
                                  alignContent: "center",
                                  padding: "1px",
                                  borderRadius: "100%",
                                  color: "#d31717",
                                  "&:hover": { color: "black" },
                                }}
                                onClick={() => handleDeleteFavorite(object.object.id)}
                              />
                            ) : (
                              <FavoriteBorderIcon
                                sx={{
                                  background:'#3734345c',
                                  display: "flex",
                                  justifyContent: "center",
                                  alignContent: "center",
                                  transition: "all 0.5s",
                                  padding: "1px",
                                  borderRadius: "100%",
                                  color: "white",
                                  "&:hover": { color: "#bc3737bd" },
                                }}
                                onClick={() => handleAddFavorite(object.object.id)}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <Link href={`/object/${object.object.id}`} className="w-[100%]">
                      <>
                        <div className={`flex mt-[5px] gap-[5px] md:mt-[0px] flex-col  w-full  h-full   items-start md:gap-[20px]  relative
                          ${theme === "dark"? "text-[white]":"text-[black]"}`}>
                          
                          <h3 className="hidden md:flex  w-full text-sm ">
                            Категория: {object.object.category}
                          </h3>

                          <h3 className={`flex md:hidden w-full text-[15px] xs:text-[17px] md:text-sm  gap-[5px] items-center  ${theme === "dark"? "text-[white]":"text-[black]"}`}>
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

                          <h2 className="flex text-[#9da1ab] text-[13px]  md:text-[16px]">
                            {`${object.object.state}, ${object.object.city},${
                              object.object.street == "Не указана"
                                ? ""
                                : `, ${object.object.street}`
                            }`.length > 70
                              ? `${`${object.object.state}, ${object.object.city} ${
                                  object.object.street == "Не указана"
                                    ? ""
                                    : `, ${object.object.street}`
                                }`.slice(0, 70)}...`
                              : `${object.object.state}, ${object.object.city} ${
                                  object.object.street == "Не указана"
                                    ? ""
                                    : `, ${object.object.street}`
                                }`}{" "}
                          </h2>
                          
                          <div className="flex md:hidden  w-full absolute bottom-0  justify-end">
                            <Image
                              className="flex md:hidden"
                              src={logoFind(object.object.companyName) ?? ""}
                              alt={object.object.category}
                              width={70}
                              height={25}
                              loading="lazy"
                            />
                          </div>

                          <h1 className="flex w-full  font-bold text-[25px] sm:text-[22px]">
                            {numberWithSpaces(Number(object.object.price))} ₽
                          </h1>

                          <div className="hidden md:flex  flex-col md:flex-row  gap-[5px]  md:gap-[40px]  mt-[5px]  md:mt-[30px]">
                            {object.object.square && (
                              <PropertyInfo
                                icon={plan}
                                label="Общая площадь"
                                value={`${
                                  object.object.square
                                    ? Number.isInteger(object.object.square)
                                      ? Math.round(parseInt(object.object.square))
                                      : object.object.square
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

                            {(object.object.floor &&
                              object.object.floors &&
                              object.object.category == "Квартиры") ||
                              (object.object.category == "Комнаты" && (
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
                              ))}

                            {object.object.floor == null ||
                              (object.object.floor == "" && object.object.floors && (
                                <PropertyInfo
                                  icon={floor}
                                  label="Этажей"
                                  value={
                                    object.object.floors
                                      ? Math.round(parseInt(object.object.floors))
                                      : ""
                                  }
                                />
                              ))}
                          </div>

                          <div className="hidden md:flex w-full md:absolute md:bottom-0 md:justify-end">
                            <Image
                              className="hidden md:flex "
                              src={logoFind(object.object.companyName) ?? ""}
                              alt={object.object.category}
                              width={150}
                              height={60}
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </>
                    </Link>
                  </article>
                </div>
                <div className="hidden md:flex w-full justify-center">
                  <div className={`flex  w-[95%]  h-[0.80px] ${theme === "dark"? " bg-[#f1f2f43d] ":" bg-[#f1f2f4] "} `}></div>
                </div>
              </Fragment>
              </>
            ))}
          </>
      </main>
    </>
  );
}
