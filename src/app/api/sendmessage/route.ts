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
