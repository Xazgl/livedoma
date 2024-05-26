const axios = require('axios').default
const { PrismaClient } = require("@prisma/client");
const { AxiosError } = require("axios");
const db = new PrismaClient()

async function start() {

    // Функция для нормализации адресов
    const normalizeAddress = (address) => {
        return address.toLowerCase().replace(/[.,]/g, '').trim();
    };


    const objects = [
        { objectId: 828793, address: 'Ополченская 22', responsible: 'Федоренко Надежда', rooms: 3, floor: 4 }
        ,
        { objectId: 828793, address: 'Ополченская 65', responsible: 'Федоренко Надежда', rooms: 3, floor: 4 }
        ,
        { objectId: 828184, address: '40 лет Победы 10', responsible: 'Небыкова Светлана', rooms: 2, floor: 2 }
    ]

    let results = [];

    for (const obj of objects) {
        const address = obj.address; // Преобразуем в строку, если адрес существует
        const normalizedAddress = normalizeAddress(address.replace(/\d+/g, '').trim()) // Удаление чисел из адреса


        if (address) {
            const foundObjects = await db.inparseObjects.findMany({
                where: {
                    OR: [
                        {
                            address: {
                                contains: normalizedAddress,
                                mode: "insensitive", // Регистронезависимый поиск
                            },
                        },
                        {
                            address: {
                                contains: normalizedAddress.split(",")[0], // поиск по улице
                                mode: "insensitive",
                            },
                        },
                    ],
                },
            });
            const currentObjects = {
                address:obj.address,
                objects:foundObjects
            }
            results.push(currentObjects)

            // foundObjects.map((el) => results.push(el));
            // Сверяем найденные объекты с исходными адресами


            // let found = []
            // for (const foundObject of foundObjects) {
            //     const foundAddress = foundObject.address.replace(/\d+/g, '').trim();
            //     if (foundAddress === address) {
            //         found.push(foundObject)
            //         results.push(foundObject);
            //     }
            // }
            // if (found.length < 2) {
            //     // Получаем все адреса из найденных объектов
            //     const allAddresses = foundObjects.map(obj => obj.address.replace(/\d+/g, '').trim());

            //     // Сортируем адреса по расстоянию от исходного
            //     allAddresses.sort((a, b) => {
            //         const distanceA = Math.abs(address.length - a.length);
            //         const distanceB = Math.abs(address.length - b.length);
            //         return distanceA - distanceB;
            //     });

            //     // Выбираем ближайшие 10 адресов
            //     const closestAddresses = allAddresses.slice(0, 10);

            //     // Выводим ближайшие адреса
            //     console.log("Ближайшие адреса:", closestAddresses);

            //     // Добавляем ближайшие объекты в результаты
            //     closestAddresses.forEach(closestAddress => {
            //         const closestObjects = foundObjects.filter(obj => obj.address.includes(closestAddress));
            //         results.push(...closestObjects);
            //     });
            // }
        }
    }
    console.log(results)
}


start()