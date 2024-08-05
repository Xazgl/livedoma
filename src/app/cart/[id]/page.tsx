"use client";
import { useEffect, useState } from "react";
import { ObjectsFavCards } from "@/app/component/favorites/card/ObjectsFavCards";
import { FavoriteObj } from "../../../../@types/dto";
import { CircularProgress } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Header } from "@/app/component/header/Header";
import { MobileHeader } from "@/app/component/mainBarMobile/MobileBar";
import { Footer } from "@/app/component/folder/Footer";

export default function ObjectPage({ params }: { params: { id: string } }) {
  const [favArr, setFavArr] = useState<FavoriteObj[]>([]);

  useEffect(() => {
    async function getFav() {
      const res = await fetch("/api/favorite/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const result = await res.json();
        setFavArr(result.favoriteObjects);
      }
    }
    getFav();
  }, [params.id]);

  return (
    <>
      <Header />
      <MobileHeader />
      {favArr.length > 0 ? (
        <>
          <ObjectsFavCards favArr={favArr} setFavArr={setFavArr} />
          <Footer/>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center w-[100%] h-[100vh] bg-[transparent]">
          <CircularProgress />
        </div>
      )}
    </>
  );
}
