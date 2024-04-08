import { Tilda, Wazzup } from "@prisma/client";
import axios from "axios";

//Создание заявки сразу с контактом
export default async function sendIntrumCrm(message: Wazzup) {
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

  const managers = [
    { name: "Политов", id: "391" },
    { name: "Максимова Людмила", id: "332" },
    { name: "Максимова Юлия", id: "2109" },
    { name: "Исаева", id: "39" },
    { name: "Трубачева", id: "1460" },
    { name: "Бородина", id: "353" },
  ];

  // Случайный выбор менеджера
  const randomManager = managers[Math.floor(Math.random() * managers.length)];
  // Получение id выбранного менеджера
  const managerId = randomManager.id;

  // Создаем объект с параметрами
  const params = new URLSearchParams();

  params.append("apikey", "7917e0838a4d494b471ceb36d7e3a67b");
  params.append("params[customer][manager_id]", "0"); //ответственный id в контакте
  params.append("params[customer][name]", message.name ? message.name : ""); // Имя клиента в контакте
  params.append(`params[customer][phone][]`, message.phone); // Телефон в контакте
  params.append(`params[customer][marktype]`, "8"); // Тип контакта покупатель

  params.append("params[request][request_type]", "23"); // Id типа заявка (тут строительство)
  // params.append("params[request][status]", "Новое обращение или звонок"); //статус сделки
  params.append("params[request][status]", "unselected"); //статус сделки
  params.append("params[request][request_name]","Получили каталог в Вотсапе ТОП-10 проектов домов"); //статус сделки
  params.append("params[request][employee_id]", managerId ); //id главного отв заявки
  //колцентр 309 , 1584, 1693, 2220, 2146
  params.append("params[request][additional_employee_id][0]", "309"); //массив доп отв
  params.append("params[request][additional_employee_id][1]", "1584"); //массив доп отв
  params.append("params[request][additional_employee_id][2]", "1693"); //массив доп отв
  params.append("params[request][additional_employee_id][3]", "2220"); //массив доп отв
  params.append("params[request][additional_employee_id][4]", "2146"); //массив доп отв
  //доп поля заявки
  params.append("params[request][fields][0][id]", "4059"); // доп поле 1
  params.append("params[request][fields][0][value]", "WhatsApp"); //доп поле 1
  params.append("params[request][fields][1][id]", "4056"); // доп поле 1
  params.append("params[request][fields][1][value]", "WhatsApp"); //доп поле 1

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



export  async function sendIntrumCrmTilda(message: Tilda) {

  const managers = [
    { name: "Политов", id: "391" },
    { name: "Максимова Людмила", id: "332" },
    { name: "Максимова Юлия", id: "2109" },
    { name: "Исаева", id: "39" },
    { name: "Трубачева", id: "1460" },
    { name: "Бородина", id: "353" },
  ];

  // Случайный выбор менеджера
  const randomManager = managers[Math.floor(Math.random() * managers.length)];
  // Получение id выбранного менеджера
  const managerId = randomManager.id;

  // Создаем объект с параметрами
  const params = new URLSearchParams();

  params.append("apikey", "7917e0838a4d494b471ceb36d7e3a67b");
  params.append("params[customer][manager_id]", "0"); //ответственный id в контакте
  params.append("params[customer][name]", message.name ? message.name : ""); // Имя клиента в контакте
  params.append(`params[customer][phone][]`, message.phone); // Телефон в контакте
  params.append(`params[customer][marktype]`, "8"); // Тип контакта покупатель

  params.append("params[request][request_type]", "23"); // Id типа заявка (тут строительство)
  params.append("params[request][status]", "unselected"); //статус сделки
  params.append("params[request][request_name]", message.answers ? message.answers  : "Заявка на строительство"); //статус сделки
  params.append("params[request][employee_id]", managerId ); //id главного отв заявки
  //колцентр 309 , 1584, 1693, 2220, 2146
  params.append("params[request][additional_employee_id][0]", "309"); //массив доп отв
  params.append("params[request][additional_employee_id][1]", "1584"); //массив доп отв
  params.append("params[request][additional_employee_id][2]", "1693"); //массив доп отв
  params.append("params[request][additional_employee_id][3]", "2220"); //массив доп отв
  params.append("params[request][additional_employee_id][4]", "2146"); //массив доп отв
  
  //доп поля заявки
  params.append("params[request][fields][0][id]", "4059"); // доп поле 1
  params.append("params[request][fields][0][value]", 'Заявка'); //доп поле 1


  params.append("params[request][fields][1][id]", "4056"); // доп поле 2
  params.append("params[request][fields][1][value]", message.utm_campaign ? "лендинг" : "Наш сайт"); //доп поле 2

  params.append("params[request][fields][2][id]", "5001"); // доп поле 3
  params.append("params[request][fields][2][value]",message.utm_campaign? message.utm_campaign : ''  ); //доп поле 3

  params.append("params[request][fields][3][id]", "5000"); // доп поле 4
  params.append("params[request][fields][3][value]",message.utm_term? message.utm_term: ''  ); //доп поле 4
   
  params.append("params[request][fields][4][id]", "4992"); // доп поле 5
  params.append("params[request][fields][4][value]","Заявка не проверена"  ); //доп поле 5
  
  params.append("params[request][fields][4][id]", "4994"); // доп поле 6
  params.append("params[request][fields][4][value]","0"  ); //доп поле 6


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