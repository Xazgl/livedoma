const Fuse = require('fuse.js');

// Пример данных
const addresses = [
    'Волгоградская область, Волжский, улица Мира, 142А',
    'Волгоградская область, Волжский, Волгоградская обл., ул. Мира, 142А',
    'Московская область, Москва, ул. Тверская, 7',
    'Санкт-Петербург, Невский проспект, 28'
];

// Адрес для поиска
const searchAddress = 'Мира 142 А';

function cleanAddress(address) {
    return address.toLowerCase()
        .replace(/[.,]/g, '') // Удаление точек и запятых
        .replace(/[^a-zA-Zа-яА-Я0-9\s]/g, '') // Удаление всех символов, кроме букв, цифр и пробелов
        .replace(/\s+/g, ' ') // Замена множественных пробелов на один пробел
        .trim(); // Удаление лишних пробелов в начале и в конце строки
}

async function start(searchAddress, addresses) {
    // Очистка и нормализация адресов
    const normalizedAddresses = addresses.map(address => ({
        original: address,
        normalized: cleanAddress(address)
    }));

    // Очистка и нормализация адреса для поиска
    const normalizedSearchAddress = cleanAddress(searchAddress).replace(/(\d)\s*([a-zа-я])/gi, '$1$2') // Объединение цифр с последующими буквами;

    // Настройки Fuse.js
    const options = {
        includeScore: true,
        threshold: 0.3, // Настройка для более точных совпадений
        keys: ['normalized'] // Поле, по которому будет производиться поиск
    };

    // Подготовка данных
    const fuse = new Fuse(normalizedAddresses, options);

    // Поиск совпадений
    const result = fuse.search(normalizedSearchAddress);

    // Вывод результатов
    if (result.length > 0) {
        result.forEach(({ item, score }) => {
            console.log(`Адрес: ${item.original}, Рейтинг совпадения: ${score}`);
        });
    } else {
        console.log('Совпадений не найдено.');
    }
}

start(searchAddress, addresses);
