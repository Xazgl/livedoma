"use client"
import Link from "next/link";
import Image from "next/image";
import { NavEl, logoArr } from "./navEl";
import bg from "/public/images/big_img.jpg";
import { Fragment } from "react";

export function Header({}) {
  const style = `flex relative  text-white text-base md:text-[18px] 
    after:absolute after:width-[0%] after:h-[1px] after:bg-[white] after:left-[50%] after:bottom-[-1px;] 
    after:hover:w-[100%]  after:hover:left-[0]  after:ease-in-out   after:duration-300   after:delay-0 
   `;

  return (
    <header
      className="hidden md:flex w-[100%] h-[60px] md:h-[80px] items-center  md:rounded-b-3xl px-[70px] py-[20px] bg-[#000000e8] "
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
              <li key={index} className={style} style={{ transition: "all 1s" }}>
                <Link href={item.src}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex w-full   justify-end ">
            <a href="tel:+78442520505" className="flex w-[auto]">
              <button
                type="button"
                style={{ transition: "all 1s" }}
                className="text-white border-[2px] border-[#563D82] hover:bg-[#3d295f] focus:ring-4 focus:outline-none focus:ring-purple-300 font-bold rounded-lg text-sm px-4 py-2 text-center me-2 mb-2 dark:border-bg-[#563D82]  dark:hover:bg-[#563D82] dark:focus:ring-bg-[#563D82]"
              >
                8 (8442) 52-05-05
              </button>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
