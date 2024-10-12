import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

type PhoneData = {
  Телефоны: number;
};

export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const formData: PhoneData[] = res.data; // Получаем массив телефонов
    const text: string = res.message;
    if (!formData || formData.length === 0) {
      return NextResponse.json(
        { error: "Массив данных пуст или не найден" },
        { status: 400 }
      );
    }

    // Bearer токен и данные API
    const apiUrl = "https://api.wazzup24.com/v3/message";
    const token = "3345494c82d54f7bb26ea5e32b38f6ef";
    const channelId = "cba806e2-4c66-4122-8cc4-6ff8b5fdf751";
    const chatType = "whatsapp";
    const messageText = text;

    // Отправляем сообщения по каждому номеру
    const results = await Promise.all(
      formData.map(async (item: PhoneData) => {
        const phoneNumber = item["Телефоны"].toString().replace(/[^\d]/g, ""); // Преобразуем номер в строку
        console.log(phoneNumber);
        let formattedNumber = phoneNumber;

        // Проверяем, начинается ли номер с '7' или '+7', и приводим к нужному формату
        if (phoneNumber.startsWith("8")) {
          // Если номер начинается с 8, заменяем её на 7
          formattedNumber = "7" + phoneNumber.slice(1);
        } else if (
          phoneNumber.startsWith("7") ||
          phoneNumber.startsWith("+7")
        ) {
          // Если номер начинается с +7, убираем плюс
          formattedNumber = phoneNumber.replace(/^\+/, "");
        } else {
          // Если номер не в формате, возвращаем ошибку или другое действие
          formattedNumber = "Некорректный номер";
          return { formattedNumber, status: "Некорректный номер" };
        }
        if (!formattedNumber || formattedNumber == "Некорректный номер") {
          return { formattedNumber, status: "skipped" };
        }

        const payload = {
          channelId: channelId,
          chatType: chatType,
          chatId: formattedNumber,
          text: messageText,
        };

        try {
          const response = await axios.post(apiUrl, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response)
          return { formattedNumber, status: (response.status == 201 || response.status == 200)? 'Успешно' :`Проверит статус ${response.status}`  };
        } catch (error) {
          console.error(`Ошибка при отправке на номер ${formattedNumber}:`, error);
          return { formattedNumber, status: "error", error: error };
        }
      })
    );

    return NextResponse.json({
      messageResults: results,
    });
  } catch (error) {
    console.error("Ошибка при обработке данных:", error);
    return NextResponse.json(
      {
        error: "Произошла ошибка при обработке данных.",
      },
      { status: 500 }
    );
  }
}



// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import path from "node:path";
// import { Worker} from "worker_threads";

// type PhoneData = {
//   Телефоны: number;
// };

// const createWorkerForImageDownload = (image: File) => {
//   console.log('createWorkerForImageDownload')
//   return new Promise((resolve, reject) => {
//     const worker = new Worker(
//       path.join(process.cwd(), "./worker/workerImg.js"),
//       { workerData: { image  } }
//     );

//     worker.on("message", resolve);
//     worker.on("error", reject);
//     worker.on("exit", (code) => {
//       if (code !== 0) {
//         reject(new Error(`Worker stopped with exit code ${code}`));
//       }
//     });
//   });
// };


// export async function POST(request: NextRequest) {
//   try {
//     // Получаем FormData из запроса
//     const formData = await request.formData();

//     // Извлекаем данные из FormData
//     const data = formData.get("data"); // Это будет строка JSON
//     const message = formData.get("message"); // Текст сообщения
//     const image = formData.get("image") as File; // Файл изображения, если он был загружен

//     // Парсим JSON строку с данными
//     let formDataParsed: PhoneData[] | null = null;
//     try {
//       formDataParsed = JSON.parse(data as string);
//     } catch (error) {
//       return NextResponse.json(
//         { error: "Ошибка парсинга данных" },
//         { status: 400 }
//       );
//     }

//     if (!formDataParsed || formDataParsed.length === 0) {
//       return NextResponse.json(
//         { error: "Массив данных пуст или не найден" },
//         { status: 400 }
//       );
//     }

//     // Если было загружено изображение, можно обработать его
//     let imageUrl = "";
//     if (image) {

//       // Создаем воркер для скачивания и сохранения изображения
//       const savedImage = await createWorkerForImageDownload(image);
//       // if (savedImage.error) {
//       //   console.error("Ошибка воркера при сохранении изображения:", savedImage.error);
//       //   return NextResponse.json({ error: "Ошибка при сохранении изображения" }, { status: 500 });
//       // }
//       // imageUrl = savedImage.full;
//       // imageUrl = savedImage.full; // Ссылка на сохраненное изображение
//       // console.log("Изображение загружено и сохранено по пути:", imageUrl);
//     } else {
//       console.log("Изображение не было загружено.");
//     }

//     // Bearer токен и данные API
//     const apiUrl = "https://api.wazzup24.com/v3/message";
//     const token = "3345494c82d54f7bb26ea5e32b38f6ef";
//     const channelId = "cba806e2-4c66-4122-8cc4-6ff8b5fdf751";
//     const chatType = "whatsapp";
//     const messageText = message as string; // Преобразуем сообщение в строку

//     // Отправляем сообщения по каждому номеру
//     const results = await Promise.all(
//       formDataParsed.map(async (item: PhoneData) => {
//         const phoneNumber = item["Телефоны"].toString().replace(/[^\d]/g, ""); // Преобразуем номер в строку
//         console.log(phoneNumber);
//         let formattedNumber = phoneNumber;

//         // Проверяем, начинается ли номер с '7' или '+7', и приводим к нужному формату
//         if (phoneNumber.startsWith("8")) {
//           formattedNumber = "7" + phoneNumber.slice(1);
//         } else if (
//           phoneNumber.startsWith("7") ||
//           phoneNumber.startsWith("+7")
//         ) {
//           formattedNumber = phoneNumber.replace(/^\+/, "");
//         } else {
//           formattedNumber = "Некорректный номер";
//           return { formattedNumber, status: "Некорректный номер" };
//         }

//         if (!formattedNumber || formattedNumber == "Некорректный номер") {
//           return { formattedNumber, status: "skipped" };
//         }

//         const payload = {
//           channelId: channelId,
//           chatType: chatType,
//           chatId: formattedNumber,
//           text: messageText,
//         };

//         // Если есть изображение, отправляем его
//         const payloadImage = imageUrl
//           ? {
//               channelId: channelId,
//               chatType: chatType,
//               chatId: formattedNumber,
//               contentUri: imageUrl, // Ссылка на сохраненное изображение
//             }
//           : null;

//         try {
//           try {
//             if (imageUrl && image) {
//               const responseImage = await axios.post(apiUrl, payloadImage, {
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                 },
//               });
//               // console.log(responseImage.data);
//             }
//           } catch (error) {
//             console.error("Ошибка при отправке изображения:", error);
//           }
//           // const response = await axios.post(apiUrl, payload, {
//           //   headers: {
//           //     Authorization: `Bearer ${token}`,
//           //   },
//           // });
//           // console.log(response.data);
//           // return {
//           //   formattedNumber,
//           //   status:
//           //     response.status == 201 || response.status == 200
//           //       ? "Успешно"
//           //       : `Проверит статус ${response.status}`,
//           // };
//         } catch (error) {
//           // console.error(
//           //   `Ошибка при отправке на номер ${formattedNumber}:`,
//           //   error
//           // );
//           return { formattedNumber, status: "error", error: error };
//         }
//       })
//     );

//     return NextResponse.json({
//       messageResults: results,
//     });
//   } catch (error) {
//     console.error("Ошибка при обработке данных:", error);
//     return NextResponse.json(
//       {
//         error: "Произошла ошибка при обработке данных.",
//       },
//       { status: 500 }
//     );
//   }
// }
