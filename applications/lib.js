//@ts-check

const axios = require('axios').default
const { AxiosError } = require("axios");

const managers = [
  { name: "Сторожук", id: "1385" },
  { name: "Тест Тестович", id: "1676" },
  { name: "Елфимова", id: "2146" },
  { name: "Трубачева", id: "1460" },
  { name: "Политов", id: "391" },
  { name: "Максимова", id: "332" },
  { name: "Бочарникова", id: "1767" },
  { name: "Трофимов", id: "1140" },
  { name: "Бородина", id: "353" },
  { name: "Выходцева", id: "1944" },
  { name: "Грубляк", id: "1829" },
  { name: "Ефремов", id: "1827" },
  { name: "Костенко", id: "1793" },
  { name: "Мартынов", id: "214" },
  { name: "Найданова", id: "190" },
  { name: "Петрова", id: "215" },
  { name: "Попова", id: "1618" },
  { name: "Рубан", id: "1857" },
  { name: "Ткачева", id: "35" },
  { name: "Чеботарева", id: "1232" },
  { name: "Меньшова", id: "230" },
  { name: "Выходцева", id: "1944" },
  { name: "Исаева", id: "39" },
  { name: "Василевская", id: "2019" },
  { name: "Костенко", id: "1737" },
  { name: "Гегечкори", id: "2456" },
  { name: "Жучкова", id: "1693" },
  { name: "Федоренко", id: "1718" },
  { name: "Михеева", id: "2220" },
  { name: "Сафонова", id: "309" },
  { name: "Хрищатова", id: "1584" },
  { name: "Минхазова", id: "2450" },
  { name: "Луцевич", id: "571" },
  { name: "Cакович", id: "2275" },
  { name: "Княжева", id: "1243" },
  { name: "Бабенко", id: "1849" },
  { name: "Шепилов", id: "44" },
  { name: "Игнатова", id: "964" },
  { name: "Тихомиров", id: "123" },
  { name: "Ефремов", id: "13" },
  { name: "Мухина", id: "2354" },
  { name: "Храмых", id: "2251" },
  { name: "Разуваева", id: "1526" },
  { name: "Калинин", id: "2434" },
  { name: "Петрухин", id: "2417" },
  { name: "Ломакин", id: "2447" },
  { name: "Кабулова", id: "2588" },
  { name: "Москвина", id: "2466" },
  { name: "Завьялова", id: "2262" },
  { name: "Татарикова", id: "2502" },
  { name: "Питаева", id: "2535" },
];

async function foundName(id) {
  if (id !== '0' && id !== 0 && id !== undefined && id !== null && id !== '2109') {
    // Проверяем, ID в массиве managers
    const manager = managers.find(manager => manager.id === id);
    if (manager) {
      return manager.surname ?
        manager.surname == 'Костенко' ? `${manager.surname} ${manager.name}`
          : manager.surname : manager.name;
    } else {

      const params = new URLSearchParams();
      params.append("apikey", "9a75fc323d968db797ec0ab848572aad");
      params.append("params[id][0]", id);

      try {
        const response = await axios.post('http://jivemdoma.intrumnet.com:81/sharedapi/worker/filter',
          params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        if (response.data && response.data.data && response.data.data[id] && response.data.length > 0) {
          const person = response.data.data[id];
          return person.surname ? person.surname : person.name;
        } else {
          console.error(`Данные не найдены для id ${id}, запрос ${response.data.data}. Запускаем 2 попытку`);       
          //Таймаут перед повторным запросом
          await new Promise(resolve => setTimeout(resolve, 100000));
          
          const responseTwo = await axios.post('http://jivemdoma.intrumnet.com:81/sharedapi/worker/filter',
            params, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });

          if (responseTwo.data && responseTwo.data.data && responseTwo.data.data[id] ) {
            const person = response.data.data[id];
            return person.surname ? person.surname : person.name;
          } else {
            return `Сбой ФИО Intrum https://jivemdoma.intrumnet.com/crm/tools/#UserProfile-${id}`;
          }
        }
      } catch (error) {
        console.error(`Ошибка при выполнении запроса у ${id}:`, error);
        throw error; 
      }
    }
  } else {
    return 'Нет';
  }
}



async function findPhone(customer_id) {
  const params = new URLSearchParams();
  params.append("apikey", "9a75fc323d968db797ec0ab848572aad");
  params.append("params[byid][0]", customer_id);
  try {
    const response = await axios.post('http://jivemdoma.intrumnet.com:81/sharedapi/purchaser/filter',
      params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    );
    if (response.data.status === "success" && response.data.data.list.length > 0) {
      const firstPhone = response.data.data.list[0].phone[0].phone;
      return firstPhone;
    } else {
      throw new Error("No phone number found");
    }
  } catch (error) {
    console.error("Error fetching phone number:", error);
    return null;
  }
}

module.exports = {
  foundName: foundName,
  findPhone: findPhone
};