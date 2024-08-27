"use client";
import { ObjectsFavCards } from "@/app/component/favorites/card/ObjectsFavCards";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchFavorites } from "@/app/redux/slice/favoriteSlice";
import Link from "next/link";
import { useTheme } from "@/app/component/provider/ThemeProvider";
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import { AllHeader } from "@/app/component/allHeader/AllHeader";
import dynamic from 'next/dynamic';
const Footer = dynamic(() => import("@/app/component/folder/Footer"));

export default function ObjectPage({ params }: { params: { id: string } }) {
  const { theme, toggleTheme } = useTheme();
  const { favorites, loading } = useSelector(
    (state: RootState) => state.favorite
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  return (
    <>
      <AllHeader/>
      {/* {loading == true ? ( */}
        <>
          {favorites.length > 0 ? (
            <ObjectsFavCards favArr={favorites} />
          ) : (
            <div className="flex flex-col w-full h-[100vh] justify-center items-center">
              
              <Link href={`/`} className="flex flex-col w-full h-full justify-center items-center">
              <h1  
                  className={` mt-[10px]  ${
                     theme === "dark" ? "text-white" : "text-black" }
                  `}
              >
                    Ваше избранное пусто
              </h1>
                <button 
                style={{ transition: "all 1s" }}
                className={` border-[2px] mt-[10px] ${
                  theme === "dark"
                    ? "border-[#6B7280] hover:bg-[#4B5563] focus:ring-gray-500 text-white"
                    : "border-[#563D82] hover:bg-[#3d295f] focus:ring-purple-300 text-black hover:text-white"
                } font-bold rounded-lg text-sm px-4 py-2 text-center me-2 mb-2`}>Назад <ReplyAllIcon/></button>
              </Link>
            </div>
          )}
          <Footer />
        </>
      {/* ) : (
        <div className="flex flex-col items-center justify-center w-[100%] h-[100vh] bg-[transparent]">
          <CircularProgress />
        </div>
      )} */}
    </>
  );
}
