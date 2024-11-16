import { Wazzup } from "@prisma/client";
import axios from "axios";

export default async function sendIntrumCrmWazzupJD(
  message: Wazzup,
  double: boolean
) {
  const doubleMessage = double;

  console.log(doubleMessage);

  const managers = [
    { name: "Политов", id: "391" },
    { name: "Максимова Людмила", id: "332" },
    { name: "Трофимов", id: "1140" },
    { name: "Петрухин*", id: "2417" },
    { name: "Ломакин*", id: "2447" },
    // { name: "Максимова Юлия", id: "2109" },
    // { name: "Исаева", id: "39" },
    // { name: "Трубачева", id: "1460" },
    { name: "Бородина", id: "353" },
    { name: "Выходцева", id: "1944" },
  ];

  // Случайный выбор менеджера
  const randomManager = managers[Math.floor(Math.random() * managers.length)];
  // Получение id выбранного менеджера
  const managerIdRandom = randomManager.id;

  const messageCreatedAt = new Date(message.createdAt); // Получаем дату создания сообщения
  const nextDay = new Date(messageCreatedAt.getTime() + 24 * 60 * 60 * 1000); // Добавляем один день
  const formattedDate = nextDay.toISOString().split("T")[0]; // Преобразуем в формат Y-m-d

  // Создаем объект с параметрами
  const params = new URLSearchParams();

  params.append("apikey", "7917e0838a4d494b471ceb36d7e3a67b");
  params.append("params[customer][manager_id]", "0"); //ответственный id в контакте
  params.append("params[customer][name]", message.name ? message.name : ""); // Имя клиента в контакте
  params.append(`params[customer][phone][]`, message.phone); // Телефон в контакте
  params.append(`params[customer][marktype]`, "8"); // Тип контакта покупатель

  params.append("params[request][request_type]", "7"); // Id типа заявка (тут строительство)
  params.append("params[request][status]", "unselected"); //статус сделки
  params.append(
    "params[request][request_name]",
    doubleMessage
      ? "Повторное обращение(дубль) на консультацию с вотсапа основного сайта Живем Дома"
      : "Заявка на консультацию с вотсапа основного сайта Живем Дома"
  ); //статус сделки
  if (doubleMessage) {
    params.append("params[request][employee_id]", "1693");
  } else {
    params.append(
      "params[request][employee_id]",
      "1676"
      // message.managerId == "Ошибка в выборе менеджера"
      //   ? managerIdRandom
      //   : message.managerId
      //   ? message.managerId
      //   : managerIdRandom
    ); //id главного отв заявки
  }
  //колцентр 309 , 1584, 1693, 2220, 2146
  params.append("params[request][additional_employee_id][0]", "309"); //массив доп отв
  params.append("params[request][additional_employee_id][1]", "1584"); //массив доп отв
  params.append("params[request][additional_employee_id][2]", "1693"); //массив доп отв
  params.append("params[request][additional_employee_id][3]", "2220"); //массив доп отв
  params.append("params[request][additional_employee_id][4]", "2535"); //массив доп отв
  params.append("params[request][additional_employee_id][5]", "2536"); //массив доп отв

  //доп поля заявки
  params.append("params[request][fields][0][id]", "5217"); // доп поле 1
  params.append(
    "params[request][fields][0][value]",
    doubleMessage ? "Дубль" : "WhatsApp"
  ); //доп поле 1
  params.append("params[request][fields][1][id]", "1765"); // доп поле 2
  params.append("params[request][fields][1][value]", "Наш сайт"); //доп поле 2

  params.append("params[request][fields][2][id]", "1766"); // доп поле 3
  params.append("params[request][fields][2][value]", formattedDate); //доп поле 3

  params.append("params[request][fields][3][id]", "5218"); // доп поле 4
  params.append("params[request][fields][3][value]", "Указать стадию"); //доп поле 4

  params.append("params[request][fields][4][id]", "5221"); // доп поле 5
  params.append("params[request][fields][4][value]", "1"); //доп поле 5

  // params.append("params[request][fields][4][id]", "5079"); // доп поле 5
  // params.append("params[request][fields][4][value]", "Не заполнено"); //доп поле 5

  // params.append("params[request][fields][4][id]", "4992"); // доп поле 5
  // params.append("params[request][fields][4][value]", "Заявка не проверена"); //доп поле 5

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
