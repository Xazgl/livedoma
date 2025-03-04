"use client";
import { ObjectIntrum } from "@prisma/client";
import Image from "next/image";
import { getRoomsEnding, logoFind, numberWithSpaces } from "./functionCard";
import ProgressBar from "../../progressBar/ProgressBar";
import {
  Dispatch,
  Fragment,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { PaginationRow } from "../../paginationRow/PaginatiowRow";
import PropertyInfo from "../../currentObjComponents/description/PropertyInfo";
import size from "/public/svg/size.svg";
import plan from "/public/svg/plan.svg";
import floor from "/public/svg/floor.svg";
import styles from "./Object.module.css";
import { Circle } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FilterUserOptions } from "../../../../../@types/dto";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import noPhoto from "/public/images/noPhoto.jpg";
import Link from "next/link";
import DynamicCardImg from "./DynamicCardImg";
import { SortDateSelect } from "../../filterFields/sortPrice/SortPriceSelect";
import { SortPriceSelect } from "../../filterFields/sortDate/SortDateSelect";
import { useTheme } from "../../provider/ThemeProvider";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import {
  addFavorite,
  deleteFavorite,
  fetchFavorites,
} from "@/app/redux/slice/favoriteSlice";
import React from "react";

type Props = {
  filteredHouse: ObjectIntrum[];
  loading: boolean;
  allPages: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
  refCardsObjects: RefObject<HTMLDivElement>;
  currentFilter: FilterUserOptions;
  setCurrentFilter: Dispatch<SetStateAction<FilterUserOptions>>;
  resetPageAndReloadData: () => void;
  isVisibleFilter: boolean;
};

function ObjectsCardsTest({
  filteredHouse,
  loading,
  allPages,
  currentPage,
  handlePageChange,
  refCardsObjects,
  currentFilter,
  setCurrentFilter,
  resetPageAndReloadData,
  isVisibleFilter,
}: Props) {
  const [loadingImg, setLoadingImg] = useState(true);
  const { theme } = useTheme();

  let style = loading
    ? "flex-col items-center  h-[100vh]  justify-center  flex-nowrap"
    : "flex-row justify-center gap-[0px] sm:gap-[20px] lg:gap-[0px] md:items-center md:items-start   h-full  flex-wrap ";

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
        setLoadingImg(false);
      }
    }
    start();
  }, []);

  //Redux
  const dispatch = useDispatch<AppDispatch>();
  const { favorites, error } = useSelector(
    (state: RootState) => state.favorite
  );

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleAddFavorite = (id: string) => {
    dispatch(addFavorite(id));
  };

  const handleDeleteFavorite = (id: string) => {
    dispatch(deleteFavorite(id));
  };


  const width = isVisibleFilter ? "w-full md:w-[80%]" : "w-full md:w-[100%]";

  return (
    <main
      id={styles.main}
      style={{ transition: "all 0.5s" }}
      className={`flex w-full  ${width}  p-7   ${style} relative `}
      ref={refCardsObjects}
    >
      <div className="flex justify-start w-full gap-[25px]">
        <SortDateSelect
          currentFilter={currentFilter}
          setCurrentFilter={setCurrentFilter}
          resetPageAndReloadData={resetPageAndReloadData}
        />
        <SortPriceSelect
          currentFilter={currentFilter}
          setCurrentFilter={setCurrentFilter}
          resetPageAndReloadData={resetPageAndReloadData}
        />
      </div>
      {loading ? (
        <ProgressBar />
      ) : (
        <>
          {filteredHouse.map((object) => (
            <Fragment key={object.id}>
              <div className="flex  justify-center  md:justify-start md:w-full  mt-[35px] md:mt-[0px]">
                <article
                  key={object.id}
                  style={{ transition: "all 1s" }}
                  className={`flex   flex-col  md:flex-row  h-[100%] w-[85vw]   sm:w-[320px] md:w-full  md:h-[250px] xxl:h-[300px]   sm:p-2  md:mt-[10px]  md:gap-[50px]
                                 md:border-none md:border-[transparent] md:border-[0px] 
                                cursor-pointer   md:duration-700   md:ease-in-out    ${
                                  theme === "dark"
                                    ? "dark:md:hover:shadow-dark-2xl"
                                    : "md:hover:shadow-2xl"
                                }`}
                >
                  <div className="flex  flex-col  w-[auto]  h-[100%]    md:justify-around">
                    <div className="flex   w-[100%] h-[200px] sm:w-[300px]  sm:h-[260px]   lg:w-[400px] lg:h-[98%]  relative overflow-hidden">
                      <Link
                        href={`/object/${object.id}`}
                        className="w-[100%] h-[100%]"
                      >
                        {/* <Image
                            className=" rounded "
                            src={object.img[0]}
                            alt={object.category}
                            layout="fill"
                            sizes="(max-width: 750px) 85vw,
                                              (max-width: 828px) 40vw,
                                              (max-width: 1080px) 33vw,
                                               30vw"
                            loading="lazy"
                          />   */}
                        {/* <img
                            className="rounded w-full h-full   "
                            src={object.thubmnail[0] ? object.thubmnail[0] : object.img[0] ? object.img[0] : object.imgUrl[0]}
                            // src={fetchData(object.id_intrum)? fetchData(object.id_intrum) :'' }
                            alt={object.category}
                            loading="lazy"
                          /> */}

                        <DynamicCardImg
                          alt={object.category}
                          src={
                            object.thubmnail[0]
                              ? object.thubmnail[0]
                              : object.img[0]
                              ? object.img[0]
                              : object.imgUrl.length > 0 &&
                                object.imgUrl[0] !== ""
                              ? object.imgUrl[0]
                              : noPhoto.src
                          }
                        />
                      </Link>
                      {loadingImg == false && (
                        <div className="flex absolute w-[100%] justify-end p-[4px]">
                          {favorites.find(
                            (obj) => obj.object.id === object.id
                          ) ? (
                            <FavoriteIcon
                              sx={{
                                background: "#80757529",
                                display: "flex",
                                transition: "all 0.5s",
                                justifyContent: "center",
                                alignContent: "center",
                                padding: "1px",
                                borderRadius: "100%",
                                color: "#d31717",
                                "&:hover": { color: "black" },
                              }}
                              onClick={() => handleDeleteFavorite(object.id)}
                            />
                          ) : (
                            <FavoriteBorderIcon
                              sx={{
                                background: "#3734345c",
                                display: "flex",
                                justifyContent: "center",
                                alignContent: "center",
                                transition: "all 0.5s",
                                padding: "1px",
                                borderRadius: "100%",
                                color: "white",
                                "&:hover": { color: "#bc3737bd" },
                              }}
                              onClick={() => handleAddFavorite(object.id)}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <Link href={`/object/${object.id}`} className="w-[100%]">
                    <>
                      <div
                        className={`flex mt-[5px] gap-[5px] md:mt-[0px] flex-col  w-full  h-full   items-start md:gap-[20px]  relative
                          ${
                            theme === "dark" ? "text-[white]" : "text-[black]"
                          }`}
                      >
                        <h3>
                          <span className="hidden md:flex  w-full text-sm">
                            Категория: {object.category}
                          </span>
                          <span
                            className={`flex md:hidden w-full text-[15px] xs:text-[17px] md:text-sm  gap-[5px] items-center  ${
                              theme === "dark" ? "text-[white]" : "text-[black]"
                            }`}
                          >
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
                          </span>
                        </h3>

                        <p className="flex text-[#9da1ab] text-[13px]  md:text-[16px]">
                          {`${object.state}, ${object.city},${
                            object.street == "Не указана"
                              ? ""
                              : `, ${object.street}`
                          }`.length > 70
                            ? `${`${object.state}, ${object.city} ${
                                object.street == "Не указана"
                                  ? ""
                                  : `, ${object.street}`
                              }`.slice(0, 70)}...`
                            : `${object.state}, ${object.city} ${
                                object.street == "Не указана"
                                  ? ""
                                  : `, ${object.street}`
                              }`}{" "}
                        </p>

                        <div className="flex md:hidden  w-full absolute bottom-0  justify-end">
                          {object.companyName &&
                            object.companyName !== "ООО СЗ АБН-СТРОЙ" && (
                              <Image
                                className="flex md:hidden"
                                src={logoFind(object.companyName) ?? ""}
                                alt={object.category}
                                width={70}
                                height={25}
                                loading="lazy"
                              />
                            )}
                        </div>

                        <span className="flex w-full  font-bold text-[25px] sm:text-[22px]">
                          {numberWithSpaces(Number(object.price))} ₽
                        </span>

                        <div className="hidden md:flex  flex-col md:flex-row  gap-[5px]  md:gap-[40px]  mt-[5px]  md:mt-[30px]">
                          {object.square && (
                            <PropertyInfo
                              icon={plan}
                              label="Общая площадь"
                              value={`${
                                object.square
                                  ? Number.isInteger(object.square)
                                    ? Math.round(parseInt(object.square))
                                    : object.square
                                  : ""
                              } м²`}
                            />
                          )}
                          {object.ceilingHeight && (
                            <PropertyInfo
                              icon={size}
                              label="Высота потолков"
                              value={`${
                                object.ceilingHeight ? object.ceilingHeight : ""
                              } м`}
                            />
                          )}

                          {(object.floor &&
                            object.floors &&
                            object.category == "Квартиры") ||
                            (object.category == "Комнаты" && (
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
                            ))}

                          {object.floor == null ||
                            (object.floor == "" && object.floors && (
                              <PropertyInfo
                                icon={floor}
                                label="Этажей"
                                value={
                                  object.floors
                                    ? Math.round(parseInt(object.floors))
                                    : ""
                                }
                              />
                            ))}
                        </div>

                        <div className="hidden md:flex w-full md:absolute md:bottom-0 md:justify-end">
                          {object.companyName &&
                            object.companyName !== "ООО СЗ АБН-СТРОЙ" && (
                              <Image
                                className="hidden md:flex "
                                src={logoFind(object.companyName) ?? ""}
                                alt={object.companyName}
                                width={150}
                                height={60}
                                loading="lazy"
                              />
                            )}
                        </div>
                      </div>
                    </>
                  </Link>
                </article>
              </div>
              <div className="hidden md:flex w-full justify-center">
                <div
                  className={`flex  w-[95%]  h-[0.80px] ${
                    theme === "dark" ? " bg-[#f1f2f43d] " : " bg-[#f1f2f4] "
                  } `}
                ></div>
              </div>
            </Fragment>
          ))}
        </>
      )}
      <div className="flex mt-[35px] sm:hidden">
        <PaginationRow
          currentPage={currentPage}
          totalPages={allPages}
          handlePageChange={handlePageChange}
        />
      </div>
    </main>
  );
}

export default React.memo(ObjectsCardsTest);
