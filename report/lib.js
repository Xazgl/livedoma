//@ts-check

const axios = require('axios').default
const { AxiosError } = require("axios");


const managers = [
  { name: "Сторожук", id: "1385" },
  { name: "Тест Тестович", id: "1676" },
  { name: "Елфимова", id: "2146" },
  { name: "Трубачева", id: "1460" },
  { name: "Политов", id: "391" },
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
  { name: "Выходцева", id: "1944" },
  { name: "Исаева", id: "39" },
  { name: "Василевская-Руцкая", id: "2019" },
  { name: "Костенко Андрей", id: "1737" },
  { name: "Гегечкори *", id: "2456" },
  { name: "Жучкова", id: "1693" },
  { name: "Федоренко", id: "1718" },
  { name: "Михеева", id: "2220" },
  { name: "Сафонова", id: "309" },
  { name: "Хрищатова", id: "1584" },
  { name: "Минхазова*", id: "2450" },
  { name: "Луцевич", id: "571" },
  { name: "Cакович*", id: "2275" },
  { name: "Княжева", id: "1243" },
  { name: "Бабенко*", id: "1849" },
  { name: "Шепилов", id: "44" },
  { name: "Игнатова", id: "964" },
  { name: "Тихомиров", id: "123" }
];

async function foundName(id) {
  if (id !== '0' && id !== 0 && id !== undefined && id !== null && id !== '2109' ) {

    // Проверяем, существует ли ID в массиве managers
    const manager = managers.find(manager => manager.id === id);
    if (manager) {
      return manager.surname ? manager.surname : manager.name;
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

        console.log(response.data.data[id])
        // Проверяем, существует ли response.data.data и response.data.data[id]
        if (response.data && response.data.data && response.data.data[id] && response.data.lenght > 0) {
          const person = response.data.data[id];
          return person.surname ? person.surname : person.name;
        } else {
          console.error(`Данные не найдены для id ${id}`);
          return `Сбой Intrum сотрудник https://jivemdoma.intrumnet.com/crm/tools/#UserProfile-${id}`;
        }
      } catch (error) {
        console.error(`Ошибка при выполнении запроса у ${id}:`, error);
        throw error; // Пробрасываем ошибку выше для обработки
      }
    }
  } else {
    return 'Нет';
  }
}

module.exports = {
  foundName: foundName,
};