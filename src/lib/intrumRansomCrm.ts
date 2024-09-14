import { Tilda } from "@prisma/client";
import axios from "axios";
import db from "../../prisma";

interface Manager {
    name: string;
    id: string;
}

const managers : Manager[]  = [
  { name: "Сторожук", id: "1385" },//+ ТОП 
  { name: "Максимова Людмила", id: "332" },//+ по 1
  { name: "Трофимов", id: "1140" },//+ТОП 
  { name: "Бородина", id: "353" }, //+ТОП 
  { name: "Костенко Любовь", id: "1793" },//+ по 1
  { name: "Мартынов", id: "214" },//+ по 1
  { name: "Трубачева", id: "1460" },//+ТОП 
  { name: "Меньшова", id: "230" },//+ по 1
];

const firstRoundManagers = ["1460", "1385", "1140", "353"];
const secondRoundManagers = ["1460", "1385", "1140", "353"];
const fourthRoundManagers = managers
  .filter(
    (manager) =>
      !firstRoundManagers.includes(manager.id) &&
      !secondRoundManagers.includes(manager.id)
  )
  .map((manager) => manager.id);

async function getPreviousManagerIds(
  index: number,
  totalManagers: number
): Promise<string[]> {
  if (index < totalManagers) {
    return [];
  }

  const previousQueueItems = await db.managerSansaraQueue.findMany({
    skip: index - totalManagers,
    take: totalManagers,
    orderBy: { createdAt: "desc" },
  });

  return previousQueueItems.map((item) => item.managerId);
}

async function getManagerWithLeastRequests(
  managerIds: string[]
): Promise<string> {
  if (managerIds.length === 0) {
    throw new Error("No manager IDs provided.");
  }

  const managerRequestCounts = await db.managerSansaraQueue.groupBy({
    by: ["managerId"],
    _count: {
      managerId: true,
    },
    where: {
      managerId: { in: managerIds },
    },
  });

  const managerCountMap: { [key: string]: number } = managerRequestCounts.reduce(
    (acc: { [key: string]: number }, { managerId, _count }) => {
      acc[managerId] = _count.managerId;
      return acc;
    },
    {}
  );

  return managerIds.sort(
    (a, b) => (managerCountMap[a] || 0) - (managerCountMap[b] || 0)
  )[0];
}


export async function managerFindRansom(): Promise<string> {
  try {
    const existingQueueCount = await db.managerSansaraQueue.count();
    const totalManagers = 3; // количество кругов
    const currentManagerIndex = existingQueueCount % totalManagers;
    let selectedManagerId;

    const previousManagerIds = await getPreviousManagerIds(
      existingQueueCount,
      totalManagers
    );

    if (currentManagerIndex === 0) {
      selectedManagerId = firstRoundManagers[0];
    } else if (currentManagerIndex === 1) {
      const availableManagers = secondRoundManagers.filter(
        (id) => !previousManagerIds.includes(id)
      );
      selectedManagerId = await getManagerWithLeastRequests(availableManagers);
    } else {
      const availableManagers = fourthRoundManagers.filter(
        (id) => !previousManagerIds.includes(id)
      );
      selectedManagerId = await getManagerWithLeastRequests(availableManagers);
    }

    return selectedManagerId;
  } catch (error) {
    console.error("Error in managerFindSansara:", error);
    throw new Error("Unable to find a suitable manager.");
  }
}














export async function sendIntrumCrmTildaRansom(message: Tilda, double: boolean) {
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

    params.append("params[customer][fields][1][id]", "3725"); // доп поле для контактов
    params.append("params[customer][fields][1][value]","Квартира");
  
    params.append("params[request][request_type]", "3"); // Id типа заявка (тут Прием объекта)
    params.append("params[request][status]", "unselected"); //статус сделки
  
    if (doubleMessage) {
      params.append(
        "params[request][request_name]",
        message.answers
          ? "ДУБЛЬ ПОВТРНОЕ ОБРАЩЕНИЕ по срочному выкупу!!!!! " + message.answers
          : "ПОВТОРНАЯ заявка по срочному выкупу (ДУБЛЬ)"
      ); //статус сделки
    } else {
      params.append(
        "params[request][request_name]",
        message.answers ? message.answers : "Заявка на срочный выкуп"
      ); //статус сделки
    }
  
    if (doubleMessage) {
      params.append("params[request][employee_id]", "1676");
    } else {
      params.append(
        "params[request][employee_id]",
        // message.managerId == "Ошибка в выборе менеджера"
        //   ? managerIdRandom
        //   : message.managerId
        //   ? message.managerId
        //   : managerIdRandom
        "1676"
      ); //id главного отв заявки
    }
    //колцентр 309 , 1584, 1693, 2220, 2146
    params.append("params[request][additional_employee_id][0]", "309"); //массив доп отв
    params.append("params[request][additional_employee_id][1]", "1584"); //массив доп отв
    params.append("params[request][additional_employee_id][2]", "1693"); //массив доп отв
    params.append("params[request][additional_employee_id][3]", "2220"); //массив доп отв
    params.append("params[request][additional_employee_id][4]", "2535"); //массив доп отв
    params.append("params[request][additional_employee_id][5]", "2536"); //массив доп отв
  
  
    params.append("params[request][fields][0][id]", "1277"); // доп поле 2 Источник
    params.append(
      "params[request][fields][0][value]",
      message.utm_campaign || message.utm_content || message.utm_term ? "лендинг" : "наш сайт"
    ); //доп поле 2
  
    params.append("params[request][fields][1][id]", "5150"); // доп поле 3
    params.append(
      "params[request][fields][1][value]",
      message.utm_campaign ? message.utm_campaign : ""
    ); //доп поле 3
  
    params.append("params[request][fields][2][id]", "5152"); // доп поле 4
    params.append(
      "params[request][fields][2][value]",
      message.utm_term ? message.utm_term : ""
    ); //доп поле 4
  
    params.append("params[request][fields][4][id]", "3233"); // доп поле 5
    params.append("params[request][fields][4][value]", formattedDate); //доп поле 5

    params.append("params[request][fields][5][id]", "1327"); // доп поле 6
    params.append("params[request][fields][5][value]", 'объект не готов к передаче'); //доп поле 6
  
    params.append("params[request][fields][6][id]", "1393"); // доп поле 6
    params.append("params[request][fields][6][value]", 'Квартира вторичка'); //доп поле 6
  
    params.append("params[request][fields][6][id]", "1366"); // доп поле 6
    params.append("params[request][fields][6][value]", 'Не выбран'); //доп поле 6
  
    params.append("params[request][fields][7][id]", "3667"); // доп поле 7
    params.append("params[request][fields][7][value]", '1'); //доп поле 7


  
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