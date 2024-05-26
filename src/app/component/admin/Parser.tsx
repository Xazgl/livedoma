"use client";
import axios from "axios";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { InparseAnswer } from "../../../../@types/dto";
import { createArchive} from "@/lib/inparseExcel";

//Маппинг русских заголовков 
const headersMapping: { [key: string]: string } = {
  'ID Объекта': 'objectId',
  'Название': 'address',
  'Ответственный (Главный)': 'responsible',
  'Комнат в квартире': 'rooms',
  'Этаж': 'floor',
};


export function Parser() {

  const [objectsInparse, setObjectsInparse] = useState<InparseAnswer[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) {
      console.error("No file selected.");
      return;
    }
    const file = fileList[0];
    console.log(file);
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension !== "xlsx" && extension !== "xls") {
      console.error("Unsupported file format. Please select an Excel file.");
      return;
    }
    console.log(extension);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const target = e.target;
        if (target) {
          const contents = target.result;
          const workbook = XLSX.read(contents, { type: "binary" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Предполагаем, что нужная вам таблица находится в первом листе

          const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Преобразуем таблицу в массив

          // Получаем заголовки столбцов
          const headers = data[0];

          // Преобразуем остальные строки в объекты
          const objects = data.slice(1).map((row: any) => {
            const obj: any = {};
            //@ts-ignore
            headers.forEach((header: string, index: number) => {
              const englishHeader = headersMapping[header];
              if (englishHeader) {
                obj[englishHeader] = row[index];
              }
            });
            return obj;
          });
          // console.log("Array of objects:", objects);

          const res = await axios.post('/api/findObjectsInparse', {
            objects: objects
          }, {
            headers: {
              "Content-Type": "application/json",
            }
          });
      
          // Предполагается, что ответ содержит массив объектов
          const objectsRes = res.data.results
          // setObjectsInparse(objectsRes)
          // await createExcel(objectsInparse)
          await createArchive(objectsRes)

          
      
          console.log("Array of objects:", objectsRes );

          // const res = await fetch(`/api/inparse`, {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({ objects}),
          // });
          // return res;

          // // Проходим по каждому объекту и отправляем запросы
          // for (const obj of objects) {
          //   const address = obj["Название"]; // Получаем название объекта

          //   // Делаем запрос к API Яндекс.Карт для получения координат
          //   const geoResponse = await fetch(
          //     `https://geocode-maps.yandex.ru/1.x/?apikey=fab78cee-5042-4e98-92f2-76c2bc8bbb17&format=json&geocode=Волгоград,${address}`
          //   );
          //   const geoData = await geoResponse.json();

          //   if (
          //     geoData.response.GeoObjectCollection.featureMember.length === 0
          //   ) {
          //     console.error(`No geocode result for address: ${address}`);
          //     continue;
          //   }

          //   // Извлекаем координаты из ответа Яндекса
          //   const geoObject = geoData.response.GeoObjectCollection.featureMember[0].GeoObject;
          //   const coordinates = geoObject.Point.pos.split(" ");
          //   const lat = coordinates[1];
          //   const lon = coordinates[0];

          //   // Извлекаем границы из ответа Яндекса
          //   const envelope = geoObject.boundedBy.Envelope;
          //   const [lngFrom, latFrom] = envelope.lowerCorner.split(" ");
          //   const [lngTo, latTo] = envelope.upperCorner.split(" ");

          //   // Делаем POST-запрос к вашему API с полученными координатами
          //   const postResponse = await axios(
          //     `https://inpars.ru/api/v2/estate?sortBy=updated_asc&regionId=34&access-token=_aPxqTB4ch1YHWR3q72bcNLTgMYMC-Iv&latFrom=${latFrom}&latTo=${latTo}&lngFrom=${lngFrom}&lngTo=${lngTo}`,
          //     {
          //       method: "POST",
          //       headers: {
          //         "Content-Type": "application/json",
          //       }
          //     }
          //   );
          //   const postData = await postResponse;
          //   // const postData = await postResponse.json();

          //   // Добавляем данные к объекту
          //   obj["coordinates"] = { lat, lon };
          //   obj["concurrency"] = postData;
          // }
          // console.log("finish:", objects);
        }
      } catch (error) {
        console.error("Error processing file:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={(e) => handleChange(e)}
        //  onChange={handleFileUpload}
      />
    </>
  );
}

