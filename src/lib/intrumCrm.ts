import { Tilda, Wazzup } from "@prisma/client";
import axios from "axios";
import db from "../../prisma";

export default async function sendIntrumCrm(message: Wazzup, double:boolean) {
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

  console.log( doubleMessage)

  const managers = [
    { name: "Политов", id: "391" },
    { name: "Максимова Людмила", id: "332" },
    { name: "Трофимов", id: "1140" },
    // { name: "Максимова Юлия", id: "2109" },
    { name: "Исаева", id: "39" },
    { name: "Трубачева", id: "1460" },
    { name: "Бородина", id: "353" },
  ];

  // Случайный выбор менеджера
  const randomManager = managers[Math.floor(Math.random() * managers.length)];
  // Получение id выбранного менеджера
  const managerIdRandom = randomManager.id;

  const messageCreatedAt = new Date(message.createdAt); // Получаем дату создания сообщения
  const nextDay = new Date(messageCreatedAt.getTime() + (24 * 60 * 60 * 1000)); // Добавляем один день
  const formattedDate = nextDay.toISOString().split('T')[0]; // Преобразуем в формат Y-m-d



  // Создаем объект с параметрами
  const params = new URLSearchParams();

  params.append("apikey", "7917e0838a4d494b471ceb36d7e3a67b");
  params.append("params[customer][manager_id]", "0"); //ответственный id в контакте
  params.append("params[customer][name]", message.name ? message.name : ""); // Имя клиента в контакте
  params.append(`params[customer][phone][]`, message.phone); // Телефон в контакте
  params.append(`params[customer][marktype]`, "8"); // Тип контакта покупатель

  params.append("params[request][request_type]", "23"); // Id типа заявка (тут строительство)
  params.append("params[request][status]", "unselected"); //статус сделки
  params.append("params[request][request_name]", doubleMessage? "Повторное обращение(дубль) получили каталог в Вотсапе ТОП-10" : "Получили каталог в Вотсапе ТОП-10 проектов домов"); //статус сделки
  if(doubleMessage){
    params.append("params[request][employee_id]","1676"); //id главного отв заявки
  }else{
    params.append("params[request][employee_id]", message.managerId == "Ошибка в выборе менеджера" ? managerIdRandom : message.managerId ? message.managerId :managerIdRandom ); //id главного отв заявки
  }
  //колцентр 309 , 1584, 1693, 2220, 2146
  params.append("params[request][additional_employee_id][0]", "309"); //массив доп отв
  params.append("params[request][additional_employee_id][1]", "1584"); //массив доп отв
  params.append("params[request][additional_employee_id][2]", "1693"); //массив доп отв
  params.append("params[request][additional_employee_id][3]", "2220"); //массив доп отв
  params.append("params[request][additional_employee_id][4]", "2146"); //массив доп отв
  //доп поля заявки
  params.append("params[request][fields][0][id]", "4059"); // доп поле 1
  params.append("params[request][fields][0][value]", doubleMessage? "Дубль": "WhatsApp"); //доп поле 1
  params.append("params[request][fields][1][id]", "4056"); // доп поле 2
  params.append("params[request][fields][1][value]", "WhatsApp"); //доп поле 2
  
  params.append("params[request][fields][2][id]", "4057"); // доп поле 3
  params.append("params[request][fields][2][value]", formattedDate ); //доп поле 3

  params.append("params[request][fields][3][id]","4058"); // доп поле 4
  params.append("params[request][fields][3][value]","Встреча не состоялась" ); //доп поле 4

  params.append("params[request][fields][4][id]", "4994"); // доп поле 5
  params.append("params[request][fields][4][value]","0"  ); //доп поле 5

  params.append("params[request][fields][4][id]", "4992"); // доп поле 5
  params.append("params[request][fields][4][value]","Заявка не проверена"  ); //доп поле 5

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

//для контакта
// export default async function sendIntrumCrm(message: Wazzup) {
//   const obj = {
//     apikey: "7917e0838a4d494b471ceb36d7e3a67b",
//     params: [
//       {
//         manager_id: 0,
//         name: message.name,
//         surname: "dfdfdfd",
//         email: [""],
//         phone: [message.phone],
//         fields: [],
//       }
//     ]
//   };

//   // Создаем объект с параметрами
//   const params = new URLSearchParams();
//   params.append("apikey", '7917e0838a4d494b471ceb36d7e3a67b');
//   params.append("params[0][manager_id]", '0');
//   params.append("params[0][name]", message.name? message.name : '');
//   params.append(`params[0][phone][]`, message.phone);
//   // obj.params[0].phone.forEach((phone, index) => {
//   //   params.append(`params[0][phone][${index}]`, phone);
//   // });
//   try {
//   const postResponse = await axios.post(
//     "http://jivemdoma.intrumnet.com:81/sharedapi/purchaser/insert",
//     params,
//     {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     }
//   );

//   return postResponse.data;

//   } catch (error) {
//       console.error(error);
//       return new Response(`Запрос в Intrum не выполнен ошибка ${error}`, { status: 404 });
//   }
// }
//для заявки
// const obj2 = {
//   apikey: "7917e0838a4d494b471ceb36d7e3a67b",
//   params: [
//     {
//       request_type: 1,
//       employee_id: 0,
//       customers_id: 10543,
//       fields: [
//         { id: 1213, value: "Сайт" },
//         { id: 1563, value: "Вариант1,Вариант2" },
//         { id: 1562, value: "2020-06-02 13:12:47" },
//         { id: 579, value: 1 },
//         { id: 781, value: 7.12 },
//         { id: 1234, value: { lat: "35.013116", lon: "41.906049" } },
//         { id: 774, value: { from: 1, to: 2 } },
//         { id: 1845, value: "89/aa/5ee243c5ca694.jpg" },
//         { id: 1845, value: "89/aa/5ee243c86a388.jpg" },
//         { id: 701, value: 2000000 },
//         { id: 1565, value: "Отличная квартира в хорошем районе" },
//       ],
//     }
//   ]
// };

// "params[0][customer][manager_id]"; "0",

// "params[0][customer][name]":'Test',
// `params[0][customer][phone][]:[+745434343]`

// "params[0][request][request_type]": "23",
// "params[0][request][employee_id]": "0",
// "params[0][request][customers_id]": "пример",
// "params[0][request][fields][]": "[
//   { id: 4056, value: "WhatsApp" }
//   { id:   4059, value: "WhatsApp" }
// ]"



export  async function sendIntrumCrmTilda(message: Tilda, double:boolean ) {

  const doubleMessage = double;

  const managers = [
    { name: "Политов", id: "391" },
    { name: "Максимова Людмила", id: "332" },
    { name: "Трофимов", id: "1140" },
    // { name: "Максимова Юлия", id: "2109" },
    { name: "Исаева", id: "39" },
    { name: "Трубачева", id: "1460" },
    { name: "Бородина", id: "353" },
  ];

  // Случайный выбор менеджера
  const randomManager = managers[Math.floor(Math.random() * managers.length)];
  // Получение id выбранного менеджера
  const managerIdRandom = randomManager.id;

  const messageCreatedAt = new Date(message.createdAt); // Получаем дату создания сообщения
  const nextDay = new Date(messageCreatedAt.getTime() + (24 * 60 * 60 * 1000)); // Добавляем один день
  const formattedDate = nextDay.toISOString().split('T')[0]; // Преобразуем в формат Y-m-d

  // Создаем объект с параметрами
  const params = new URLSearchParams();

  params.append("apikey", "7917e0838a4d494b471ceb36d7e3a67b");
  params.append("params[customer][manager_id]", "0"); //ответственный id в контакте
  params.append("params[customer][name]", message.name ? message.name : ""); // Имя клиента в контакте
  params.append(`params[customer][phone][]`, message.phone); // Телефон в контакте
  params.append(`params[customer][marktype]`, "8"); // Тип контакта покупатель

  params.append("params[request][request_type]", "23"); // Id типа заявка (тут строительство)
  params.append("params[request][status]", "unselected"); //статус сделки
  
  if(doubleMessage) {
     params.append("params[request][request_name]", message.answers ? 'ДУБЛЬ ПОВТРНОЕ ОБРАЩЕНИЕ!!!!! '+ message.answers   : "ПОВТОРНАЯ заявка на строительство (ДУБЛЬ)"); //статус сделки
  } else{
    params.append("params[request][request_name]", message.answers ? message.answers  : "Заявка на строительство"); //статус сделки

  }

 if(doubleMessage){
    params.append("params[request][employee_id]","1676")
  } else{
    params.append("params[request][employee_id]", message.managerId == "Ошибка в выборе менеджера" ? managerIdRandom : message.managerId ? message.managerId :managerIdRandom ); //id главного отв заявки

  }
  //колцентр 309 , 1584, 1693, 2220, 2146
  params.append("params[request][additional_employee_id][0]", "309"); //массив доп отв
  params.append("params[request][additional_employee_id][1]", "1584"); //массив доп отв
  params.append("params[request][additional_employee_id][2]", "1693"); //массив доп отв
  params.append("params[request][additional_employee_id][3]", "2220"); //массив доп отв
  params.append("params[request][additional_employee_id][4]", "2146"); //массив доп отв
  
  //доп поля заявки
  params.append("params[request][fields][0][id]", "4059"); // доп поле 1
  params.append("params[request][fields][0][value]", doubleMessage? 'Дубль' :'Заявка'); //доп поле 1


  params.append("params[request][fields][1][id]", "4056"); // доп поле 2
  params.append("params[request][fields][1][value]", message.utm_campaign ? "лендинг" : "Наш сайт"); //доп поле 2

  params.append("params[request][fields][2][id]", "5001"); // доп поле 3
  params.append("params[request][fields][2][value]",message.utm_campaign? message.utm_campaign : ''  ); //доп поле 3

  params.append("params[request][fields][3][id]", "5000"); // доп поле 4
  params.append("params[request][fields][3][value]",message.utm_term? message.utm_term: ''  ); //доп поле 4
   
  params.append("params[request][fields][4][id]", "4992"); // доп поле 5
  params.append("params[request][fields][4][value]","Заявка не проверена"  ); //доп поле 5
  
  params.append("params[request][fields][5][id]", "4994"); // доп поле 6
  params.append("params[request][fields][5][value]","0"  ); //доп поле 6

  params.append("params[request][fields][6][id]", "4057"); // доп поле 7
  params.append("params[request][fields][6][value]", formattedDate ); //доп поле 7

  params.append("params[request][fields][7][id]","4058"); // доп поле 8
  params.append("params[request][fields][7][value]", "Встреча не состоялась"); //доп поле 8


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


export async function managerFind() {

  const managers = [
   { name: "Политов", id: "391" },
   { name: "Максимова Людмила", id: "332" },
   { name: "Трофимов", id: "1140" },
   { name: "Исаева", id: "39" },
   { name: "Трубачева", id: "1460" },
   { name: "Бородина", id: "353" },
  ];

  const existingContactsWazzup: Wazzup[] = await db.wazzup.findMany({
    take: 2,
    orderBy: { createdAt: "desc" }
  });
  // console.log({existingContactsWazzu:existingContactsWazzup})

  const existingContactsTilda: Tilda[] = await db.tilda.findMany({
    take: 2,
    orderBy: { createdAt: "desc" }
  });
  // console.log({ existingContactsTilda: existingContactsTilda})

  // Получаем все managerId из обеих схем
  const allManagerIds: Set<string> = new Set([
    ...existingContactsWazzup.map((contact) => contact.managerId || ''), // Учитываем возможность null значений
    ...existingContactsTilda.map((contact) => contact.managerId || '')
  ]);
  console.log({ allManagerIds:allManagerIds})

  // Если есть хотя бы один элемент не '' то вернет true в  hasNonEmptyManagerIds 
  const hasNonEmptyManagerIds = Array.from(allManagerIds).some(id => id !== '');
  console.log({  hasNonEmptyManagerIds:  hasNonEmptyManagerIds })

  if (hasNonEmptyManagerIds) {
    const unusedManagers: { name: string; id: string; }[] = managers.filter((manager) => !allManagerIds.has(manager.id));
    console.log({  unusedManagers: unusedManagers })

    if (unusedManagers.length > 0) {
      //берем id менеджера из тех, у кого не было последних заявок 
      // return unusedManagers[0].id;

      const unusedManagerIds = unusedManagers.map((manager) => manager.id); //массив их id

      console.log({   unusedManagerIds :   unusedManagerIds })

      // Подсчитываем количество заявок для каждого менеджера из unusedManagers
      const requestCountsPromises = unusedManagerIds.map(async (managerId) => {
        const wazzupCount = await db.wazzup.count({
            where: { managerId }
        });
        const tildaCount = await db.tilda.count({
            where: { managerId }
        });
        return {
            managerId,
            count: wazzupCount + tildaCount
        };
    });
    
    const requestCounts = await Promise.all(requestCountsPromises);
    console.log({   requestCounts :  requestCounts  })

      // Сортируем менеджеров по возрастанию количества заявок и выбираем первого
      const leastLoadedManager = requestCounts.sort((a, b) => a.count - b.count)[0];
       
      console.log({    leastLoadedManager :   leastLoadedManager })

      // Возвращаем id менеджера с наименьшим количеством заявок
      return leastLoadedManager.managerId;

    } else {
        return managers[Math.floor(Math.random() * managers.length)].id; 
    }  
  } else {
    // Если все заявки без менеджеров или пустые '', выбираем случайного менеджера
    return managers[Math.floor(Math.random() * managers.length)].id;  
  }
}


