import { ObjectIntrum } from "@prisma/client";
import size from "/public/svg/size.svg";
import plan from "/public/svg/plan.svg";
import floor from "/public/svg/floor.svg";
import PropertyInfo from "./PropertyInfo";
import Link from "next/link";

type Props = {
  object: ObjectIntrum;
};

export function DescriptionObj({ object }: Props) {
  return (
    <section className="flex flex-col w-full h-[auto] p-5">
      <div className="flex flex-col sm:flex-row gap-[60px] justify-center">
        <PropertyInfo
          icon={plan}
          label="Общая площадь"
          value={`${
            object.square ? Math.round(parseInt(object.square)) : ""
          } м²`}
        />
        <PropertyInfo
          icon={size}
          label="Высота потолков"
          value={object.ceilingHeight ? parseInt(object.ceilingHeight) : ""}
        />
        <PropertyInfo
          icon={floor}
          label="Этаж"
          value={`${
            object.floor ? Math.round(parseInt(object.floor)) : ""
          } из ${object.floors ? Math.round(parseInt(object.floors)) : ""}`}
        />
      </div>

      <div className="flex flex-col mt-[50px] w-full h-auto text-sm text-[#737a8e]">
        <span
          dangerouslySetInnerHTML={{
            __html: object.description ? object.description : "",
          }}
        ></span>
      </div>

      <div className="flex flex-col mt-[10px] w-full h-auto text-sm text-[#737a8e]">
        <Link
          href={`https://yandex.ru/maps/?text=${object.state}, ${object.city}, ${object.street}`}
          className="flex  justify-center md:justify-start md:w-full  mt-[20px] md:mt-[0px]"
        >
          <button className={`flex  delay-450  duration-500 ease-in-ou justify-center items-center w-[100%] md:w-[300px] h-[35px] text-base	 border-2
           border-[#54529F]  rounded-[3px]  text-[white] bg-[#54529F]
           md:text-[#54529F] md:rounded-bl-[15px]  md:rounded-tr-[15px] md:bg-[transparent]
          hover:text-[white]   md:hover:bg-[#54529F]   md:hover:rounded-br-[10px]  md:hover:rounded-tl-[10px]  
          md:hover:rounded-bl-[0px]   md:hover:rounded-tr-[0px]  md:hover:rounded-[3px]` } >
            Построить маршурт
          </button>
        </Link>
      </div>
    </section>
  );
}
