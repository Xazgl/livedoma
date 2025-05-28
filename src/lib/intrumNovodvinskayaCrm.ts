import { Tilda } from "@prisma/client";
import db from "../../prisma";
import axios from "axios";

interface Manager {
  name: string;
  id: string;
}

const managers: Manager[] = [
  { name: "Сторожук", id: "1385" },
  { name: "Трофимов", id: "1140" },
  { name: "Василевская-Руцкая", id: "2019" },
  { name: "Бородина", id: "353" },
  { name: "Москвина*", id: "2466" },
];

const Round1Managers = ["2466"]; // две заявки
const Round2Managers = ["353"]; //две заявки
const Round3Managers = ["1385"]; //две заявки
const Round4Managers = ["1140"]; //две заявки
const Round5Managers = ["2019"]; //одна заявка

export async function managerFindNovodvinskaya(): Promise<string> {
  try {
    const existingQueueCount = await db.managerNovodvinskayaQueue.count();

    // Определяем раунды распределения заявок
    const rounds = [
      { managerIds: Round1Managers, count: 2 },
      { managerIds: Round2Managers, count: 2 },
      { managerIds: Round3Managers, count: 2 },
      { managerIds: Round4Managers, count: 2 },
      { managerIds: Round5Managers, count: 1 },
    ];

    // Собираем все актуальные ID менеджеров из раундов в Set для быстрой проверки
    const currentManagerIds = new Set(
      rounds.flatMap((round) => round.managerIds)
    );

    // Получаем последнюю заявку из очереди
    const lastEntry = await db.managerNovodvinskayaQueue.findFirst({
      orderBy: { createdAt: "desc" },
      select: { managerId: true },
    });

    // Если последняя заявка есть, но её менеджер не входит в текущие раунды,
    // сбрасываем цикл и начинаем с первого раунда.
    if (lastEntry && !currentManagerIds.has(lastEntry.managerId)) {
      // Например, можно логировать сброс и возвращать первого менеджера первого раунда
      console.info(
        "Сброс цикла распределения, так как последний менеджер отсутствует в текущих раундах"
      );
      return Round1Managers[0];
    }

    // Вычисляем общее количество заявок в одном цикле
    const cycleTotal = rounds.reduce((sum, round) => sum + round.count, 0);

    // Вычисляем позицию текущей заявки в цикле
    let posInCycle = existingQueueCount % cycleTotal;

    // Определяем нужный раунд, в котором должна попасть текущая заявка
    let selectedRound = null;
    for (const round of rounds) {
      if (posInCycle < round.count) {
        selectedRound = round;
        break;
      }
      posInCycle -= round.count;
    }

    if (selectedRound) {
      // Если в раунде несколько менеджеров, выбираем их циклично по количеству заявок,
      // а если один – просто возвращаем его
      const managerIndex = existingQueueCount % selectedRound.managerIds.length;
      return selectedRound.managerIds[managerIndex];
    } else {
      throw new Error("Невозможно найти подходящего менеджера");
    }
  } catch (error) {
    console.error("Ошибка в managerFindNovodvinskaya:", error);
    throw new Error("Невозможно найти подходящего менеджера");
  }
}

//старый вариант который работал
// export async function managerFindNovodvinskaya(): Promise<string> {
//   try {
//     const existingQueueCount = await db.managerNovodvinskayaQueue.count();

//     // Если в базе меньше 2 заявок, выбираем случайного менеджера
//     if (existingQueueCount < 2) {
//       const randomManager =
//         managers[Math.floor(Math.random() * managers.length)];
//       return randomManager.id;
//     }

//     // Получаем последние две заявки
//     const lastTwoManagers = await db.managerNovodvinskayaQueue.findMany({
//       take: 2,
//       orderBy: { createdAt: "desc" },
//       select: { managerId: true },
//     });

//     const lastManagerIds = lastTwoManagers.map((entry) => entry.managerId);

//     // Фильтруем менеджеров, исключая тех, кто был в последних двух заявках
//     const availableManagers = managers.filter(
//       (manager) => !lastManagerIds.includes(manager.id)
//     );

//     if (availableManagers.length === 0) {
//       // Если все менеджеры были в последних двух заявках, выбираем по кругу
//       return managers[existingQueueCount % managers.length].id;
//     }

//     // Выбираем менеджера циклично из доступных
//     const currentManagerIndex = existingQueueCount % availableManagers.length;
//     return availableManagers[currentManagerIndex].id;
//   } catch (error) {
//     console.error("Error in managerFindNovodvinskaya:", error);
//     throw new Error("Unable to find a suitable manager.");
//   }
// }

export async function sendIntrumCrmTildaNovodvinskaya(
  message: Tilda,
  double: boolean
) {
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
  params.append(`params[customer][phone][]`, message.phone); // Телефон в контакте
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
        ? "ДУБЛЬ ПОВТОРНОЕ ОБРАЩЕНИЕ Новодвинская!!!!! " + message.answers
        : "ПОВТОРНАЯ заявка (ДУБЛЬ) Новодвинская"
    ); //статус сделки
  } else {
    params.append(
      "params[request][request_name]",
      message.answers ? message.answers : "Заявка по Новодвинской"
    ); //статус сделки
  }

  if (doubleMessage) {
    params.append("params[request][employee_id]", "1693");
  } else {
    params.append(
      "params[request][employee_id]",""
    );
   //отключил временно авто очередь
    // params.append(
    //   "params[request][employee_id]",
    //   message.managerId == "Ошибка в выборе менеджера"
    //     ? managerIdRandom
    //     : message.managerId
    //     ? message.managerId
    //     : managerIdRandom
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
    doubleMessage ? "Дубль" : "Заявка с сайта"
  );

  params.append("params[request][fields][1][id]", "1211"); // доп поле 2 Источник
  params.append(
    "params[request][fields][1][value]",
    message.utm_source == "vk" || message.utm_source == "TG"
      ? "Сайт «Дом на Новодвинской»"
      : message.utm_campaign ||
        message.utm_content ||
        message.utm_term ||
        message.utm_source
      ? "Лендинг дом на Новодвинской"
      : "Сайт «Дом на Новодвинской»"
  );

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
  params.append("params[request][fields][5][value]", "0");

  params.append("params[request][fields][5][id]", "5316"); // доп поле  6  ЖК Новодвинская?
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
  params.append( "params[request][fields][14][value]","ЖК «Дом на Новодвинской»"); 

  console.log("Все параметры для Новодвиской перед отправкой црм", params);
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
