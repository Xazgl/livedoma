import { VkApplication } from "@prisma/client";
import axios from "axios";
import db from "../../prisma";
import { VKLeadFormEvent } from "../../@types/dto";

export function formatVkQuestionsAndAnswers(answer: VKLeadFormEvent) {
  let resultString = "";
  if (answer.object?.answers.length > 0) {
    answer.object.answers.forEach((answer) => {
      // Добавление вопроса и ответа к результату
      resultString += `${answer.question} '${answer.answer}'`;
      // Добавление пробела после каждой связки вопроса и ответа
      resultString += ", ";
    });
    // Удаление лишнего пробела в конце строки
    resultString = resultString.trim();
    return resultString;
  }
}

export async function sendIntrumCrVkJdd(
  message: VkApplication,
  double: boolean,
  formName?: string
) {
  const doubleMessage = double;

  const managers = await db.activeManagers.findMany({
    where: {
      company_JDD_active: true,
    },
    select: {
      name: true,
      manager_id: true,
    },
  });
  let answerFor5291 = "Строительство"; // Выбор типа услуги
  let title = formName;

  // Случайный выбор менеджера
  const randomManager = managers[Math.floor(Math.random() * managers.length)];
  // Получение id выбранного менеджера
  const managerIdRandom = randomManager.manager_id;

  const messageCreatedAt = new Date(message.createdAt); // Получаем дату создания сообщения
  const nextDay = new Date(messageCreatedAt.getTime() + 24 * 60 * 60 * 1000); // Добавляем один день
  const formattedDate = nextDay.toISOString().split("T")[0]; // Преобразуем в формат Y-m-d

  // Создаем объект с параметрами
  const params = new URLSearchParams();

  params.append("apikey", "7917e0838a4d494b471ceb36d7e3a67b");
  params.append("params[customer][manager_id]", "0"); //ответственный id в контакте
  params.append("params[customer][name]", message.name ? message.name : ""); // Имя клиента в контакте
  params.append(`params[customer][phone][]`, ""); // Телефон в контакте
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
        ? "ДУБЛЬ ПОВТРНОЕ ОБРАЩЕНИЕ!!!!! " + message.answers
        : "ПОВТОРНАЯ заявка на строительство c VK (ДУБЛЬ)"
    ); //статус сделки
  } else {
    params.append(
      "params[request][request_name]",
      message.answers || title || "Заявка на строительство c VK"
    ); //статус сделки
  }

  if (doubleMessage) {
    params.append("params[request][employee_id]", "1693");
  } else {
    // params.append(
    //   "params[request][employee_id]",
    //   message.managerId == "Ошибка в выборе менеджера"
    //     ? managerIdRandom
    //     : message.managerId
    //     ? message.managerId
    //     : managerIdRandom
    // );
    params.append("params[request][employee_id]", "44"); //id главного отв заявки
  }
  //колцентр 309 , 1584, 1693, 2588, 2146 
  params.append("params[request][additional_employee_id][0]", "309"); //массив доп отв
  params.append("params[request][additional_employee_id][1]", "1584"); //массив доп отв
  params.append("params[request][additional_employee_id][2]", "1693"); //массив доп отв
  params.append("params[request][additional_employee_id][3]", "2588"); //массив доп отв
  // params.append("params[request][additional_employee_id][4]", "2146"); //массив доп отв

  params.append("params[request][additional_employee_id][4]", "2753");

  //доп поля заявки
  params.append("params[request][fields][0][id]", "4059"); // доп поле 1
  params.append(
    "params[request][fields][0][value]",
    doubleMessage ? "Дубль" : "Заявка с VK"
  ); //доп поле 1

  params.append("params[request][fields][1][id]", "4056"); // доп поле 2
  params.append("params[request][fields][1][value]", "Вконтакте"); //доп поле 2

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

export async function sendIntrumCrmVKSansara(
  message: VkApplication,
  double: boolean,
  formName?: string
) {
  const managers = [
    { name: "Сторожук", id: "1385" },
    // { name: "Максимова Людмила", id: "332" },
    { name: "Бочарникова", id: "1767" },
    // { name: "Трофимов", id: "1140" },
    { name: "Бородина", id: "353" },
    { name: "Выходцева", id: "1944" },
    { name: "Грубляк*", id: "1829" },
    { name: "Костенко Любовь", id: "1793" },
    { name: "Мартынов", id: "214" },
    { name: "Найданова", id: "190" },
    { name: "Петрова Анна", id: "215" },
    { name: "Попова", id: "1618" },
    { name: "Рубан", id: "1857" },
    { name: "Ткачева", id: "35" },
    { name: "Чеботарева", id: "1232" },
    { name: "Канакова", id: "2803" },
    { name: "Меньшова", id: "230" },
  ];

  const doubleMessage = double;
  // Случайный выбор менеджера
  const randomManager = managers[Math.floor(Math.random() * managers.length)];
  // Получение id выбранного менеджера
  const managerIdRandom = randomManager.id;
  const messageCreatedAt = new Date(message.createdAt); // Получаем дату создания сообщения
  const nextDay = new Date(messageCreatedAt.getTime() + 24 * 60 * 60 * 1000); // Добавляем один день
  const formattedDate = nextDay.toISOString().split("T")[0]; // Преобразуем в формат Y-m-d

  // Создаем объект с параметрами
  const params = new URLSearchParams();
  params.append("apikey", "9a75fc323d968db797ec0ab848572aad");
  params.append("params[customer][manager_id]", "0"); //ответственный id в контакте
  params.append("params[customer][name]", message.name ? message.name : ""); // Имя клиента в контакте
  params.append(`params[customer][phone][]`, ""); // Телефон в контакте
  params.append(`params[customer][marktype]`, "8"); // Тип контакта покупатель

  params.append("params[customer][fields][0][id]", "5078"); // доп поле для контактов
  params.append(
    "params[customer][fields][0][value]",
    message.timeForClientCall ? message.timeForClientCall : ""
  );

  params.append("params[request][request_type]", "14"); // Id типа заявка (показ объекта)
  params.append("params[request][status]", "unselected"); //статус сделки

  if (doubleMessage) {
    params.append(
      "params[request][request_name]",
      message.answers
        ? "ДУБЛЬ ПОВТОРНОЕ ОБРАЩЕНИЕ Сансара c VK!!!!! " + message.answers
        : "ПОВТОРНАЯ заявка (ДУБЛЬ) Сансара c VK"
    ); //статус сделки
  } else {
    params.append(
      "params[request][request_name]",
      message.answers || formName || "Заявка по Сансаре c VK"
    ); //статус сделки
  }

  if (doubleMessage) {
    params.append("params[request][employee_id]", "1693");
  } else {
    params.append("params[request][employee_id]", "");
    // params.append(
    //   "params[request][employee_id]",
    //   message.managerId == "Ошибка в выборе менеджера"? managerIdRandom : message.managerId ? message.managerId : managerIdRandom
    // ); //id главного отв заявки
  }
  //колцентр 309 , 1584, 1693, 2588, 2146
  params.append("params[request][additional_employee_id][0]", "309"); //массив доп отв
  params.append("params[request][additional_employee_id][1]", "1584"); //массив доп отв
  params.append("params[request][additional_employee_id][2]", "1693"); //массив доп отв
  params.append("params[request][additional_employee_id][3]", "2588"); //массив доп отв
  params.append("params[request][additional_employee_id][4]", "2535"); //массив доп отв
  params.append("params[request][additional_employee_id][5]", "2536"); //массив доп отв

  //доп поля заявки
  params.append("params[request][fields][0][id]", "1091"); // доп поле 1
  params.append(
    "params[request][fields][0][value]",
    doubleMessage ? "Дубль" : "Заявка с VK"
  );

  params.append("params[request][fields][1][id]", "1211"); // доп поле 2 Источник
  params.append("params[request][fields][1][value]", "Вконтакте Сансара");

  params.append("params[request][fields][2][id]", "5147"); // доп поле 3 campaign
  params.append(
    "params[request][fields][2][value]",
    message.utm_campaign ? message.utm_campaign : ""
  );

  params.append("params[request][fields][3][id]", "5148"); // доп поле 4  term
  params.append(
    "params[request][fields][3][value]",
    message.utm_term ? message.utm_term : ""
  );

  params.append("params[request][fields][11][id]", "5185"); // доп поле 11  source
  params.append(
    "params[request][fields][11][value]",
    message.utm_source ? message.utm_source : ""
  );

  params.append("params[request][fields][4][id]", "3724"); // доп поле  5  Тип недвижимости
  params.append("params[request][fields][4][value]", "Новостройка");

  params.append("params[request][fields][5][id]", "5060"); // доп поле  6  ЖК сансара?
  params.append("params[request][fields][5][value]", "1");

  params.append("params[request][fields][6][id]", "5077"); // доп поле  7  Оспорить заявку
  params.append("params[request][fields][6][value]", "0");

  params.append("params[request][fields][7][id]", "5055"); // доп поле  8   Агент созвонился с покупателем? NEW
  params.append("params[request][fields][7][value]", "Нет");

  params.append("params[request][fields][8][id]", "5020"); // доп поле  9   Стадия работы с покупателем
  params.append("params[request][fields][8][value]", "Указать стадию");

  params.append("params[request][fields][9][id]", "5169"); // доп поле 10  prodinfo
  params.append(
    "params[request][fields][9][value]",
    message.prodinfo ? message.prodinfo : ""
  );

  params.append("params[request][fields][10][id]", "1404"); // доп поле 11 Дата следующего действия
  params.append(
    "params[request][fields][10][value]",
    `${new Date().toISOString().split("T")[0]}`
  );

  params.append("params[request][fields][13][id]", "5269"); // доп поле 12 Дата следующего действия
  params.append("params[request][fields][13][value]", "1");

  params.append("params[request][fields][14][id]", "5420"); // доп поле 13 Дата следующего действия
  params.append("params[request][fields][14][value]", "ЖК «Сансара»");

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
