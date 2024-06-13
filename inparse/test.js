// const axios = require('axios').default
// const { PrismaClient } = require("@prisma/client");
// const { AxiosError } = require("axios");
// const db = new PrismaClient()

// async function start() {

//     // Функция для нормализации адресов
//     const normalizeAddress = (address) => {
//         return address.toLowerCase().replace(/[.,]/g, '').trim();
//     };


//     const objects = [
//         { objectId: 828793, address: 'Ополченская 22', responsible: 'Федоренко Надежда', rooms: 3, floor: 4 }
//         ,
//         { objectId: 828793, address: 'Ополченская 65', responsible: 'Федоренко Надежда', rooms: 3, floor: 4 }
//         ,
//         { objectId: 828184, address: '40 лет Победы 10', responsible: 'Небыкова Светлана', rooms: 2, floor: 2 }
//     ]

//     let results = [];

//     for (const obj of objects) {
//         const address = obj.address; // Преобразуем в строку, если адрес существует
//         const normalizedAddress = normalizeAddress(address.replace(/\d+/g, '').trim()) // Удаление чисел из адреса


//         if (address) {
//             const foundObjects = await db.inparseObjects.findMany({
//                 where: {
//                     OR: [
//                         {
//                             address: {
//                                 contains: normalizedAddress,
//                                 mode: "insensitive", // Регистронезависимый поиск
//                             },
//                         },
//                         {
//                             address: {
//                                 contains: normalizedAddress.split(",")[0], // поиск по улице
//                                 mode: "insensitive",
//                             },
//                         },
//                     ],
//                 },
//             });
//             const currentObjects = {
//                 address:obj.address,
//                 objects:foundObjects
//             }
//             results.push(currentObjects)

//             // foundObjects.map((el) => results.push(el));
//             // Сверяем найденные объекты с исходными адресами


//             // let found = []
//             // for (const foundObject of foundObjects) {
//             //     const foundAddress = foundObject.address.replace(/\d+/g, '').trim();
//             //     if (foundAddress === address) {
//             //         found.push(foundObject)
//             //         results.push(foundObject);
//             //     }
//             // }
//             // if (found.length < 2) {
//             //     // Получаем все адреса из найденных объектов
//             //     const allAddresses = foundObjects.map(obj => obj.address.replace(/\d+/g, '').trim());

//             //     // Сортируем адреса по расстоянию от исходного
//             //     allAddresses.sort((a, b) => {
//             //         const distanceA = Math.abs(address.length - a.length);
//             //         const distanceB = Math.abs(address.length - b.length);
//             //         return distanceA - distanceB;
//             //     });

//             //     // Выбираем ближайшие 10 адресов
//             //     const closestAddresses = allAddresses.slice(0, 10);

//             //     // Выводим ближайшие адреса
//             //     console.log("Ближайшие адреса:", closestAddresses);

//             //     // Добавляем ближайшие объекты в результаты
//             //     closestAddresses.forEach(closestAddress => {
//             //         const closestObjects = foundObjects.filter(obj => obj.address.includes(closestAddress));
//             //         results.push(...closestObjects);
//             //     });
//             // }
//         }
//     }
//     console.log(results)
// }


// start()


// // Функция для очистки и нормализации строки адреса с учетом сокращений и объединения цифр с буквами
// function cleanAddress(address) {
   
//     let cleanedAddress = address.toLowerCase().trim();

//     // Объединение цифр с последующими буквами
//     cleanedAddress = cleanedAddress.replace(/(\d)\s*([a-zA-Zа-яА-Я])/g, '$1$2');

//     // Удаление лишних символов
//     cleanedAddress = cleanedAddress.replace(/[^a-zA-Zа-яА-Я0-9\s]/g, '').trim();

//     // Логирование промежуточного результата
//     console.log(`Normalized address: ${cleanedAddress}`);

//     return cleanedAddress;
// }

// // Функция для проверки совпадения адресов
// function isExactMatchNew(address1, searchAddress) {
//     const cleanedAddress1 = cleanAddress(address1);
//     const cleanedAddress2 = cleanAddress(searchAddress);

//     // Проверка, что все части cleanedAddress2 присутствуют в cleanedAddress1
//     return cleanedAddress2.split(/\s+/).every(part => cleanedAddress1.includes(part));
// }

// // Пример использования
// const address1 = 'Волгоградская область, Волжский, улица Мира, 142 а';
// const address2 = 'Волгоградская область, Волжский, Волгоградская обл., ул. Мира, 142А';
// const searchAddress = 'Мира 142';

// console.log(isExactMatchNew(address1, searchAddress)); // true
// console.log(isExactMatchNew(address2, searchAddress)); // true


function cleanAddress(address) {
    let cleanedAddress = address.toLowerCase().trim();

    // Объединение цифр с последующими буквами и удаление лишних символов
    cleanedAddress = cleanedAddress.replace(/(\d)\s*([a-zA-Zа-яА-Я])/g, '$1$2');
    cleanedAddress = cleanedAddress.replace(/[^a-zA-Zа-яА-Я0-9\s]/g, '').trim();

    // Логирование промежуточного результата
    console.log(`Normalized address: ${cleanedAddress}`);

    return cleanedAddress;
}

function isExactMatchNew(address1, searchAddress) {
    const cleanedAddress1 = cleanAddress(address1);
    const cleanedAddress2 = cleanAddress(searchAddress);

    // Разделение на части для точного сравнения
    const parts1 = cleanedAddress1.split(/\s+/);
    const parts2 = cleanedAddress2.split(/\s+/);

    // Проверка наличия всех частей searchAddress в address1
    let match = true;
    for (let part of parts2) {
        if (!parts1.includes(part)) {
            match = false;
            break;
        }
    }

    // Проверка точного совпадения номеров домов с буквенными суффиксами
    const numberParts1 = cleanedAddress1.match(/\d+[a-zA-Zа-яА-Я]?/g) || [];
    const numberParts2 = cleanedAddress2.match(/\d+[a-zA-Zа-яА-Я]?/g) || [];
    
    for (let part of numberParts2) {
        if (!numberParts1.includes(part)) {
            match = false;
            break;
        }
    }

    return match;
}

// Пример использования
const address1 = 'Волгоградская область, Волжский, улица Мира, 142 а';
const address2 = 'Волгоградская область, Волжский, Волгоградская обл., ул. Мира, 142';
const searchAddress = 'Мира 142 а';

console.log(isExactMatchNew(address1, searchAddress)); // true
console.log(isExactMatchNew(address2, searchAddress)); // true
