//@ts-check

const axios = require('axios').default
const { sendEmail } = require("./lib");


const emailList = [
  "iskanderm185@gmail.com",
  "karpovichirina@mail.ru",
  "n.rutzkaja@yandex.ru",
  "pshenichnaya_yelena@mail.ru",
  "puzanovartem2@gmail.com",
  "vlasovalybov@bk.ru",
  "zil1311@mai.ru",
  "shapovalova.margo1785@mail.ru",
  "swallow888@gmail.com",
  "utalieva.farida@mail.ru",
  "akim.laptev@yandex.ru",
  "twoe_@mail.ru",
  "paparu@gmail.ru",
  "glushkova1010@gmail.com",
  "vladislaavvsss@mail.ru",
  "honey-baby88@mail.ru",
  "Sany95-95@bk.ru",
  "tiggrilla@gmail.com",
  "alinakurdunova7@gmail.com",
  "albina13kiss@yandex.ru",
  "iamirumov@mail.ru",
  "doronin060288@gmail.com",
  "goronov.a@mail.ru",
  "pro55555.ru@mail.ru",
  "severov-andrei86@mail.ru",
  "sharaponov@gmail.com",
  "anna7588.16@gmail.com",
  "azubova36@gmail.com",
  "antonkoshergin23071999@mail.ru",
  "anufrienko.pol@yandex.ru",
  "arkadiy.kasparov.90@mail.ru",
  "artcheh@rambler.ru",
  "a.artser@mail.ru",
  "katetor1701@gmail.com",
  "olegulybkin@gmail.ru",
  "tkacheva.yli@gmail.com",
  "ruslanbergaliev2005@gmail.com",
  "lesenok1808@yandex.ru",
  "v.dildina.l@mail.ru",
  "viktoriaosadcenko503@gmail.com",
  "nataliyavysockaya@yandex.ru",
  "slavamidone@gmail.com",
  "svetagazduk@gmail.com",
  "gladkova9749@yandex.ru",
  "ekgolovacheva@gmail.com",
  "promarivirus@yandex.ru",
  "gulmirad0703@gmail.com",
  "artxah0@gmail.com",
  "goga6171@gmail.com",
  "sda7634@mail.ru",
  "teqqquilala@gmail.com",
  "markizoo@mail.ru",
  "kent81@list.ru",
  "saharkov1@mail.ru",
  "elena.melihova@inbox.ru",
  "Boss.akella@mail.ru",
  "Novokshchenova18@yandex.ru",
  "belozerovakatw@gmail.com",
  "timurbisinov@yandex.ru",
  "89880134175@yandex.ru",
  "denisenckoelena@yandex.ru",
  "elena.culig@yandex.ru",
  "elenayudina1976g@gmail.com",
  "pevek79@mail.ru",
  "tigr74rak2806@mail.ru",
  "Undina34@gmail.com",
  "serbakovae807@gmail.com",
  "azotova96@yandex.ru",
  "irina2005mira@gmail.com",
  "kalinka95@mail.ru",
  "kamila.neskrebina@yandex.ru",
  "tsk1502@mail.ru",
  "koblikovae@yandex.ru",
  "katyaliashenko.ru@yandex.ru",
  "98rgh9wf@mail.ru",
  "kmalcef08031998@mail.ru",
  "zharovamarin@mal.ru",
  "mari.necaeva.808@mail.ru",
  "im690053@gmail.com",
  "Alexman8@mail.ru",
  "meshchaninov.e@gmail.com",
  "jingle_1@mail.ru",
  "2211md@bk.ru",
  "nadezlabogoduhova0766@gmail.ru",
  "nazarovalilita@gmail.com",
  "b_famiks@mail.ru",
  "b_fomiks@mail.ru",
  "enotik69690000@mail.ru",
  "yellow2381@mail.ru",
  "dash.schevtsova@yandex.ru",
  "hipirs932@yandex.ru",
  "KisellOf@yandex.ru",
  "nikita61rus91@mail.ru",
  "petrova21.68@mail.ru",
  "k0peika2009@gmail.com",
  "amon94@mail.ru",
  "ashiha927@gmail.com",
  "pdk1993@yandex.ru",
  "panzevaelena52@gmail.com",
  "lil27nik08@mail.ru",
  "tata197634@mail.ru",
  "7014713@mail.ru",
  "rena.kasumova@mail.ru",
  "aqua-web@mail.ru",
  "aqva-web@mail.ru",
  "rom.valiew2018@gmail.com",
  "aleksei_ri4agov@mail.ru",
  "ryazina7@gmail.com",
  "salenckokirill@yandex.ru",
  "fontogorou87@mail.ru",
  "srazvina99@gmail.com",
  "sveta9123@mail.ru",
  "guzhovsd@mail.ru",
  "Stas.semushkin.1999@mail.ru",
  "abdrashidov.vlg@gmail.com",
  "ser-serg008@mail.ru",
  "dlyavksani@gmail.com",
  "anna.skachkova@mail.ru",
  "skorikovaa2517@mail.ru",
  "a.spodenyuk18@mail.ru",
  "kinoworks@yandex.ru",
  "mihail.steimashchuk@gmail.com",
  "nsuwokina@gmail.com",
  "k.tten606@mail.ru",
  "Kitten606@mail.ru",
  "marina.teteryatnikova@list.ru",
  "anton.tishevsky@yandex.ru",
  "r.truxliaev@yandex.ru",
  "1alfff1@mail.ru",
  "kharitonov199308@gmail.com",
  "cxfcnmtvibltnb@mail.ru",
  "cxfcnmtvjbltnb@mail.ru",
  "zevs144@yandex.ru",
  "jul.voznaya@yandex.ru",
  "s-yuli@mail.ru",
  "iurii18vlasov@yandex.ru",
  "yuri.vorozhtcov1967@gmail.com",
  "mar.al.yakovenko@yandex.ru"
];


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
    console.log('Почт в интруме у актуальных сотрудников',emails.length); // Выводим массив email на консоль
    return emails;
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    throw error; // Пробрасываем ошибку выше для обработки
  }
}


async function fetchObject() {
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
    console.log('Почт в интруме в тот объекте',emails.length); // Выводим массив email на консоль
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
    let oldEmployeeStr = await fetchObject()
    // console.log(
    //   {
    //     idActualRaw:idActualRaw,
    //     oldEmployeeStr:oldEmployeeStr
    //   }
    // )

    const oldEmployee = oldEmployeeStr ? [
      ...new Set(oldEmployeeStr.map(email => email.toLowerCase().trim()))] : []; // Преобразуем в массив
      console.log("oldEmployee",oldEmployee.length)
    
      const emailActual = [
      ...new Set(idActualRaw.filter(email => email !== null).map(email => email.toLowerCase().trim())
      )];
      console.log("emailActual",emailActual.length)

    const deletedEmployee = [...oldEmployee].filter(email => !emailActual.includes(email));
    console.log("deletedEmployee",deletedEmployee.length)

    const newEmployee = emailActual.filter(email => !oldEmployee.includes(email));
    console.log("newEmployee",newEmployee.length)

    // Отправка запросов в API Skillspace для новых сотрудников
    const links = [
      // "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B1894%5D=14797",
      // "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B10026%5D=15478",
      // "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B7001%5D=14798",
      // "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B1896%5D=14799",
      // "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B1898%5D=14800",
      // "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B1968%5D=14801",
      // "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B1901%5D=2421",
      // "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B1970%5D=2427",
      //этот тестовый 
         "https://jivem-doma.skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B1901%5D=2421",
         "https://jivem-doma.skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B1968%5D=14801"
         // "https://skillspace.ru/api/open/v1/course/student-invite?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d&courses%5B32298%5D=48552"
    ];

    const emailWithError = []

    for (const email of newEmployee) {
      for (const link of links) {
        sendEmail(email, link, emailWithError);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    for (const email of emailWithError) {
      console.log({ emailWithError: emailWithError, status: 'Массив ошибочных повторная отправка пошла' })
      for (const link of links) {
        const encodedEmail = encodeURIComponent(email.trim());
        sendEmail(encodedEmail, link, emailWithError);
      }
    }

    // Отправка запросов в API Skillspace для удаления уволенных сотрудников
    const deleteLinks = [
      // "https://skillspace.ru/api/open/v1/course/1894/student-remove?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d",
      // "https://skillspace.ru/api/open/v1/course/10026/student-remove?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d",
      // "https://skillspace.ru/api/open/v1/course/7001/student-remove?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d",
      // "https://skillspace.ru/api/open/v1/course/1896/student-remove?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d",
      // "https://skillspace.ru/api/open/v1/course/1898/student-remove?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d",
      // "https://skillspace.ru/api/open/v1/course/1968/student-remove?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d",
      // "https://skillspace.ru/api/open/v1/course/1901/student-remove?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d",
      // "https://skillspace.ru/api/open/v1/course/1970/student-remove?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d",
      //этот тестовый 
      "https://jivem-doma.skillspace.ru/api/open/v1/course/1901/student-remove?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d",
      "https://jivem-doma.skillspace.ru/api/open/v1/course/1968/student-remove?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d"
      // "https://skillspace.ru/api/open/v1/course/32298/student-remove?token=3f69a76b-368a-344f-9a8d-d2c5ac7ab23d"
    ];

    for (const email of deletedEmployee) {
      for (const link of deleteLinks) {
        try {
          const encodedEmail = encodeURIComponent(email.trim());
          const response = await axios.get(`${link}&email=${encodedEmail}`);
          console.log(`Email ${email} успешно удален с курса.`);
          console.log(response.data);
        } catch (error) {
          console.error(`Ошибка при удалении email ${email}: ${error}`);
        }
      }
    }

    // Обновление данных в CRM
    const emailActualStr = emailActual.join(",");
    console.log({ sendOnField: emailActualStr,length:emailActual.length})

    const params3 = new URLSearchParams();
    params3.append("apikey", "9a75fc323d968db797ec0ab848572aad");
    params3.append("params[0][id]", "615900");
    params3.append("params[0][fields][0][id]", "3668");
    params3.append("params[0][fields][0][value]", emailActualStr);

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