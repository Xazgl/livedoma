import { Wazzup } from "@prisma/client";
import axios from "axios";

export default async function sendIntrumCrmWazzupSansara(
  message: Wazzup,
  double: boolean
) {
  const doubleMessage = double;

  console.log(doubleMessage);

  // const manager = await managerFindSansara();

  // Создаем объект с параметрами
  const params = new URLSearchParams();

  params.append("apikey", "7917e0838a4d494b471ceb36d7e3a67b");
  params.append("params[customer][manager_id]", "0"); //ответственный id в контакте
  params.append("params[customer][name]", message.name ? message.name : ""); // Имя клиента в контакте
  params.append(`params[customer][phone][]`, message.phone); // Телефон в контакте
  params.append(`params[customer][marktype]`, "8"); // Тип контакта покупатель

  params.append("params[request][request_type]", "14"); // Id типа заявка (тут на показ)
  params.append("params[request][status]", "unselected"); //статус сделки
  params.append(
    "params[request][request_name]",
    doubleMessage
      ? "Повторное обращение(дубль) на консультацию с вотсап рассылки по Сансаре"
      : "Заявка на консультацию  с вотсап рассылки по Сансаре"
  ); //статус сделки

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
  params.append("params[request][fields][0][id]", "1091");
  params.append(
    "params[request][fields][0][value]",
    doubleMessage ? "Дубль" : "Заявка с рассылки WhatsApp"
  );

  params.append("params[request][fields][1][id]", "1211"); //  Источник
  params.append("params[request][fields][1][value]", "WhatsApp");

  params.append("params[request][fields][2][id]", "3724"); //   Тип недвижимости
  params.append("params[request][fields][2][value]", "Новостройка");

  params.append("params[request][fields][3][id]", "5420"); //  Дата следующего действия
  params.append("params[request][fields][3][value]", "ЖК «Сансара»");

  params.append("params[request][fields][4][id]", "5077"); //  Оспорить заявку
  params.append("params[request][fields][4][value]", "0");

  params.append("params[request][fields][5][id]", "5055"); //    Агент созвонился с покупателем? NEW
  params.append("params[request][fields][5][value]", "Нет");

  params.append("params[request][fields][6][id]", "5020"); //   Стадия работы с покупателем
  params.append("params[request][fields][6][value]", "Указать стадию");

  params.append("params[request][fields][7][id]", "1404"); //  Дата следующего действия
  params.append(
    "params[request][fields][7][value]",
    `${new Date().toISOString().split("T")[0]}`
  );

  params.append("params[request][fields][8][id]", "5269");
  params.append("params[request][fields][8][value]", "1");

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
