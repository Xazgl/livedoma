"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TableContainer,
  Paper,
} from "@mui/material";
import { InparseObjects } from "@prisma/client";
import { getInparseCategory } from "./utils";

interface ObjectsTableProps {
  objectsAll: InparseObjects[];
  idPage: string;
}

const ControlTable: React.FC<ObjectsTableProps> = ({ objectsAll, idPage }) => {
  const [objects, setObjects] = useState(objectsAll);

  useEffect(() => {
    const fetchObjects = async () => {
      if (!idPage) return;

      try {
        const response = await fetch(`/api/allobjinparse/${idPage}`);
        if (!response.ok) {
          throw new Error("Не удалось получить данные");
        }
        const data = await response.json();
        setObjects(data.objects);
      } catch (error) {
        console.error("Ошибка при получении объектов:", error);
      }
    };

    fetchObjects();
  }, [idPage]);

  const handleToggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/inparsobj/${id}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Не удалось обновить объект");
      }

      const updatedObject = await response.json();
      setObjects((prevObjects) =>
        prevObjects.map((obj) =>
          obj.idInparse === id ? { ...obj, active: updatedObject.active } : obj
        )
      );
    } catch (error) {
      console.error("Ошибка при обновлении объекта:", error);
    }
  };

  //   const fetchObjects = async () => {
  //     if (!idPage) return;

  //     try {
  //       const response = await fetch(`/api/allobjinparse/${idPage}`);
  //       if (!response.ok) {
  //         throw new Error("Не удалось получить данные");
  //       }
  //       const data = await response.json();
  //       setObjects(data.objects); // Обновляем объекты свежими данными с сервера
  //     } catch (error) {
  //       console.error("Ошибка при получении объектов:", error);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchObjects();
  //   }, [idPage]);

  //   const handleToggleActive = async (id: string) => {
  //     try {
  //       const response = await fetch(`/api/inparsobj/${id}`, {
  //         method: "PUT",
  //       });

  //       if (!response.ok) {
  //         throw new Error("Не удалось обновить объект");
  //       }

  //       const updatedObject = await response.json();

  //       // После успешного обновления объекта, загружаем актуальные данные с сервера
  //       await fetchObjects(); // Обновляем данные, чтобы отобразить актуальные изменения
  //     } catch (error) {
  //       console.error("Ошибка при обновлении объекта:", error);
  //     }
  //   };

  return (
    <section className="flex w-full h-full pt-[20px]  pb-[20px]">
      <TableContainer component={Paper} sx={{ display: "flex", width: "100%" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Объект в CRM</TableCell>
              {/* <TableCell>ID Inparse</TableCell> */}
              <TableCell>ID Категории</TableCell>
              {/* <TableCell>Название</TableCell> */}
              <TableCell>Адрес</TableCell>
              {/* <TableCell>Этаж</TableCell>
            <TableCell>Этажей</TableCell> */}
              {/* <TableCell>Площадь</TableCell>
            <TableCell>Площадь земли</TableCell> */}
              <TableCell>Цена</TableCell>
              {/* <TableCell>Описание</TableCell> */}
              <TableCell>Фото</TableCell>
              {/* <TableCell>ФИО</TableCell> */}
              <TableCell>Телефон</TableCell>
              <TableCell>Ссылка</TableCell>
              {/* <TableCell>Продавец</TableCell> */}
              <TableCell>Источник</TableCell>
              <TableCell>В Inparse</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {objects.map((obj) => (
              <TableRow key={obj.idInparse}>
                <TableCell>
                  <button
                    style={{ transition: "all 0.2s" }}
                    className={`px-4 py-2 font-semibold text-white rounded whitespace-nowrap no-underline ${
                      obj.active
                        ? "bg-red-500 hover:bg-red-700"
                        : "bg-green-500 hover:bg-green-700"
                    }`}
                    onClick={() => handleToggleActive(obj.idInparse)}
                  >
                    {obj.active ? "Не в CRM" : "Добавлен"}
                  </button>
                </TableCell>
                {/* <TableCell>{obj.id}</TableCell> */}
                <TableCell>
                  {getInparseCategory(obj.categoryId)
                    ? getInparseCategory(obj.categoryId)
                    : obj.categoryId}
                </TableCell>
                {/* <TableCell>{obj.title}</TableCell> */}
                <TableCell
                  style={{ wordBreak: "break-word", whiteSpace: "normal" }}
                >
                  {obj.address}
                </TableCell>
                {/* <TableCell>{obj.floor || ""}</TableCell>
              <TableCell>{obj.floors || ""}</TableCell> */}
                {/* <TableCell>{obj.sq || ""}</TableCell>
              <TableCell>{obj.sqLand || ""}</TableCell> */}
                <TableCell>{obj.price || ""}</TableCell>
                {/* <TableCell>{obj.description || ""}</TableCell> */}
                <TableCell>
                  {obj.images.length > 0 ? (
                    <img
                      src={obj.images[0]}
                      alt={obj.title}
                      style={{ width: "100px", height: "auto" }}
                    />
                  ) : (
                    "Нет изображения"
                  )}
                </TableCell>
                {/* <TableCell>{obj.name}</TableCell> */}
                <TableCell>
                  {obj.phones.length > 0 ? obj.phones.join(", ") : "Не указан"}
                </TableCell>
                <TableCell>
                  <a
                    href={obj.url}
                    className={`text-[#2563eb]  hover:text-[#1e3a8a]`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ wordBreak: "break-word", transition: "all 0.2s" }}
                  >
                    {obj.url}
                  </a>
                </TableCell>
                {/* <TableCell>{obj.agent || ""}</TableCell> */}
                <TableCell>{obj.source || ""}</TableCell>
                <TableCell>
                  {typeof obj.createdAt === "string" ||
                  obj.createdAt instanceof String
                    ? new Date(obj.createdAt).toLocaleDateString("ru-RU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) +
                      " " +
                      new Date(obj.createdAt).toLocaleTimeString("ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : obj.createdAt instanceof Date
                    ? obj.createdAt.toLocaleDateString("ru-RU") +
                      " " +
                      obj.createdAt.toLocaleTimeString("ru-RU")
                    : ""}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
};

export default ControlTable;
