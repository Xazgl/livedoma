import { Tilda } from "@prisma/client";
import axios from "axios";
import { getSourceForJDDByUtm } from "@/shared/jdd/utils";

export async function sendIntrumCrmProduction(
  message: Tilda,
  double: boolean,
  formName?: string
) {
  const doubleMessage = double;
  const answerFor5291 = "Производство"; // Выбор типа услуги
  const title = "Заявка на производство"; // Выбор типа услуги

  console.log("answerFor5291", answerFor5291);
  console.log("formName", formName);
  console.log("message?.formid", message?.formid);


  const messageCreatedAt = new Date(message.createdAt); // Получаем дату создания сообщения
  const nextDay = new Date(messageCreatedAt.getTime() + 24 * 60 * 60 * 1000); // Добавляем один день
  const formattedDate = nextDay.toISOString().split("T")[0]; // Преобразуем в формат Y-m-d

  // Создаем объект с параметрами
  const params = new URLSearchParams();
  const source = getSourceForJDDByUtm(
    message.utm_campaign,
    message.utm_source,
    message.utm_content,
    message.utm_term
  );

  params.append("apikey", "7917e0838a4d494b471ceb36d7e3a67b");
  params.append("params[customer][manager_id]", "0"); //ответственный id в контакте
  params.append("params[customer][name]", message.name ? message.name : ""); // Имя клиента в контакте
  params.append(`params[customer][phone][]`, message.phone); // Телефон в контакте
  params.append(`params[customer][marktype]`, "8"); // Тип контакта покупатель

  params.append("params[customer][fields][0][id]", "5078"); // доп поле для контактов
  params.append(
    "params[customer][fields][0][value]",
    message.timeForClientCall ? message.timeForClientCall : ""
  );

  params.append("params[request][request_type]", "23"); // Id типа заявка (тут строительство)
  params.append("params[request][status]", "unselected"); //статус сделки

  if (doubleMessage) {
    params.append(
      "params[request][request_name]",
      message.answers
        ? "ДУБЛЬ ПОВТОРНОЕ ОБРАЩЕНИЕ!!!!! " + message.answers
        : "ПОВТОРНАЯ заявка производство (ДУБЛЬ)"
    ); //статус сделки
  } else {
    params.append(
      "params[request][request_name]",
      message.answers ? message.answers : title
    ); //статус сделки
  }

  if (doubleMessage) {
    params.append("params[request][employee_id]", "1693");
  } else {
    params.append("params[request][employee_id]", message?.managerId  ?? '391');
  }

  //колцентр 309 , 1584, 1693, 2588, 2146
  params.append("params[request][additional_employee_id][0]", "309"); //массив доп отв
  params.append("params[request][additional_employee_id][1]", "1584"); //массив доп отв
  params.append("params[request][additional_employee_id][2]", "1693"); //массив доп отв
  params.append("params[request][additional_employee_id][3]", "2588"); //массив доп отв
  params.append("params[request][additional_employee_id][4]", "2535"); //массив доп отв
  params.append("params[request][additional_employee_id][5]", "2536"); //массив доп отв
  if (source === "Авито таргет") {
    params.append("params[request][additional_employee_id][6]", "2753"); //массив доп отв
  }

  //доп поля заявки
  params.append("params[request][fields][0][id]", "4059"); // доп поле 1
  params.append(
    "params[request][fields][0][value]",
    doubleMessage ? "Дубль" : "Заявка"
  ); //доп поле 1

  params.append("params[request][fields][1][id]", "4056"); // доп поле 2
  params.append("params[request][fields][1][value]", source); //доп поле 2

  params.append("params[request][fields][2][id]", "5001"); // доп поле 3
  params.append(
    "params[request][fields][2][value]",
    message.utm_campaign ? message.utm_campaign : ""
  ); //доп поле 3

  params.append("params[request][fields][3][id]", "5000"); // доп поле 4
  params.append(
    "params[request][fields][3][value]",
    message.utm_term ? message.utm_term : ""
  ); //доп поле 4

  params.append("params[request][fields][8][id]", "5184"); // доп поле 8
  params.append(
    "params[request][fields][8][value]",
    message.utm_source ? message.utm_source : ""
  );

  params.append("params[request][fields][4][id]", "4992"); // доп поле 5
  params.append("params[request][fields][4][value]", "Заявка не проверена"); //доп поле 5

  params.append("params[request][fields][5][id]", "5079"); // доп поле 6
  params.append("params[request][fields][5][value]", "Не заполнено"); //доп поле 6

  params.append("params[request][fields][6][id]", "4057"); // доп поле 7
  params.append("params[request][fields][6][value]", formattedDate); //доп поле 7

  params.append("params[request][fields][7][id]", "4058"); // доп поле 8
  params.append("params[request][fields][7][value]", "Указать стадию"); //доп поле 8

  params.append("params[request][fields][9][id]", "5268"); // доп поле 8
  params.append("params[request][fields][9][value]", "1"); //доп поле 8

  params.append("params[request][fields][11][id]", "5291");
  params.append("params[request][fields][11][value]", answerFor5291);

  try {
    const postResponse = await axios.post(
      "http://jivemdoma.intrumnet.com:81/sharedapi/applications/addCustomer",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return postResponse.data;
  } catch (error) {
    console.error(error);
    return new Response(`Запрос в Intrum не выполнен ошибка ${error}`, {
      status: 404,
    });
  }
}
