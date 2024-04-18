//@ts-check

const axios = require('axios').default
const { sendEmail } = require("./lib");


async function fetchData() {
  const params = new URLSearchParams();
  params.append("apikey", "b6623ccbb9e2e082c27e266e77102105");
  params.append("params[publish]", "1");
  try {
    const response = await axios.post('http://jivemdoma.intrumnet.com:81/sharedapi/worker/filter',
      params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const data = response.data.data;
    const emails = [];
    for (const key in data) {
      if (data.hasOwnProperty(key) && data[key].internalemail) {
        const internalemail = data[key].internalemail;
        internalemail.forEach(emailObj => {
          emails.push(emailObj.email);
        });
      }
    }
    console.log(emails.length); // Выводим массив email на консоль
    return emails;
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    throw error; // Пробрасываем ошибку выше для обработки
  }
}


async function fetchObject(){
  try {
    const params2 = new URLSearchParams();
    params2.append("apikey", "58628747b0d7dceb97ae04303c31a536");
    params2.append("params[byid]", "615900");
    const response = await axios.post(
      "http://jivemdoma.intrumnet.com:81/sharedapi/stock/filter",
      params2,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const emails = [];
    // Итерируем по списку объектов
    response.data.data.list.forEach(item => {
      // Получаем массив полей каждого объекта
      const fields = item.fields;
      // Итерируем по полям
      fields.forEach(field => {
        // Проверяем тип поля и извлекаем email
        if (field.type === "text" && field.value.includes("@")) {
          const emailList = field.value.split(",");
          // Добавляем каждый email в массив
          emailList.forEach(email => {
            emails.push(email.trim());
          });
        }
      });
    });
    console.log(emails.length); // Выводим массив email на консоль
    return emails;
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
  }
}

//Его типизация после fetch 
// const oldEmployeeStr = [
//   'test@mail.ru',
//   'gankina.o@jivem-doma.ru',
//   ... 49 more items
// ]

//Его типизация после fetch 
// const id_actual_raw  = [
//   'test@mail.ru',
//   'gankina.o@jivem-doma.ru',
//   ... 49 more items
// ]

async function main() {
  try {

    
    let idActualRaw = await fetchData();
    let  oldEmployeeStr = await fetchObject()
    // console.log(
    //   {
    //     idActualRaw:idActualRaw,
    //     oldEmployeeStr:oldEmployeeStr
    //   }
    // )
 
    const oldEmployee = oldEmployeeStr ? oldEmployeeStr.map(email => email.toLowerCase()) : []; // Преобразуем в массив

    const emailActual = idActualRaw.filter(email => email !== null).map(email => email.toLowerCase());

    const deletedEmployee =  oldEmployee.filter(email => !emailActual.includes(email)) ;
    const newEmployee = emailActual.filter(email => !oldEmployee.includes(email));

    // Отправка запросов в API Skillspace для новых сотрудников
    const links = [
      "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B1894%5D=14797",
      "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B10026%5D=15478",
      "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B7001%5D=14798",
      "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B1896%5D=14799",
      "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B1898%5D=14800",
      "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B1968%5D=14801",
      "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B1901%5D=2421",
      "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B1970%5D=2427",
       //этот тестовый 
      "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B32298%5D=48552"
    ];
    
    const emailWithError = []

    for (const email of newEmployee) {
      console.log(email)
      for (const link of links) {
      sendEmail(email, link,  emailWithError);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    for (const email of emailWithError) {
      console.log({emailWithError:emailWithError, status:'Массив ошибочных повторная отправка пошла'})
      for (const link of links) {
      sendEmail(email, link,  emailWithError);
      }
    }

    // Отправка запросов в API Skillspace для удаления уволенных сотрудников
    const deleteLinks = [
      "https://skillspace.ru/api/open/v1/course/1894/student-remove?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d",
      "https://skillspace.ru/api/open/v1/course/10026/student-remove?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d",
      "https://skillspace.ru/api/open/v1/course/7001/student-remove?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d",
      "https://skillspace.ru/api/open/v1/course/1896/student-remove?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d",
      "https://skillspace.ru/api/open/v1/course/1898/student-remove?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d",
      "https://skillspace.ru/api/open/v1/course/1968/student-remove?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d",
      "https://skillspace.ru/api/open/v1/course/1901/student-remove?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d",
      "https://skillspace.ru/api/open/v1/course/1970/student-remove?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d",
      //этот тестовый 
      "https://skillspace.ru/api/open/v1/course/32298/student-remove?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d"
    ];

    for (const email of deletedEmployee) {
      for (const link of deleteLinks) {
        try {
          const response = await axios.get(`${link}&email=${email}`);
          console.log(`Email ${email} успешно удален с курса.`);
          console.log(response.data);
        } catch (error) {
          console.error(`Ошибка при удалении email ${email}: ${error}`);
        }
      }
    }

    // Обновление данных в CRM
    const emailActualStr = emailActual.join(",");
    console.log({sendOnField:emailActualStr})

    const params3 = new URLSearchParams();
    params3.append("apikey", "9a75fc323d968db797ec0ab848572aad");
    params3.append("params[0][id]", "615900");
    params3.append("params[0][fields][0][id]", "3668"); 
    params3.append("params[0][fields][0][value]",emailActualStr ); 

    try {
      const updateResponse = await axios.post('http://jivemdoma.intrumnet.com:81/sharedapi/stock/update',
       params3, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      console.log('Данные успешно обновлены в CRM.');
      console.log(updateResponse.data);
      return updateResponse;
    } catch (error) {
      console.error('Ошибка при обновлении данных в CRM:', error);
    }
  } catch (error) {
    console.error('Ошибка при выполнении основной логики:', error);
  }
}

// Вызов основной функции
main();















// async function fetchData() {
//   const params = new URLSearchParams();

//   params.append("apikey", "8bba96b3d2e3bea9f3204e6e8bba3547");

//   params.append("params[0][publish]", "1");

//   const data = await axios.post(
//     "http://jivemdoma.intrumnet.com:81/sharedapi/worker/filter",
//     params,
//     {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     }
//   );
//   return data;
// }

// const data = fetchData()
// console.log(data)

// async function fetchObject() {
//   try {

//     const params2 = new URLSearchParams();

//     params2.append("apikey", "58628747b0d7dceb97ae04303c31a536");

//     params2.append("params[byid]", "615900");
//     const response = await axios.post(
//       "http://jivemdoma.intrumnet.com:81/sharedapi/stock/filter",
//       params2,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     const emails = [];
//     // Итерируем по списку объектов
//     response.data.data.list.forEach(item => {
//       // Получаем массив полей каждого объекта
//       const fields = item.fields;
//       // Итерируем по полям
//       fields.forEach(field => {
//         // Проверяем тип поля и извлекаем email
//         if (field.type === "text" && field.value.includes("@")) {
//           const emailList = field.value.split(",");
//           // Добавляем каждый email в массив
//           emailList.forEach(email => {
//             emails.push(email.trim());
//           });
//           return emailList;
//         }
//       });
//     });
//     console.log(emails); // Выводим массив email на консоль
//   } catch (error) {
//     console.error("Ошибка при выполнении запроса:", error);
//   }
// }

// const old_employee_str = fetchObject();
// console.log(old_employee_str)

// // Функция для получения email из объекта $data и сохранения их в массиве
// function getEmails(data) {
//   const emails = [];

//   for (const key in data.data) {
//     const internalemail = data.data[key].internalemail;
//     if (internalemail && Array.isArray(internalemail) && internalemail.length > 0) {
//       emails.push(internalemail[0].email);
//     }
//   }

//   return emails;
// }


// // Получение массива email
// const email_actual = getEmails(data);

// // Приводим все email из CRM в нижний регистр
// const emailActualLower = email_actual.map(email => email.toLowerCase());











// // Находим уволенных сотрудников

// const deletedEmployee =  old_employee_str.filter(email => !emailActualLower.includes(old_employee_str));

// // Находим новых сотрудников
// const newEmployee = emailActualLower.filter(email => !oldEmployee.toLowerCase().includes(emailActualLower));


// console.log(emails);



// const token = '3f69a76b-368a-344f-9a8d-d2'


// const links = [
//   "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B1894%5D=14797",
//   "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B10026%5D=15478",
//   "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B7001%5D=14798",
//   "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B1896%5D=14799",
//   "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B1898%5D=14800",
//   "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B1968%5D=14801",
//   "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B1901%5D=2421",
//   "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B1970%5D=2427"
// ];

// // Функция для отправки запроса на каждую ссылку
// async function sendRequest(url, email) {
//   const response = await fetch(`${url}&email=${email}`);
//   return response.json();
// }

// // Функция для отправки запросов на каждый адрес электронной почты
// async function sendEmails() {
//   for (const email of newEmployee) {
//     for (const link of links) {
//       try {
//         const result = await sendRequest(link, email);
//         console.log(`Email ${email} успешно отправлен на курс.`);
//         console.log(result); // Полученный ответ от сервера
//       } catch (error) {
//         console.error(`Ошибка при отправке email ${email}: ${error}`);
//       }
//     }
//   }
// }

// // Вызов функции для отправки всех электронных писем
// sendEmails();