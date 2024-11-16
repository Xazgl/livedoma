const axios = require('axios').default

async function getDistrictFromAddress(address) {
    const apiKey = 'cec34cf8-8380-4078-b0f0-b2437defbe32';
    const geocodeUrl = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${encodeURIComponent(address)}`;

    try {
        // Первый запрос для получения координат по адресу
        const geocodeResponse = await axios.get(geocodeUrl);
        const geocodeData = geocodeResponse.data;

        if (!geocodeData.response.GeoObjectCollection.featureMember.length) {
            throw new Error('Address not found');
        }

        // Получаем координаты
        const point = geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
        const [lon, lat] = point.split(' ');

        // Второй запрос для обратного геокодирования координат
        const reverseGeocodeUrl = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${lon},${lat}`;
        const reverseGeocodeResponse = await axios.get(reverseGeocodeUrl);
        const reverseGeocodeData = reverseGeocodeResponse.data;

        // Поиск района в ответе
        const featureMembers = reverseGeocodeData.response.GeoObjectCollection.featureMember;
        for (const featureMember of featureMembers) {
            const components = featureMember.GeoObject.metaDataProperty.GeocoderMetaData.Address.Components;
            for (const component of components) {
                if (component.kind === 'district') {
                    return component.name;
                }
            }
        }

        return 'District not found';
    } catch (error) {
        console.error('Error:', error);
        return 'Error retrieving district';
    }
}

function findDistrict(description) {
    // Определяем корни слов для районов
    const districts = {
        "Тракторозаводской": "Тракторозаводск",
        "Краснооктябрьский": "Краснооктябрьск",
        "Дзержинский": "Дзержинск",
        "Центральный": "Центральн",
        "Ворошиловский": "Ворошиловск",
        "Советский": "Советск",
        "Кировский": "Кировск",
        "Красноармейский": "Красноармейск"
    };

    // Перебираем все районы и ищем совпадения по корням
    for (const [district, root] of Object.entries(districts)) {
        const regex = new RegExp(root, "i"); // регулярное выражение для поиска корня, игнорируя регистр
        if (regex.test(description)) {
            return district;
        }
    }

    return "Не указан";
}
module.exports = {
    getDistrictFromAddress: getDistrictFromAddress,
    findDistrict:findDistrict
};


//   // Пример использования
//   getDistrictFromAddress('Волгоград Титова 53')
//     .then(district => console.log('District:', district))
//     .catch(error => console.error(error));
