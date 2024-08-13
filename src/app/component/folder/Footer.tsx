"use client";
import { logoArr } from "../header/navEl";
import { useTheme } from "../provider/ThemeProvider";

export function Footer({}) {

  const { theme } = useTheme();


  return (
    <footer
     style={{ transition: "all 0.5s" }}
     className={`flex w-full  rounded-t-lg shadow   ${theme === "dark"? "bg-[#3a3f4635]":"dark:bg-[#000000e8]"}  mt-[50px]`}>
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
        <div className="flex gap-[30px]">
        {logoArr.map((el, index) => (
            <img
              key={index}
              src={el.img}
              className="flex h-5 md:h-7 items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
              alt={el.img}
            />
        ))}
       </div>
          <ul className="flex flex-col  justify-center sm:flex-row sm:justify-start flex-wrap md:items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <a href="https://jivem-doma.ru" className="hover:underline me-4 md:me-6">
                Живем Дома
              </a>
            </li>
            <li>
              <a href="https://metri34.ru" className="hover:underline me-4 md:me-6">
                Метры 
              </a>
            </li>
            <li>
              <a href="https://partner34.ru" className="hover:underline me-4 md:me-6">
                Партнер
              </a>
            </li>
            <li>
              <a href="https://volgograd.vladis.ru" className="hover:underline">
                Владис
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024{" "}
          <a href="https://mls-vlg.ru" className="hover:underline">
            Мультилистинг™
          </a>
          {/* . All Rights Reserved. */}
        </span>
      </div>
    </footer>
  );
}
