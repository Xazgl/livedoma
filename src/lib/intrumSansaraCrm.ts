import { Tilda } from "@prisma/client";
import db from "../../prisma";
import axios from "axios";

interface Manager {
    name: string;
    id: string;
}

const managers : Manager[]  = [
  { name: "Сторожук", id: "1385" },
  { name: "Максимова Людмила", id: "332" },
  { name: "Бочарникова", id: "1767" },
  { name: "Трофимов", id: "1140" },
  { name: "Бородина", id: "353" },
  { name: "Выходцева", id: "1944" },
  { name: "Грубляк*", id: "1829" },
  { name: "Ефремов Саша", id: "1827" },
  { name: "Костенко Любовь", id: "1793" },
  { name: "Мартынов", id: "214" },
  { name: "Найданова", id: "190" },
  { name: "Петрова Анна", id: "215" },
  { name: "Попова", id: "1618" },
  { name: "Рубан", id: "1857" },
  { name: "Ткачева", id: "35" },
  { name: "Чеботарева", id: "1232" },
  { name: "Меньшова", id: "230" },
];

const firstRoundManagers = ["190"];
const secondRoundManagers = ["190", "1385", "1140", "353"];
const fourthRoundManagers = managers.filter(
  (manager) => !firstRoundManagers.includes(manager.id) &&
               !secondRoundManagers.includes(manager.id) 
).map((manager) => manager.id);

async function getPreviousManagerId(index: number): Promise<string | null> {
  if (index < 2) {
    return null;
  }
  
  const previousQueueItem = await db.managerSansaraQueue.findFirst({
    skip: index - 2,
    take: 1,
    orderBy: { createdAt: 'desc' },
  });

  return previousQueueItem ? previousQueueItem.managerId : null;
}

async function getManagerWithLeastRequests(managerIds: string[]): Promise<string> {
  if (managerIds.length === 0) {
    throw new Error("No manager IDs provided.");
  }

  const managerRequestCounts = await db.managerSansaraQueue.groupBy({
    by: ['managerId'],
    _count: {
      managerId: true,
    },
    where: {
      managerId: { in: managerIds },
    },
  });

  const managerCountMap: { [key: string]: number } = managerRequestCounts.reduce((acc: { [key: string]: number }, { managerId, _count }) => {
    acc[managerId] = _count.managerId;
    return acc;
  }, {});

  return managerIds.sort((a, b) => (managerCountMap[a] || 0) - (managerCountMap[b] || 0))[0];
}

export async function managerFindSansara(): Promise<string> {
  try {
    const existingQueueCount = await db.managerSansaraQueue.count();
    const totalManagers = 3; // количество кругов
    const currentManagerIndex = existingQueueCount % totalManagers;
    let selectedManagerId;

    if (currentManagerIndex === 0) {
      selectedManagerId = firstRoundManagers[0];
    } else if (currentManagerIndex === 1) {
      const previousManagerId = await getPreviousManagerId(existingQueueCount);
      if (previousManagerId) {
        const availableManagers = secondRoundManagers.filter(id => id !== previousManagerId);
        selectedManagerId = await getManagerWithLeastRequests(availableManagers);
      } else {
        selectedManagerId = await getManagerWithLeastRequests(secondRoundManagers);
      }
    } else {
      const previousManagerId = await getPreviousManagerId(existingQueueCount);
      if (previousManagerId) {
        const availableManagers = fourthRoundManagers.filter(id => id !== previousManagerId);
        selectedManagerId = await getManagerWithLeastRequests(availableManagers);
      } else {
        selectedManagerId = await getManagerWithLeastRequests(fourthRoundManagers);
      }
    }

    return selectedManagerId;
  } catch (error) {
    console.error("Error in managerFindSansara:", error);
    throw new Error("Unable to find a suitable manager.");
  } 
}


export async function sendIntrumCrmTildaSansara( message: Tilda,double: boolean ) {
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
        ? "ДУБЛЬ ПОВТОРНОЕ ОБРАЩЕНИЕ Сансара!!!!! " + message.answers
        : "ПОВТОРНАЯ заявка (ДУБЛЬ) Сансара"
    ); //статус сделки
  } else {
    params.append(
      "params[request][request_name]",
      message.answers ? message.answers : "Заявка по Сансаре"
    ); //статус сделки
  }

  if (doubleMessage) {
    params.append("params[request][employee_id]", "1693");
  } else {
    params.append(
      "params[request][employee_id]",
      message.managerId == "Ошибка в выборе менеджера"? managerIdRandom : message.managerId ? message.managerId : managerIdRandom
    ); //id главного отв заявки
  }
  //колцентр 309 , 1584, 1693, 2220, 2146
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
    "params[request][fields][1][value]", message.utm_source =='vk' || message.utm_source =='TG' ? 'Сайт Сансара' : message.utm_campaign || message.utm_content || message.utm_term || message.utm_source ? "Лендинг Сансара" : "Сайт Сансара" 
  ); 

  params.append("params[request][fields][2][id]", "5147"); // доп поле 3 campaign
  params.append(
    "params[request][fields][2][value]",
    message.utm_campaign ? message.utm_campaign : ""
  ); 

  params.append("params[request][fields][3][id]", "5148"); // доп поле 4  term
  params.append( "params[request][fields][3][value]",
     message.utm_term ? message.utm_term : ""
  ); 


  params.append("params[request][fields][11][id]", "5185"); // доп поле 11  source
  params.append( "params[request][fields][11][value]",
     message.utm_source ? message.utm_source : ""
  ); 

  params.append("params[request][fields][4][id]", "3724"); // доп поле  5  Тип недвижимости
  params.append( "params[request][fields][4][value]", 'Новостройка'); 

  params.append("params[request][fields][5][id]", "5060"); // доп поле  6  ЖК сансара? 
  params.append("params[request][fields][5][value]", '1'); 

  params.append("params[request][fields][6][id]", "5077"); // доп поле  7  Оспорить заявку 
  params.append("params[request][fields][6][value]", '0'); 

  params.append("params[request][fields][7][id]", "5055"); // доп поле  8   Агент созвонился с покупателем? NEW
  params.append("params[request][fields][7][value]", 'Нет'); 

  params.append("params[request][fields][8][id]", "5020"); // доп поле  9   Стадия работы с покупателем
  params.append( "params[request][fields][8][value]", 'Указать стадию'); 

  params.append("params[request][fields][9][id]", "5169"); // доп поле 10  prodinfo
  params.append( "params[request][fields][9][value]",
     message.prodinfo ? message.prodinfo : ""
  ); 


  params.append("params[request][fields][10][id]", "1404"); // доп поле 11 Дата следующего действия
  params.append( "params[request][fields][10][value]",`${new Date().toISOString().split("T")[0]}`
  ); 

  params.append("params[request][fields][13][id]", "5269"); // доп поле 12 Дата следующего действия
  params.append( "params[request][fields][13][value]","1"); 

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





