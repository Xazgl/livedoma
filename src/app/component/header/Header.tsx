"use client";
import Link from "next/link";
import Image from "next/image";
import { NavEl, logoArr } from "./navEl";
import { Fragment } from "react";
import { useTheme } from "../provider/ThemeProvider";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function Header({}) {
  const style = `flex relative  text-white text-base md:text-[18px] 
    after:absolute after:width-[0%] after:h-[1px] after:bg-[white] after:left-[50%] after:bottom-[-1px;] 
    after:hover:w-[100%]  after:hover:left-[0]  after:ease-in-out   after:duration-300   after:delay-0 
   `;

  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={`hidden md:flex w-[100%] h-[60px] md:h-[80px] items-center  md:rounded-b-3xl px-[70px] py-[20px]  ${
        theme === "dark" ? "bg-[#3a3f4635]" : "bg-[#000000e8]"
      } `}
      style={{ transition: "all 0.5s" }}
    >
      <div className="flex flex-row md:justify-between md:[gap-4] w-[100%]   items-center  h-[80px] ">
        <div className="flex  gap-4  w-[50%] h-[30px] md:h-[60px] items-center ">
          {logoArr.map((el, index) => (
            <Fragment key={index}>
              <Image
                src={el.img}
                width={el.w}
                height={el.h}
                sizes="100vh"
                alt={el.img}
                className="flex"
                loading="lazy"
              />
              {index !== logoArr.length - 1 && (
                <div className="flex w-[1px] h-[34px]  border-l-[1px] border-solid border-white border-opacity-50" />
              )}
            </Fragment>
          ))}
        </div>

        <nav className="flex h-[80px]   w-[50%]  items-center justify-start  ">
          <ul className="hidden lg:flex   sm:gap-6  md:gap-[60px]  items-center  h-[20px] ">
            {NavEl.map((item, index) => (
              <li
                key={index}
                className={style}
                style={{ transition: "all 1s" }}
              >
                <Link href={item.src}>{item.title}</Link>
              </li>
            ))}
          </ul>
          <div className="flex w-full   justify-end ">
            <a href="tel:+78442520505" className="flex w-[auto]">
              <button
                type="button"
                style={{ transition: "all 1s" }}
                className={`text-white border-[2px] ${
                  theme === "dark"
                    ? "border-[#6B7280] hover:bg-[#4B5563] focus:ring-gray-500"
                    : "border-[#563D82] hover:bg-[#3d295f] focus:ring-purple-300"
                } font-bold rounded-lg text-sm px-4 py-2 text-center me-2 mb-2`}
              >
                8 (8442) 52-05-05
              </button>
            </a>
          </div>
          <div className=" flex justify-end pl-[5px] h-full">
          <button
              onClick={toggleTheme}
              className="flex items-center justify-center h-[full]"
              title="Сменить тему"
            >
              {theme === "light" ? (
                <DarkModeIcon 
                  sx={{
                   color: "white", 
                   filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))",                  }}
                />
              ) : (
                <LightModeIcon
                 sx={{ 
                  color: "#e9e979",
                  filter: "drop-shadow(0 0 10px rgba(255, 223, 0, 0.8)) drop-shadow(0 0 20px rgba(255, 223, 0, 0.6))",
                 }} 
                />
              )}
          </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
