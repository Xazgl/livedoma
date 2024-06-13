"use client";
import axios from "axios";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { createArchiveNew, createExcelUniqObj} from "@/lib/inparseExcel";
// import logoBG from "/public/images/inparse/logo.jpg";
import exampleBG from "/public/images/inparse/example.png";
import cupImg from "/public/images/inparse/cup.png";
import { Button, CircularProgress, Input } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Image from "next/image";
import { InparseObjects } from "@prisma/client";

//Маппинг русских заголовков
const headersMapping: { [key: string]: string } = {
  "ID Объекта": "objectId",
  Название: "address",
  "Ответственный (Главный)": "responsible",
  "Комнат в квартире": "rooms",
  Этаж: "floor",
  Цена: "price",
};

export function Parser() {
  const [loading, setLoading] = useState(false);

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
        setLoading(true);
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

          const res = await axios.post(
            "/api/findObjectsInparse",
            {
              objects: objects,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const objectsRes = res.data.results;
          setLoading(false);
          await createArchiveNew(objectsRes);
        }
      } catch (error) {
        console.error("Error processing file:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };


  
const handleChange2 = async () => {
  try {
    // Устанавливаем состояние загрузки
    setLoading(true);

    const res = await axios.get(
      "/api/find",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(res.data.results)

    const objectsRes: InparseObjects[] = res.data.results;

    // Убираем состояние загрузки
    setLoading(false);

    await createExcelUniqObj(objectsRes);
  } catch (error) {
    console.error("Error processing file:", error);
    setLoading(false);
  }
};

  return (
    <section className="flex flex-col w-full h-[100%]">
      <div className="flex flex-col mt-[10px] w-full items-center sm:items-start">
        <div className="flex   w-[100%] h-[200px] sm:w-[300px]  sm:h-[260px]   lg:w-[900px] lg:h-[300px]  relative">
          <Image
            className=" rounded "
            src={exampleBG.src}
            alt={exampleBG.src}
            layout="fill"
            sizes="(max-width: 750px) 80vw,
              (max-width: 828px) 85vw,
              (max-width: 1080px) 85vw,
               85vw"
            loading="lazy"
          />
        </div>

        <h3 className="text-[12px] p-[0px] w-full mt-[15px] text-[#B5B8B1]">
          Ваш Excel файл должен быть в формате 5 колонок. <br />
          ID Объекта, Название, Ответственный (Главный),Комнат в квартире, Этаж,
          Цена
        </h3>

        <div className="flex w-full items-center gap-[10px]">
          <label htmlFor="file-upload" className="mt-[10px]">
            <Input
              id="file-upload"
              type="file"
              onChange={handleChange}
              inputProps={{ accept: ".xlsx, .xls" }}
              style={{ display: "none" }}
            />
            <Button
              variant="contained"
              component="span"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#01ca7c",
                transition: "all 0.7s",
                ":hover": {
                  backgroundColor: "#943c82",
                  transform: "scale(0.99)",
                },
              }}
            >
              Загрузить объекты <FileUploadIcon sx={{ fontSize: "22px" }} />
            </Button>
          </label>
          <div className="flex w-[78px] h-[90px]   mt-[20px] relative ">
            <Image
              className="display: block;-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 90%);transition: background-color 300ms "
              src={cupImg.src}
              alt={"cup"}
              layout="fill"
              sizes="(max-width: 750px) 80vw,
           (max-width: 828px) 80vw,
           (max-width: 1080px) 90vw,90vw"
              loading="lazy"
            />
          </div>
        </div>

        <div className="flex w-full items-center gap-[10px]">
          <Button
            variant="contained"
            component="span"
            onClick={handleChange2}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#01ca7c",
              transition: "all 0.7s",
              ":hover": {
                backgroundColor: "#943c82",
                transform: "scale(0.99)",
              },
            }}
          >Уникальные объекты</Button>
        </div>

        <div className="flex w-full mt-[5px] justify-center sm:justify-start ">
          {loading == true && (
            <CircularProgress sx={{ fontSize: "22px", color: "#943c82" }} />
          )}
        </div>
      </div>
    </section>
  );
}




