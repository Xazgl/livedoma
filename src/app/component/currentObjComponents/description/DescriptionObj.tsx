import { ObjectIntrum } from "@prisma/client";
import size from "/public/svg/size.svg";
import plan from "/public/svg/plan.svg";
import floor from "/public/svg/floor.svg";
import PropertyInfo from "./PropertyInfo";
import Link from "next/link";
import Image from "next/image";
import { logoFind, numberWithSpaces } from "../../main-block-filter/objectsCards/functionCard";
import { useTheme } from "../../provider/ThemeProvider";
import React from "react";

type Props = {
  object: ObjectIntrum;
};

function DescriptionObj({ object }: Props) {
  const { theme } = useTheme();
  return (
    <section className="flex flex-col w-full h-[auto] p-5">
      <div className="flex flex-col sm:flex-row gap-[60px] justify-center">
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
            value={object.ceilingHeight ? object.ceilingHeight : ""}
          />
        )}
        {object.floor && object.floors && (
          <PropertyInfo
            icon={floor}
            label="Этаж"
            value={`${
              object.floor ? Math.round(parseInt(object.floor)) : ""
            } из ${object.floors ? Math.round(parseInt(object.floors)) : ""}`}
          />
        )}

        {object.floor == null ||
          (object.floor == "" && object.floors && (
            <PropertyInfo
              icon={floor}
              label="Этажей"
              value={object.floors ? Math.round(parseInt(object.floors)) : ""}
            />
          ))}
      </div>

      <div
        className={`flex flex-col mt-[50px] w-full h-auto text-sm  ${theme === "dark" ? "text-[#868b9a]" : "text-[#4c505b]"}`}
      >
        <Image
          className="flex "
          src={logoFind(object.companyName) ?? ""}
          alt={object.category}
          width={150}
          height={100}
          loading="lazy"
        />
        <span className={`flex w-full  font-bold text-[25px] sm:text-[22px]  ${theme === "dark" ? "text-[white]" : "text-[#4c505b]"}`}>
          {numberWithSpaces(Number(object.price))} ₽
        </span>
        <p
          className="mt-[30px]"
          dangerouslySetInnerHTML={{
            __html: object.description ? object.description : "",
          }}
        ></p>

        {object.companyName  !== "Владис" && (
          <div className="flex mt-[20px]">
            <Link
              href={`https://jivemdoma.intrumnet.com/crm/tools/exec/stock/${object.id_intrum}#stock`}
              className="flex text-[#1E8DAC] text-[30px]  sm:text-[20px] justify-center md:justify-start md:w-full  mt-[20px] md:mt-[0px]"
            >
              INTRUM
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-col mt-[20px] w-full h-auto text-sm text-[#737a8e]">
        <Link
          href={`https://yandex.ru/maps/?text=${object.state}, ${object.city}, ${object.street}`}
          className="flex  justify-center md:justify-start md:w-full  mt-[20px] md:mt-[0px]"
        >
          <button
            className={`flex  flex-row delay-450  duration-700 ease-in-ou justify-center items-center w-[100%] md:w-[300px] h-[40px] text-base	 border-2
           border-[#f2c200]  rounded-[3px] gap-[5px] text-[white] bg-[#f2c200]
           md:rounded-bl-[15px]  md:rounded-tr-[15px] md:bg-[transparent]
            md:hover:bg-[#f2c200]   md:hover:rounded-br-[10px]  md:hover:rounded-tl-[10px]  
          md:hover:rounded-bl-[0px]   md:hover:rounded-tr-[0px]  md:hover:rounded-[3px]
          ${theme === "dark"? "md:text-[white] hover:text-[black] ":"md:text-[black] hover:text-[white] "}`}
          >
            Построить маршурт{"  "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="20"
              fill="none"
              viewBox="0 0 26 26"
            >
              <path
                fill="#FC3F1D"
                d="M26 13c0-7.18-5.82-13-13-13S0 5.82 0 13s5.82 13 13 13 13-5.82 13-13Z"
              ></path>
              <path
                fill="#fff"
                d="M17.55 20.822h-2.622V7.28h-1.321c-2.254 0-3.38 1.127-3.38 2.817 0 1.885.758 2.816 2.448 3.943l1.322.932-3.749 5.828H7.237l3.575-5.265c-2.059-1.495-3.185-2.817-3.185-5.265 0-3.012 2.058-5.07 6.023-5.07h3.9v15.622Z"
              ></path>
            </svg>
          </button>
        </Link>
      </div>
    </section>
  );
}

export default React.memo(DescriptionObj);
