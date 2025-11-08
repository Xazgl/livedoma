import { ManagerQueue, Tilda, Wazzup } from "@prisma/client";
import axios from "axios";
import db from "../../prisma";
import { getSourceForJDDByUtm } from "@/shared/jdd/utils";

export default async function sendIntrumCrm(message: Wazzup, double: boolean, wazzupFlag?:boolean) {
  //Создание заявки сразу с контактом
  const obj = {
    apikey: "7917e0838a4d494b471ceb36d7e3a67b",
    params: [
      {
        customer: {
          name: "Тест",
          surname: "Тестов",
          secondname: "Тестович",
          manager_id: 1,
          additional_manager_id: [2, 3],
          marktype: 1,
          email: [
            {
              mail: "test@test.ru",
              comment: "Тестовый адрес",
            },
          ],
          phone: [
            {
              phone: "8800200002",
              comment: "Первый номер телефона",
            },
          ],
          fields: [
            {
              id: 99,
              value: "Тест",
            },
          ],
        },
        request: {
          request_type: 10,
          source: "online_form",
          employee_id: 1,
          additional_employee_id: [1, 2],
          request_name: "Тестовая заявка",
          status: "unselected",
          fields: [
            {
              id: 99,
              value: "Тест",
            },
          ],
          //ID объекта или массив ID прикрепляемых объектов
          stock_id: 680826,
        },
      },
    ],
  };

  const doubleMessage = double;

  console.log(doubleMessage);

  const managers = await db.activeManagers.findMany({
    where: {
      company_JDD_active: true,
    },
    select: {
      name: true,
      manager_id: true,
    },
  });

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
  params.append(`params[customer][phone][]`, message.phone); // Телефон в контакте
  params.append(`params[customer][marktype]`, "8"); // Тип контакта покупатель

  params.append("params[request][request_type]", "23"); // Id типа заявка (тут строительство)
  params.append("params[request][status]", "unselected"); //статус сделки
  params.append(
    "params[request][request_name]",
    doubleMessage
      ? "Повторное обращение(дубль) получили каталог в Вотсапе ТОП-10"
      : "Получили каталог в Вотсапе ТОП-10 проектов домов"
  ); //статус сделки
  if (doubleMessage) {
    params.append("params[request][employee_id]", "1693");
  } else {
    params.append("params[request][employee_id]", "44"); //id главного отв заявки
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

  params.append("params[request][additional_employee_id][6]", "2753"); //массив доп отв

  //доп поля заявки
  params.append("params[request][fields][0][id]", "4059"); // доп поле 1
  params.append(
    "params[request][fields][0][value]",
    doubleMessage ? "Дубль" : "WhatsApp"
  ); //доп поле 1
  params.append("params[request][fields][1][id]", "4056"); // доп поле 2
  params.append("params[request][fields][1][value]", "WhatsApp"); //доп поле 2

  params.append("params[request][fields][2][id]", "4057"); // доп поле 3
  params.append("params[request][fields][2][value]", formattedDate); //доп поле 3

  params.append("params[request][fields][3][id]", "4058"); // доп поле 4
  params.append("params[request][fields][3][value]", "Указать стадию"); //доп поле 4

  params.append("params[request][fields][4][id]", "5079"); // доп поле 5
  params.append("params[request][fields][4][value]", "Не заполнено"); //доп поле 5

  params.append("params[request][fields][4][id]", "4992"); // доп поле 5
  params.append("params[request][fields][4][value]", "Заявка не проверена"); //доп поле 5

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

export async function sendIntrumCrmTilda(
  message: Tilda,
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
  let answerFor5291 = ""; // Выбор типа услуги
  let title = ""; // Выбор типа услуги
  if (
    formName === "Ремонты-бесплатный замер" ||
    message?.formid === "form714887068" ||
    message?.formid === "form716183792" ||
    formName === "Ремонты-консультация" ||
    formName === "Ремонты - заказать 3д" ||
    formName?.includes("Ремонт")
  ) {
    answerFor5291 = "Ремонты";
    title = "Заявка на ремонт";
  } else if (
    formName === "Производство Получить консультацию" ||
    message?.formid === "form790140565" ||
    formName === "Производство Индив предл по скидке" ||
    message?.formid === "form867970463" ||
    formName?.includes("Производство")
  ) {
    answerFor5291 = "Производство";
    title = "Заявка на производство";
  } else {
    answerFor5291 = "Строительство";
    title = "Заявка на строительство";
  }

  console.log("answerFor5291", answerFor5291);
  console.log("formName", formName);
  console.log("message?.formid", message?.formid);

  // Случайный выбор менеджера
  const randomManager = managers[Math.floor(Math.random() * managers.length)];
  // Получение id выбранного менеджера
  const managerIdRandom = randomManager.manager_id;

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
        : "ПОВТОРНАЯ заявка на строительство (ДУБЛЬ)"
    ); //статус сделки
  } else {
    params.append(
      "params[request][request_name]",
      message.answers ? message.answers : title
      // message.answers ? message.answers : "Заявка на строительство"
    ); //статус сделки
  }

  if (doubleMessage) {
    params.append("params[request][employee_id]", "1693");
  } else {
    // if (source === "Авито таргет") {
    //   params.append("params[request][employee_id]", "44"); //id главного отв заявки
    // } else {
      params.append(
        "params[request][employee_id]",
        message.managerId == "Ошибка в выборе менеджера"
          ? managerIdRandom
          : message.managerId
          ? message.managerId
          : managerIdRandom
      ); //id главного отв заявки
    // }
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
  // params.append("params[request][additional_employee_id][4]", "2146"); //массив доп отв

  //доп поля заявки
  params.append("params[request][fields][0][id]", "4059"); // доп поле 1
  params.append(
    "params[request][fields][0][value]",
    doubleMessage ? "Дубль" : "Заявка"
  ); //доп поле 1

  params.append("params[request][fields][1][id]", "4056"); // доп поле 2
  params.append(
    "params[request][fields][1][value]",
    source
    // message.utm_source == "sayt_GD"
    //   ? "Сайт Живем Дома"
    //   : message.utm_source == "vk" || message.utm_source == "TG"
    //   ? "Наш сайт"
    //   : message.utm_campaign ||
    //     message.utm_content ||
    //     message.utm_term ||
    //     message.utm_source
    //   ? "лендинг"
    //   : "Наш сайт"
  ); //доп поле 2

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

// Вариант 1 для точной очереди [Орлова, Шепилов, <один_ordinary>, Орлова, Шепилов, Орлова]
// let currentCycle = -1;
// let currentSequence: string[] = [];
/**
 * Выбирает следующего менеджера:
 * – в каждом цикле N активных менеджеров (запросов),
 * – Орлова (ID "2753") — 3 заявки в цикле,
 * – Шепилов (ID "44") — 2 заявки в цикле,
 * – ровно один «обычный» менеджер по кругу,
 * – порядок: [Орлова, Шепилов, Ordinary, Орлова, Шепилов, Орлова].
 */
// export async function managerFind(): Promise<string> {
//   // 1) Список активных менеджеров из БД
//   const managers = await db.activeManagers.findMany({
//     where: { company_JDD_active: true },
//     select: { manager_id: true },
//   });
//   const ids = managers.map((m) => m.manager_id);
//   const ordinary = ids.filter((id) => id !== "2753" && id !== "44");

//   // 2) Размер цикла = кол-во менеджеров
//   const cycleSize = ids.length;

//   // 3) Сколько заявок уже отдали?
//   const total = await db.managerQueue.count();
//   const cycleNum = Math.floor(total / cycleSize);

//   // 4) Генерируем новую последовательность при старте цикла
//   if (cycleNum !== currentCycle) {
//     currentCycle = cycleNum;
//     // Выбираем «ordinary» по кругу
//     const ord = ordinary[cycleNum % ordinary.length];
//     currentSequence = ["2753", "44", ord, "2753", "44", "2753"];
//   }

//   // 5) Берём по текущему индексу
//   const idx = total % cycleSize;
//   const choice = currentSequence[idx];

//   // 6) Сохраняем и возвращаем
//   await db.managerQueue.create({ data: { managerId: choice } });
//   return choice;
// }

//Вариант 2
let currentCycle = -1;
let currentSequence: string[] = [];
let lastCycleSize = 0;

export async function managerFind() {
  try {
    // 1) Загружаем всех активных менеджеров
    const managers = await db.activeManagers.findMany({
      where: { company_JDD_active: true },
      select: { manager_id: true },
    });

    // Если нет ни одного активного — откатываемся на старую логику
    if (managers.length === 0) {
      return await oldManagerFind();
    }

    // 2) Назначаем веса
    const weights: Record<string, number> = {};
    for (const { manager_id } of managers) {
      if (manager_id === "2753") weights[manager_id] = 3; // Орлова
      else if (manager_id === "44") weights[manager_id] = 2; // Шепилов
      else weights[manager_id] = 1; // все остальные
    }

    // 3) Собираем базовый пул и определяем размер цикла
    const basePool = Object.entries(weights).flatMap(([id, w]) =>
      Array(w).fill(id)
    );
    const cycleSize = basePool.length;

    // Ещё одна защита: если вдруг cycleSize == 0 (чудом), — откат
    if (cycleSize === 0) {
      return await oldManagerFind();
    }

    // 4) Сколько заявок уже было
    const total = await db.managerQueue.count();
    const cycleNum = Math.floor(total / cycleSize);

    // 5) Перемешиваем на старте нового цикла
    //    или если cycleSize изменился (новые/удалённые менеджеры)
    if (cycleNum !== currentCycle || cycleSize !== lastCycleSize) {
      currentCycle = cycleNum;
      lastCycleSize = cycleSize;
      currentSequence = shuffleArray([...basePool]);
    }

    // 6) Берём текущий элемент
    const idx = total % cycleSize;
    const choice = currentSequence[idx];

    // // Пишем в очередь и возвращаем
    // await db.managerQueue.create({ data: { managerId: choice } });
    return choice;
  } catch (error) {
    console.error("Error in managerFind (new version):", error);
    return await oldManagerFind();
  }
}

/** Fisher–Yates shuffle */
function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Вариант 3 старый
// export async function managerFind() {
//   try {
//     const managers = await db.activeManagers.findMany({
//       where: {
//         company_JDD_active: true,
//       },
//       select: {
//         name: true,
//         manager_id: true,
//       },
//     });

//     const oneWeekAgo = new Date();
//     oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

//     console.log("ЖДД список менеджеров из БД", managers);

//     const totalManagers = managers ? managers.length : 5;

//     const existingQueue: ManagerQueue[] = await db.managerQueue.findMany({
//       orderBy: { createdAt: "desc" },
//     });

//     // Считаем заявки Орловой за неделю
//     const orlovaWeekCount = await db.managerQueue.count({
//       where: {
//         managerId: "2753",
//         createdAt: { gte: oneWeekAgo },
//       },
//     });

//     // Считаем заявки всех остальных менеджеров за неделю
//     const otherManagersWeekCount = await db.managerQueue.count({
//       where: {
//         managerId: { not: "2753" },
//         createdAt: { gte: oneWeekAgo },
//       },
//     });

//     if (existingQueue.length > 0) {
//       if (existingQueue.length >= 3) {
//         // Проверяем последние равное кол-ву менеджеров в очереди кол-во  заявок и выбираем менеджера, которого там нет
//         const lastManagers = existingQueue
//           .slice(0, totalManagers)
//           .map((record) => record.managerId);

//         const lastManagersArr = existingQueue.slice(0, totalManagers);
//         // Последняя заявка и предпоследния (нулевой элемент — самая новая) была ли орлова
//         const lastOne = existingQueue[0];
//         const lastTwo = existingQueue[1];
//         const notOrlovaWasLastTwo =
//           lastOne?.managerId !== "2753" && lastTwo?.managerId !== "2753";
//         // Сколько раз Орлова была в последних N заявках
//         const orlovaRecentCount = lastManagersArr.filter(
//           (manager) => manager.managerId === "2753"
//         ).length;
//         // Основное условие для Орловой:
//         // 1) Меньше 2х в последних N заявках
//         // 2) Не была последней
//         // 3) Имеет меньше чем 2x заявок за неделю по сравнению с другими
//         if (
//           orlovaRecentCount < 2 &&
//           notOrlovaWasLastTwo &&
//           (otherManagersWeekCount === 0 || // Если другие еще не получали заявки
//             orlovaWeekCount / otherManagersWeekCount < 2)
//         ) {
//           return "2753";
//         }
//         const availableManagers = managers.filter(
//           (manager) => !lastManagers.includes(manager.manager_id)
//         );

//         if (availableManagers.length > 0) {
//           // Подсчитываем количество заявок за последнюю неделю
//           const oneWeekAgo = new Date();
//           oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

//           const requestCountsPromises = availableManagers.map(
//             async (manager) => {
//               const count = await db.managerQueue.count({
//                 where: {
//                   managerId: manager.manager_id,
//                   createdAt: { gte: oneWeekAgo },
//                 },
//               });
//               return { managerId: manager.manager_id, count };
//             }
//           );

//           const requestCounts = await Promise.all(requestCountsPromises);
//           const leastLoadedManager = requestCounts.sort(
//             (a, b) => a.count - b.count
//           )[0];

//           return leastLoadedManager.managerId;
//         } else {
//           // Если все менеджеры уже были в последних  заявках, выбираем того, у кого меньше заявок за последнюю неделю
//           const allManagerIds = managers.map((manager) => manager.manager_id);

//           const oneWeekAgo = new Date();
//           oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

//           const requestCountsPromises = allManagerIds.map(async (managerId) => {
//             const count = await db.managerQueue.count({
//               where: {
//                 managerId,
//                 createdAt: { gte: oneWeekAgo },
//               },
//             });
//             return { managerId, count };
//           });

//           const requestCounts = await Promise.all(requestCountsPromises);
//           const leastLoadedManager = requestCounts.sort(
//             (a, b) => a.count - b.count
//           )[0];

//           return leastLoadedManager.managerId;
//         }
//       } else {
//         // Если в новой БД меньше 3 записей, работаем по старому коду
//         return await oldManagerFind();
//       }
//     } else {
//       // Если новая БД пуста, работаем по старому коду
//       return await oldManagerFind();
//     }
//   } catch (error) {
//     console.error("Error in managerFind:", error);
//     // Если произошла ошибка, работаем по старому коду
//     return await oldManagerFind();
//   }
// }

export async function oldManagerFind() {
  try {
    const managers = await db.activeManagers.findMany({
      where: {
        company_JDD_active: true,
      },
      select: {
        name: true,
        manager_id: true,
      },
    });
    const existingContactsWazzup: Wazzup[] = await db.wazzup.findMany({
      take: 2,
      orderBy: { createdAt: "desc" },
    });
    // console.log({existingContactsWazzu:existingContactsWazzup})

    const existingContactsTilda: Tilda[] = await db.tilda.findMany({
      take: 2,
      orderBy: { createdAt: "desc" },
    });
    // console.log({ existingContactsTilda: existingContactsTilda})

    // Получаем все managerId из обеих схем
    const allManagerIds: Set<string> = new Set([
      ...existingContactsWazzup.map((contact) => contact.managerId || ""), // Учитываем возможность null значений
      ...existingContactsTilda.map((contact) => contact.managerId || ""),
    ]);
    console.log({ allManagerIds: allManagerIds });

    // Если есть хотя бы один элемент не '' то вернет true в  hasNonEmptyManagerIds
    const hasNonEmptyManagerIds = Array.from(allManagerIds).some(
      (id) => id !== ""
    );
    // console.log({ hasNonEmptyManagerIds: hasNonEmptyManagerIds });

    if (hasNonEmptyManagerIds) {
      const unusedManagers: { name: string; manager_id: string }[] =
        managers.filter((manager) => !allManagerIds.has(manager.manager_id));
      // console.log({ unusedManagers: unusedManagers });

      if (unusedManagers.length > 0) {
        //берем id менеджера из тех, у кого не было последних заявок
        // return unusedManagers[0].id;

        const unusedManagerIds = unusedManagers.map(
          (manager) => manager.manager_id
        ); //массив их id

        // console.log({ unusedManagerIds: unusedManagerIds });

        // Подсчитываем количество заявок для каждого менеджера из unusedManagers
        const requestCountsPromises = unusedManagerIds.map(
          async (managerId) => {
            const wazzupCount = await db.wazzup.count({
              where: { managerId },
            });
            const tildaCount = await db.tilda.count({
              where: { managerId },
            });
            return {
              managerId,
              count: wazzupCount + tildaCount,
            };
          }
        );

        const requestCounts = await Promise.all(requestCountsPromises);
        // console.log({ requestCounts: requestCounts });

        // Сортируем менеджеров по возрастанию количества заявок и выбираем первого
        const leastLoadedManager = requestCounts.sort(
          (a, b) => a.count - b.count
        )[0];

        // console.log({ leastLoadedManager: leastLoadedManager });

        // Возвращаем id менеджера с наименьшим количеством заявок
        return leastLoadedManager.managerId;
      } else {
        return managers[Math.floor(Math.random() * managers.length)].manager_id;
      }
    } else {
      // Если все заявки без менеджеров или пустые '', выбираем случайного менеджера
      return managers[Math.floor(Math.random() * managers.length)].manager_id;
    }
  } catch (error) {
    console.error("Error in managerFind:", error);
  }
}
