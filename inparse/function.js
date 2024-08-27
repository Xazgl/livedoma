const data = [
    { "id": '1', "title": "1-к квартира", "typeId": 2, "sectionId": 1 },
    { "id": '2', "title": "2-к квартира", "typeId": 2, "sectionId": 1 },
    { "id": '3', "title": "3-к квартира", "typeId": 2, "sectionId": 1 },
    { "id": '4', "title": "4+ к квартира", "typeId": 2, "sectionId": 1 },
    { "id": '5', "title": "Комната", "typeId": 2, "sectionId": 1 },
    { "id": '15', "title": "Офис", "typeId": 2, "sectionId": 4 },
    { "id": '16', "title": "Торговое помещение", "typeId": 2, "sectionId": 4 },
    { "id": '17', "title": "Склад", "typeId": 2, "sectionId": 4 },
    { "id": '18', "title": "Производственное помещение", "typeId": 2, "sectionId": 4 },
    { "id": '19', "title": "Помещение свободного назначения", "typeId": 2, "sectionId": 4 },
    { "id": '22', "title": "Коммерческая земля", "typeId": 2, "sectionId": 4 },
    { "id": '23', "title": "Дача", "typeId": 2, "sectionId": 5 },
    { "id": '24', "title": "Дом/Коттедж", "typeId": 2, "sectionId": 5 },
    { "id": '25', "title": "Часть дома", "typeId": 2, "sectionId": 5 },
    { "id": '26', "title": "Таунхаус", "typeId": 2, "sectionId": 5 },
    { "id": '27', "title": "Земельный участок", "typeId": 2, "sectionId": 5 },
    { "id": '28', "title": "1-к квартира", "typeId": 1, "sectionId": 6 },
    { "id": '29', "title": "2-к квартира", "typeId": 1, "sectionId": 6 },
    { "id": '30', "title": "3-к квартира", "typeId": 1, "sectionId": 6 },
    { "id": '31', "title": "4+ к квартира", "typeId": 1, "sectionId": 6 },
    { "id": '32', "title": "Комната", "typeId": 1, "sectionId": 6 },
    { "id": '35', "title": "Офис", "typeId": 1, "sectionId": 7 },
    { "id": '36', "title": "Торговое помещение", "typeId": 1, "sectionId": 7 },
    { "id": '37', "title": "Склад", "typeId": 1, "sectionId": 7 },
    { "id": '38', "title": "Производственное помещение", "typeId": 1, "sectionId": 7 },
    { "id": '39', "title": "Помещение свободного назначения", "typeId": 1, "sectionId": 7 },
    { "id": '42', "title": "Коммерческая земля", "typeId": 1, "sectionId": 7 },
    { "id": '43', "title": "Дача", "typeId": 1, "sectionId": 8 },
    { "id": '44', "title": "Дом/Коттедж", "typeId": 1, "sectionId": 8 },
    { "id": '45', "title": "Часть дома", "typeId": 1, "sectionId": 8 },
    { "id": '46', "title": "Таунхаус", "typeId": 1, "sectionId": 8 },
    { "id": '47', "title": "Студия", "typeId": 1, "sectionId": 6 },
    { "id": '48', "title": "Студия", "typeId": 2, "sectionId": 1 },
    { "id": '49', "title": "Здание", "typeId": 2, "sectionId": 4 },
    { "id": '50', "title": "Здание", "typeId": 1, "sectionId": 7 },
    { "id": '51', "title": "Общепит", "typeId": 2, "sectionId": 4 },
    { "id": '52', "title": "Общепит", "typeId": 1, "sectionId": 7 },
    { "id": '53', "title": "Гостиница", "typeId": 2, "sectionId": 4 },
    { "id": '54', "title": "Гостиница", "typeId": 1, "sectionId": 7 },
    { "id": '55', "title": "Автосервис", "typeId": 2, "sectionId": 4 },
    { "id": '56', "title": "Автосервис", "typeId": 1, "sectionId": 7 },
    { "id": '57', "title": "Гараж", "typeId": 2, "sectionId": 9 },
    { "id": '58', "title": "Гараж", "typeId": 1, "sectionId": 10 },
    { "id": '59', "title": "Машиноместо", "typeId": 2, "sectionId": 9 },
    { "id": '60', "title": "Машиноместо", "typeId": 1, "sectionId": 10 },
    { "id": '61', "title": "Бокс", "typeId": 2, "sectionId": 9 },
    { "id": '62', "title": "Бокс", "typeId": 1, "sectionId": 10 }
];


function getInparseCategory(id) {
    const answer = data.find(item => item.id === id);
    return answer?.title;
}


function formatISODate(isoDateString) {
    // Создаем объект Date из строки
    const date = new Date(isoDateString);

    // Получаем компоненты даты и времени
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    // Форматируем в строку
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


module.exports = {
    getInparseCategory: getInparseCategory,
    formatISODate: formatISODate
};