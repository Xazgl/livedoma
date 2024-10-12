"use client";
import { Button, CircularProgress, Tooltip } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import * as XLSX from "xlsx";
import axios from "axios";
import { useState } from "react";
import { useTheme } from "../../provider/ThemeProvider";
import PhoneIcon from "@mui/icons-material/Phone";
import dynamic from "next/dynamic";
import DescriptionIcon from "@mui/icons-material/Description";
import { ResultsWazzupMesage } from "../../../../../@types/dto";
import BasicModal from "./ModalResults";

// Динамический импорт редактора Markdown
const MarkdownEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

export function WazzupMessages() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [messageText, setMessageText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0); // Новый ключ для поля ввода файла
  const [open, setOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [errorExcel, setErrorExcel] = useState<string>("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      setErrorExcel(""); // Сбрасываем сообщение об ошибке перед проверкой

      try {
        // Чтение файла как бинарного массива
        const data = await uploadedFile.arrayBuffer();
        const workbook = XLSX.read(data);

        // Получаем первый лист
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // Преобразуем лист в массив (с первой строкой как заголовки)
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Получаем заголовки (первая строка файла)
        const headers = jsonData[0];

        // Проверяем, есть ли колонка "Телефоны"
        //@ts-ignore
        if (!headers || !headers.includes("Телефоны")) {
          setErrorExcel(
            "Неверный формат файла. Должна быть колонка 'Телефоны'"
          );
          setFile(null);
          return;
        }
        setFile(uploadedFile);
      } catch (error) {
        // Обработка ошибок при чтении файла
        setErrorExcel(`Ошибка ${error}`);
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Пожалуйста, прикрепите файл с номерами телефонов.");
      return;
    }
    if (!messageText.trim()) {
      setErrorMessage("Рассылка не может быть пустой.");
      return;
    }

    setLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Проверка, что файл имеет корректную структуру
      const isValid = jsonData.every((row: any) => "Телефоны" in row);
      if (!isValid) {
        alert('Файл должен содержать колонку "Телефоны"');
        setLoading(false);
        return;
      }

      const results = await axios.post("/api/sendmessage", {
        data: jsonData,
        message: messageText,
      });

      setStatusMessage("success");

      const worksheetData = results.data.messageResults.map(
        (item: ResultsWazzupMesage) => ({
          Телефоны: item.formattedNumber,
          Статусы: item.status,
        })
      );

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbookResults = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbookResults, worksheet, "Результаты");

      // Получение текущей даты для названия файла
      const today = new Date();
      const formattedDate = today.toISOString().slice(0, 10); // YYYY-MM-DD

      const fileName = `Результаты_рассылки_${formattedDate}.xlsx`;

      // Генерация Excel файла в формате бинарных данных
      const excelData = XLSX.write(workbookResults, {
        bookType: "xlsx",
        type: "array",
      });

      // Создание объекта Blob для дальнейшего скачивания
      const blob = new Blob([excelData], { type: "application/octet-stream" });

      // Создание временной ссылки для скачивания файла
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;

      // Автоматически нажимаем на ссылку для скачивания
      document.body.appendChild(link);
      link.click();
      // Удаление ссылки после скачивания
      document.body.removeChild(link);

      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 3000);
      setFile(null);
      setMessageText("");
      setFileInputKey((prevKey) => prevKey + 1); // Сбрасываем поле файла
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);
      alert("Произошла ошибка при загрузке файла");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`flex flex-col w-full h-[100vh] ${
        theme === "dark" ? "bg-[#111827]" : "bg-[white]"
      }`}
    >
      <div className="flex w-full justify-center mt-[30px]">
        <h1 className={`text-xl  text-[white] `}>
          Сервис рассылки по WhatsApp <PhoneIcon sx={{ color: "#25D366" }} />
        </h1>
      </div>
      <div className="flex flex-col w-full h-[100vh] items-center justify-center">
        <div className="flex flex-col  max-w-[700px]">
          <div className="flex flex-col w-[200px]">
            <label
              htmlFor="upload-button"
              className={`flex mt-[20px] transition-all duration-500 gap-2 rounded-sm cursor-pointer  `}
            >
              <input
                key={fileInputKey}
                accept=".xlsx, .xls"
                style={{ display: "none" }}
                id="upload-button"
                type="file"
                onChange={handleFileChange}
              />
              <Button
                variant="contained"
                component="span"
                disabled={loading}
                sx={{
                  backgroundColor:
                    theme === "dark" ? "rgba(85,82,159,0.74)" : "#000000e8",
                  "&:hover": {
                    backgroundColor:
                      theme === "dark" ? "rgba(85,82,159,0.9)" : "#000000d0",
                  },
                }}
                startIcon={
                  loading ? (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: "white",
                        filter:
                          "drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))",
                      }}
                    />
                  ) : (
                    <>
                      {file ? (
                        <DescriptionIcon
                          sx={{
                            color: "white",
                            filter:
                              "drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))",
                          }}
                        />
                      ) : (
                        <FileUploadIcon
                          sx={{
                            color: "white",
                            filter:
                              "drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))",
                          }}
                        />
                      )}
                    </>
                  )
                }
              >
                <span className="flex text-white filter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                  {file
                    ? file.name.length > 14
                      ? `${file.name.substring(0, 11)}...`
                      : file.name
                    : "Загрузить Excel"}
                </span>
              </Button>
            </label>
            {errorExcel === "" ? (
              <p
                className={`flex mt-[5px] text-[10px] ${
                  theme === "dark" ? "text-[white]" : "text-[black]"
                }`}
              >
                {!file
                  ? "Excel файл должен иметь одну колонку Телефоны"
                  : "Файл прикреплен"}
              </p>
            ) : (
              <p className={`flex mt-[5px] text-[10px]  text-[red]`}>
                {errorExcel}
              </p>
            )}
          </div>

          <div className="w-[90%] mt-[40px]">
            <h2 className="text-[white] text-[sm]">Текст вашей рассылки</h2>
            <MarkdownEditor
              value={messageText}
              onChange={(text) => setMessageText(text || "")}
              height={200}
              preview="edit"
              className={` mt-[5px]
                ${
                  theme === "dark" ? "bg-[#333]" : "bg-[white]"
                } p-2 border border-gray-400 rounded`}
            />
          </div>

          {/* Сообщение об ошибке, если текст не введён */}
          {errorMessage && (
            <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>
          )}
          <Tooltip
            title={!file || !messageText.trim() ? "Нужно заполнить форму" : ""}
          >
            <div className="mt-[20px]">
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={!file || !messageText.trim() || loading}
                sx={{
                  backgroundColor:
                    !file || !messageText.trim() || loading
                      ? "rgba(105,105,105,0.7)"
                      : "rgba(85,82,159,0.74)",
                  // Цвет текста
                  color: "white",
                  // Прозрачность для disabled состояния
                  opacity: !file || !messageText.trim() || loading ? 0.7 : 1,
                  // Убираем эффект прозрачности для disabled кнопки
                  "&.Mui-disabled": {
                    backgroundColor: "rgba(105,105,105,0.7)", // сероватый цвет для заблокированной кнопки
                    color: "white", // Чтобы текст оставался читаемым
                  },
                  // Цвет при наведении
                  "&:hover": {
                    backgroundColor:
                      !file || !messageText.trim() || loading
                        ? "rgba(105,105,105,0.7)"
                        : "rgba(85,82,159,0.9)",
                  },
                }}
              >
                {loading ? "Отправка..." : "Отправить"}
              </Button>
            </div>
          </Tooltip>
        </div>
      </div>
      {open && (
        <BasicModal
          open={open}
          setOpen={setOpen}
          statusMessage={statusMessage}
        />
      )}
    </section>
  );
}


// "use client";
// import { Button, CircularProgress, Tooltip } from "@mui/material";
// import FileUploadIcon from "@mui/icons-material/FileUpload";
// import * as XLSX from "xlsx";
// import axios from "axios";
// import { useState } from "react";
// import { useTheme } from "../../provider/ThemeProvider";
// import PhoneIcon from "@mui/icons-material/Phone";
// import dynamic from "next/dynamic";
// import DescriptionIcon from "@mui/icons-material/Description";
// import { ResultsWazzupMesage } from "../../../../../@types/dto";
// import BasicModal from "./ModalResults";
// import ImageIcon from '@mui/icons-material/Image';

// // Динамический импорт редактора Markdown
// const MarkdownEditor = dynamic(() => import("@uiw/react-md-editor"), {
//   ssr: false,
// });

// export function WazzupMessages() {
//   const { theme } = useTheme();
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState<File | null>(null);
//   const [imageFile, setImageFile] = useState<File | null>(null); // Добавляем состояние для изображения
//   const [messageText, setMessageText] = useState<string>("");
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [fileInputKey, setFileInputKey] = useState(0); // Новый ключ для поля ввода файла
//   const [imageInputKey, setImageInputKey] = useState(0); // Новый ключ для поля ввода изображения
//   const [open, setOpen] = useState(false);
//   const [statusMessage, setStatusMessage] = useState<string>("");
//   const [errorExcel, setErrorExcel] = useState<string>("");

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const uploadedFile = e.target.files[0];
//       setErrorExcel(""); // Сбрасываем сообщение об ошибке перед проверкой

//       try {
//         // Чтение файла как бинарного массива
//         const data = await uploadedFile.arrayBuffer();
//         const workbook = XLSX.read(data);

//         // Получаем первый лист
//         const sheet = workbook.Sheets[workbook.SheetNames[0]];

//         // Преобразуем лист в массив (с первой строкой как заголовки)
//         const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//         // Получаем заголовки (первая строка файла)
//         const headers = jsonData[0];

//         // Проверяем, есть ли колонка "Телефоны"
//         //@ts-ignore
//         if (!headers || !headers.includes("Телефоны")) {
//           setErrorExcel(
//             "Неверный формат файла. Должна быть колонка 'Телефоны'"
//           );
//           setFile(null);
//           return;
//         }
//         setFile(uploadedFile);
//       } catch (error) {
//         // Обработка ошибок при чтении файла
//         setErrorExcel(`Ошибка ${error}`);
//         setFile(null);
//       }
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setErrorMessage("Пожалуйста, прикрепите файл с номерами телефонов.");
//       return;
//     }
//     if (!messageText.trim()) {
//       setErrorMessage("Рассылка не может быть пустой.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const data = await file.arrayBuffer();
//       const workbook = XLSX.read(data);
//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
//       const jsonData = XLSX.utils.sheet_to_json(sheet);

//       // Проверка, что файл имеет корректную структуру
//       const isValid = jsonData.every((row: any) => "Телефоны" in row);
//       if (!isValid) {
//         alert('Файл должен содержать колонку "Телефоны"');
//         setLoading(false);
//         return;
//       }

//       const formData = new FormData();
//       formData.append("data", JSON.stringify(jsonData)); // Преобразуем данные в строку JSON
//       formData.append("message", messageText); // Добавляем текст сообщения
  
//       // Если есть изображение, добавляем его в форму
//       if (imageFile) {
//         formData.append("image", imageFile); // Добавляем изображение
//       }
  
//       // Отправляем POST запрос с использованием FormData
//       const results = await axios.post("/api/sendmessage", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data", // Указываем заголовок для отправки файлов
//         },
//       });

//       setStatusMessage("success");

//       const worksheetData = results.data.messageResults.map(
//         (item: ResultsWazzupMesage) => ({
//           Телефоны: item.formattedNumber,
//           Статусы: item.status,
//         })
//       );

//       const worksheet = XLSX.utils.json_to_sheet(worksheetData);
//       const workbookResults = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbookResults, worksheet, "Результаты");

//       // Получение текущей даты для названия файла
//       const today = new Date();
//       const formattedDate = today.toISOString().slice(0, 10); // YYYY-MM-DD

//       const fileName = `Результаты_рассылки_${formattedDate}.xlsx`;

//       // Генерация Excel файла в формате бинарных данных
//       const excelData = XLSX.write(workbookResults, {
//         bookType: "xlsx",
//         type: "array",
//       });

//       // Создание объекта Blob для дальнейшего скачивания
//       const blob = new Blob([excelData], { type: "application/octet-stream" });

//       // Создание временной ссылки для скачивания файла
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = fileName;

//       // Автоматически нажимаем на ссылку для скачивания
//       document.body.appendChild(link);
//       link.click();
//       // Удаление ссылки после скачивания
//       document.body.removeChild(link);

//       setOpen(true);
//       setTimeout(() => {
//         setOpen(false);
//       }, 3000);
//       setFile(null);
//       setMessageText("");
//       setImageFile(null); // Сбрасываем выбранное изображение
//       setFileInputKey((prevKey) => prevKey + 1); // Сбрасываем поле файла
//       setImageInputKey((prevKey) => prevKey + 1); // Сбрасываем поле изображения
//     } catch (error) {
//       console.error("Ошибка при загрузке файла:", error);
//       alert("Произошла ошибка при загрузке файла");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setImageFile(e.target.files[0]); // Устанавливаем изображение в состояние
//     }
//   };

//   return (
//     <section
//       className={`flex flex-col w-full h-[100vh] ${
//         theme === "dark" ? "bg-[#111827]" : "bg-[white]"
//       }`}
//     >
//       <div className="flex w-full justify-center mt-[30px]">
//         <h1 className={`text-xl  text-[white] `}>
//           Сервис рассылки по WhatsApp <PhoneIcon sx={{ color: "#25D366" }} />
//         </h1>
//       </div>
//       <div className="flex flex-col w-full h-[100vh] items-center justify-center">
//         <div className="flex flex-col  max-w-[700px]">
//           <div className="flex flex-col w-[200px]">
//             <label
//               htmlFor="upload-button"
//               className={`flex mt-[20px] transition-all duration-500 gap-2 rounded-sm cursor-pointer  `}
//             >
//               <input
//                 key={fileInputKey}
//                 accept=".xlsx, .xls"
//                 style={{ display: "none" }}
//                 id="upload-button"
//                 type="file"
//                 onChange={handleFileChange}
//               />
//               <Button
//                 variant="contained"
//                 component="span"
//                 disabled={loading}
//                 sx={{
//                   backgroundColor:
//                     theme === "dark" ? "rgba(85,82,159,0.74)" : "#000000e8",
//                   "&:hover": {
//                     backgroundColor:
//                       theme === "dark" ? "rgba(85,82,159,0.9)" : "#000000d0",
//                   },
//                 }}
//                 startIcon={
//                   loading ? (
//                     <CircularProgress
//                       size={24}
//                       sx={{
//                         color: "white",
//                         filter:
//                           "drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))",
//                       }}
//                     />
//                   ) : (
//                     <>
//                       {file ? (
//                         <DescriptionIcon
//                           sx={{
//                             color: "white",
//                             filter:
//                               "drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))",
//                           }}
//                         />
//                       ) : (
//                         <FileUploadIcon
//                           sx={{
//                             color: "white",
//                             filter:
//                               "drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))",
//                           }}
//                         />
//                       )}
//                     </>
//                   )
//                 }
//               >
//                 <span className="flex text-white filter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
//                   {file
//                     ? file.name.length > 14
//                       ? `${file.name.substring(0, 11)}...`
//                       : file.name
//                     : "Загрузить Excel"}
//                 </span>
//               </Button>
//             </label>
//             {errorExcel === "" ? (
//               <p
//                 className={`flex mt-[5px] text-[10px] ${
//                   theme === "dark" ? "text-[white]" : "text-[black]"
//                 }`}
//               >
//                 {!file
//                   ? "Excel файл должен иметь одну колонку Телефоны"
//                   : "Файл прикреплен"}
//               </p>
//             ) : (
//               <p className={`flex mt-[5px] text-[10px]  text-[red]`}>
//                 {errorExcel}
//               </p>
//             )}
//           </div>

//           {/* Новый input для загрузки изображения */}
//           <div className="flex flex-col w-[200px] mt-4">
//             <label
//               htmlFor="upload-image"
//               className={`flex transition-all duration-500 gap-2 rounded-sm cursor-pointer  `}
//             >
//               <input
//                 key={imageInputKey}
//                 accept="image/*"
//                 style={{ display: "none" }}
//                 id="upload-image"
//                 type="file"
//                 onChange={handleImageChange}
//               />
//               <Button
//                 variant="contained"
//                 component="span"
//                 disabled={loading}
//                 sx={{
//                   backgroundColor:
//                     theme === "dark" ? "rgba(85,82,159,0.74)" : "#000000e8",
//                   "&:hover": {
//                     backgroundColor:
//                       theme === "dark" ? "rgba(85,82,159,0.9)" : "#000000d0",
//                   },
//                 }}
//                 startIcon={
//                   loading ? (
//                     <CircularProgress
//                       size={24}
//                       sx={{
//                         color: "white",
//                         filter:
//                           "drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))",
//                       }}
//                     />
//                   ) : (
//                     <ImageIcon
//                       sx={{
//                         color: "white",
//                         filter:
//                           "drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))",
//                       }}
//                     />
//                   )
//                 }
//               >
//                 <span className="flex text-white filter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
//                   {imageFile ? imageFile.name : "Загрузить изображение"}
//                 </span>
//               </Button>
//             </label>
//           </div>

//           <div className="w-[90%] mt-[40px]">
//             <h2 className="text-[white] text-[sm]">Текст вашей рассылки</h2>
//             <MarkdownEditor
//               value={messageText}
//               onChange={(text) => setMessageText(text || "")}
//               height={200}
//               preview="edit"
//               className={` mt-[5px]
//                 ${
//                   theme === "dark" ? "bg-[#333]" : "bg-[white]"
//                 } p-2 border border-gray-400 rounded`}
//             />
//           </div>

//           {/* Сообщение об ошибке, если текст не введён */}
//           {errorMessage && (
//             <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>
//           )}
//           <Tooltip
//             title={!file || !messageText.trim() ? "Нужно заполнить форму" : ""}
//           >
//             <div className="mt-[20px]">
//               <Button
//                 variant="contained"
//                 onClick={handleUpload}
//                 disabled={!file || !messageText.trim() || loading}
//                 sx={{
//                   backgroundColor:
//                     !file || !messageText.trim() || loading
//                       ? "rgba(105,105,105,0.7)"
//                       : "rgba(85,82,159,0.74)",
//                   // Цвет текста
//                   color: "white",
//                   // Прозрачность для disabled состояния
//                   opacity: !file || !messageText.trim() || loading ? 0.7 : 1,
//                   // Убираем эффект прозрачности для disabled кнопки
//                   "&.Mui-disabled": {
//                     backgroundColor: "rgba(105,105,105,0.7)", // сероватый цвет для заблокированной кнопки
//                     color: "white", // Чтобы текст оставался читаемым
//                   },
//                   // Цвет при наведении
//                   "&:hover": {
//                     backgroundColor:
//                       !file || !messageText.trim() || loading
//                         ? "rgba(105,105,105,0.7)"
//                         : "rgba(85,82,159,0.9)",
//                   },
//                 }}
//               >
//                 {loading ? "Отправка..." : "Отправить"}
//               </Button>
//             </div>
//           </Tooltip>
//         </div>
//       </div>
//       {open && (
//         <BasicModal
//           open={open}
//           setOpen={setOpen}
//           statusMessage={statusMessage}
//         />
//       )}
//     </section>
//   );
// }