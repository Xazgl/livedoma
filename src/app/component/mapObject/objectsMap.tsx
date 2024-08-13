"use client";
import { ObjectIntrum } from "@prisma/client";
import { useEffect, useState } from "react";
import { FilterUserOptions } from "../../../../@types/dto";
import { useTheme } from "../provider/ThemeProvider";

type YandexMapProps = {
  mapObj: ObjectIntrum[] | undefined;
  currentFilter: FilterUserOptions;
};

export default function ObjectsMap({ mapObj, currentFilter }: YandexMapProps) {
  const { theme } = useTheme();
  const [coordinatesList, setCoordinatesList] = useState<
    { id: string; coords: string[] }[]
  >([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function fetchCoordinates(object: ObjectIntrum) {
      const geoResponse = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=fab78cee-5042-4e98-92f2-76c2bc8bbb17&format=json&geocode=${object.city},${object.street}`
      );
      const geoData = await geoResponse.json();
      const geoObject =
        geoData.response.GeoObjectCollection.featureMember[0].GeoObject;
      const coords = geoObject.Point.pos.split(" ");
      return { id: object.id, coords };
    }

    async function fetchAllCoordinates() {
      if (currentFilter.street && currentFilter.street.length > 0) {
        const filteredObjects = mapObj;

        const coordinatesPromises = filteredObjects
          ? filteredObjects.map((object) => fetchCoordinates(object))
          : [];
        const coordinates = await Promise.all(coordinatesPromises);

        // Задержка 700 секунд перед установкой состояния
        setTimeout(() => {
          setCoordinatesList(coordinates);
          setIsReady(true);
        }, 700);
      }
    }

    fetchAllCoordinates();
  }, [mapObj, currentFilter]);

  const getMapCenter = () => {
    if (coordinatesList.length === 0) {
      return "44.5018,48.7071"; // Координаты центра Волгограда
    }

    // Центрируем карту по первой доступной точке
    const firstCoord = coordinatesList[0].coords;
    return `${firstCoord[0]},${firstCoord[1]}`;
  };

  return (
    <div className="flex  flex-col items-center mt-[20px] sm:mt-[35px]">
      {currentFilter &&
        currentFilter.street &&
        currentFilter.street.length > 0 &&
        isReady && (
          <>
            <div className="flex w-[90%] h-auto ">
              {coordinatesList.length > 0 && (
                <iframe
                  src={`https://yandex.ru/map-widget/v1/?ll=${getMapCenter()}&z=14&pt=${coordinatesList
                    .map(
                      (coord) => `${coord.coords[0]},${coord.coords[1]},pm2rdm`
                    )
                    .join("~")}`}
                  width="100%"
                  height="400px"
                  frameBorder="0"
                />
              )}
            </div>

            <div
              className={`flex w-[90%] justify-start mt-[15px] md:text-[18px]`}
            >
              <h2
                className={`${
                  theme === "dark" ? "text-[white]" : "text-[black]"
                }`}
              >
                {`${
                  mapObj && mapObj?.length > 1
                    ? `Объекты по улице ${
                        currentFilter &&
                        currentFilter.street &&
                        currentFilter.street[0]
                      }`
                    : `Объект по адресу ${
                        currentFilter &&
                        currentFilter.street &&
                        currentFilter.street[0]
                      }`
                }  `}
              </h2>
            </div>
          </>
        )}
    </div>
  );
}

// "use client";
// import { ObjectIntrum } from "@prisma/client";
// import { useEffect, useState } from "react";
// import { FilterUserOptions } from "../../../../@types/dto";

// type YandexMapProps = {
//   mapObj: ObjectIntrum[] | undefined;
//   currentFilter: FilterUserOptions;
// };

// export default function ObjectsMap({ mapObj, currentFilter }: YandexMapProps) {
//   const [coordinatesList, setCoordinatesList] = useState<
//     { id: string; coords: string[] }[]
//   >([]);

//   useEffect(() => {
//     async function fetchCoordinates(object: ObjectIntrum) {
//       const geoResponse = await fetch(
//         `https://geocode-maps.yandex.ru/1.x/?apikey=fab78cee-5042-4e98-92f2-76c2bc8bbb17&format=json&geocode=${object.city},${object.street}`
//       );
//       const geoData = await geoResponse.json();
//       const geoObject =
//         geoData.response.GeoObjectCollection.featureMember[0].GeoObject;
//       const coords = geoObject.Point.pos.split(" ");
//       return { id: object.id, coords };
//     }

//     async function fetchAllCoordinates() {
//       if (currentFilter.street && currentFilter.street.length > 0) {
//         const filteredObjects = mapObj;

//         const coordinatesPromises = filteredObjects
//           ? filteredObjects.map((object) => fetchCoordinates(object))
//           : [];
//         const coordinates = await Promise.all(coordinatesPromises);
//         setCoordinatesList(coordinates);
//       }
//     }

//     fetchAllCoordinates();
//   }, [mapObj, currentFilter]);

//   const getMapCenter = () => {
//     if (coordinatesList.length === 0) {
//       // Если нет точек, центрируем на Волгограде
//       return "44.5018,48.7071"; // Координаты центра Волгограда
//     }

//     // Вычисляем средние значения для широты и долготы
//     const totalCoords = coordinatesList.reduce(
//       (acc, coord) => {
//         acc[0] += parseFloat(coord.coords[0]);
//         acc[1] += parseFloat(coord.coords[1]);
//         return acc;
//       },
//       [0, 0]
//     );

//     const avgCoords = totalCoords.map(
//       (coord) => coord / coordinatesList.length
//     );
//     return `${avgCoords[0]},${avgCoords[1]}`;
//   };

//   return (
//     <>
//       {currentFilter &&
//         currentFilter.street &&
//         currentFilter.street.length > 0 && (
//           <div className="flex w-full h-auto mt-[5px] mb-[30px]">
//             {coordinatesList.length > 0 && (
//               <iframe
//                 src={`https://yandex.ru/map-widget/v1/?ll=${getMapCenter()}&z=14&pt=${coordinatesList
//                   .map(
//                     (coord) => `${coord.coords[0]},${coord.coords[1]},pm2rdm`
//                   )
//                   .join("~")}`}
//                 width="100%"
//                 height="400px"
//                 frameBorder="0"
//               />
//             )}
//           </div>
//         )}
//     </>
//   );
// }

// "use client";
// import React, { useState, useEffect } from "react";
// import { useTheme } from "../provider/ThemeProvider";

// export default function ObjectsMap() {
//   const { theme } = useTheme();
//   const [address, setAddress] = useState("");
//   const [coordinatesList, setCoordinatesList] = useState<
//     { id: string; coords: string[] }[]
//   >([]);

//   // Проверка параметра street в URL
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     if (params.has("street")) {
//       const streetFromUrl = params.get("street");
//       if (streetFromUrl) {
//         setAddress(streetFromUrl);
//         handleSearch(streetFromUrl); // Выполнить поиск сразу при загрузке страницы
//       }
//     }
//   }, []);

//   const fetchCoordinates = async (object: {
//     id: string;
//     street: string;
//     city: string;
//   }) => {
//     const geoResponse = await fetch(
//       `https://geocode-maps.yandex.ru/1.x/?apikey=fab78cee-5042-4e98-92f2-76c2bc8bbb17&format=json&geocode=${object.city},${object.street}`
//     );
//     const geoData = await geoResponse.json();
//     const geoObject =
//       geoData.response.GeoObjectCollection.featureMember[0].GeoObject;
//     const coords = geoObject.Point.pos.split(" ");
//     return { id: object.id, coords };
//   };

//   const handleSearch = async (searchAddress = address) => {
//     if (!searchAddress) return;

//     try {
//       const params = new URLSearchParams();
//       params.append("street", searchAddress);

//       const response = await fetch(`/api/map?${params.toString()}`);
//       if (!response.ok) {
//         console.error("Ошибка запроса к API");
//         return;
//       }
//       const { objects } = await response.json();

//       const coordinatesPromises = objects.map(
//         (object: { id: string; street: string; city: string }) =>
//           fetchCoordinates(object)
//       );
//       const coordinates = await Promise.all(coordinatesPromises);
//       setCoordinatesList(coordinates);
//     } catch (error) {
//       console.error("Ошибка при получении данных:", error);
//     }
//   };

//   const getMapCenter = () => {
//     if (coordinatesList.length === 0) {
//       // По умолчанию центр на Волгограде
//       return "44.5018,48.7071"; // Широта и долгота Волгограда
//     }

//     const totalCoords = coordinatesList.reduce(
//       (acc, coord) => {
//         acc[0] += parseFloat(coord.coords[0]);
//         acc[1] += parseFloat(coord.coords[1]);
//         return acc;
//       },
//       [0, 0]
//     );

//     const avgCoords = totalCoords.map((coord) => coord / coordinatesList.length);
//     return `${avgCoords[0]},${avgCoords[1]}`;
//   };

//   return (
//     <div className="flex flex-col w-full ">
//       <input
//         type="text"
//         value={address}
//         onChange={(e) => setAddress(e.target.value)}
//         placeholder="Введите адрес"
//         className="border p-2 rounded"
//       />
//       <button
//         onClick={() => handleSearch()}
//         style={{ transition: "all 1s" }}
//         className={`text-white border-[2px] ${
//           theme === "dark"
//             ? "border-[#6B7280] hover:bg-[#4B5563] focus:ring-gray-500"
//             : "border-[#563D82] hover:bg-[#3d295f] focus:ring-purple-300"
//         } font-bold rounded-lg text-sm px-4 py-2 text-center me-2 mb-2`}
//       >
//         Найти
//       </button>

//       <div className="flex w-full h-auto mt-5">
//         {coordinatesList.length > 0 && (
//           <iframe
//             src={`https://yandex.ru/map-widget/v1/?ll=${getMapCenter()}&z=14&pt=${coordinatesList
//               .map((coord) => `${coord.coords[0]},${coord.coords[1]},pm2rdm`)
//               .join("~")}`}
//             width="100%"
//             height="400px"
//             frameBorder="0"
//           />
//         )}
//       </div>
//     </div>
//   );
// }
