"use client";
import { ObjectIntrum } from "@prisma/client";
import ProgressBar from "../../progressBar/ProgressBar";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { PaginationRow } from "../../paginationRow/PaginatiowRow";
import styles from "./Object.module.css";
import { FilterUserOptions } from "../../../../../@types/dto";
import { SortDateSelect } from "../../filterFields/sortPrice/SortPriceSelect";
import { SortPriceSelect } from "../../filterFields/sortDate/SortDateSelect";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import {
  addFavorite,
  deleteFavorite,
  fetchFavorites,
} from "@/app/redux/slice/favoriteSlice";
import React from "react";
import { NoObjects } from "./NoObjects";
import Card from "./card/Card";

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
        await res.json();
        setLoadingImg(false);
      }
    }
    start();
  }, []);

  //Redux
  const dispatch = useDispatch<AppDispatch>();
  const { favorites } = useSelector((state: RootState) => state.favorite);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleAddFavorite = useCallback(
    (id: string) => {
      dispatch(addFavorite(id));
    },
    [dispatch]
  );

  const handleDeleteFavorite = useCallback(
    (id: string) => {
      dispatch(deleteFavorite(id));
    },
    [dispatch]
  );

  const width = isVisibleFilter ? "w-full md:w-[80%]" : "w-full md:w-[100%]";
  const objectsResult = filteredHouse.length > 0;

  return (
    <main
      id={styles.main}
      style={{ transition: "all 0.5s" }}
      className={`flex w-full  ${width}  p-7   ${style} relative `}
      ref={refCardsObjects}
    >
      {objectsResult && (
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
      )}

      {loading ? (
        <ProgressBar />
      ) : (
        <>
          {objectsResult ? (
            <>
              {filteredHouse.map((object) => (
                <Card
                  key={object.id}
                  object={object}
                  loadingImg={loadingImg}
                  favorites={favorites}
                  handleDeleteFavorite={handleDeleteFavorite}
                  handleAddFavorite={handleAddFavorite}
                />
              ))}
            </>
          ) : (
            <NoObjects />
          )}
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
