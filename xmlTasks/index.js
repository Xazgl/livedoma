//@ts-check

const { PrismaClient } = require("@prisma/client");
const { AxiosError } = require("axios");
const fs = require('fs/promises');
const wait = require('timers/promises').setTimeout
const path = require("path");
const xml2js = require('xml2js')

const objectLinks = require('./links.json') || [] //массив ссылок на фиды
const axios = require('axios').default

const db = new PrismaClient()
const parser = new xml2js.Parser()


async function start() {
    try {
        /**
       
         */
        const adsObjects = (await Promise.all(objectLinks.map(async (objectLink) => {
            try {
                const res = await axios.get(objectLink)
                const xml = await parser.parseStringPromise(res.data)
                //  if(xml.adsObjects.length > 0) {
                // console.log(`ответ ${(xml.adsObjects.adObject)}`)
                return xml?.Ads?.Ad || []; // возвращаем пустой массив, если нет данных          
            } catch (error) {
                if (error instanceof AxiosError) {
                    console.error(error.code + ': ' + error.message)
                    // logger.error(error.toJSON())
                }
                return [];
            }
        }))).filter(ad => ad !== null).flat()

         // Получаем все объекты из базы данных
         const dbObjects = await db.objectIntrum.findMany();
         // Получаем идентификаторы объектов из базы данных
         const dbObjectIds = dbObjects.map(obj => obj.id_intrum);
         // Получаем идентификаторы объектов из XML-файлов
         const xmlObjectIds = adsObjects.map(obj => obj.Id[0]);
 
         // Удаляем объекты из базы данных, которых нет в XML-файлах
         const objectsToDelete = dbObjectIds.filter(id => !xmlObjectIds.includes(id));
         await Promise.all(objectsToDelete.map(async (id) => {
             await db.objectIntrum.delete({
                 where: {
                     id_intrum: id
                 }
             });
             console.log(`Объект удален из базы с  ${id}  т.к. он не найден в фиде`);
         }));

        for (const adObject of adsObjects) {
            let str = adObject.Address[0]
            // Разделяем строку по запятой и удаляем лишние пробелы
            let parts = str.split(',').map(part => part.trim());
            // Извлекаем нужные элементы
            let state = parts[1];
            let city = parts[2];
            let street = parts.slice(3).join(', '); // Объединяем элементы начиная с индекса 3 через запятую

            const findObject = await db.objectIntrum.findUnique({
                where: {
                    id_intrum: adObject.Id[0],
                }
            })
            //  console.log(JSON.stringify(adObject.RoomType[0].Option[0]))


            if (findObject === null) {
                try {
                    // console.log(JSON.stringify(adObject.BalconyOrLoggia[0] + adObject.WallsType[0]))

                    const cleanLinks = adObject.Images[0].Image.map(image => image.$.url);
                    // console.log(JSON.stringify(cleanLinks))

                    const roomArr = adObject.RoomType ? adObject.RoomType.map(room => room.Option[0]) : []
                    console.log(roomArr)
                    const saleArr = adObject.SaleOptions ? adObject.SaleOptions.map(saleOpt => saleOpt.Option[0]) : []
                    console.log(JSON.stringify(saleArr))
                    const houseServicesArr = adObject.SaleOptions ? adObject.SaleOptions.map(saleOpt => saleOpt.Option[0]) : []
                    console.log(JSON.stringify(houseServicesArr))



                    const newAdObject = await db.objectIntrum.create({
                        data: {
                            id_intrum: String(adObject.Id[0]),
                            category: String(adObject.Category[0]),
                            operationType: String(adObject.OperationType[0]),
                            state: state ? state : "Не указан",
                            city: city ? city : 'Не указан',
                            street: street ? street : 'Не указана',
                            price: adObject.Price ? Number(adObject.Price[0]) : 0,
                            companyName: adObject.CompanyName ?
                                (adObject.CompanyName[0] === "Живем дома" || adObject.CompanyName[0] === "АН Живем дома" ? "Живем дома" : adObject.CompanyName[0])
                                : "Владис",

                            // companyName: adObject.CompanyName ? String(adObject.CompanyName[0]) : "Владис",
                            managerName: adObject.ManagerName ? String(adObject.ManagerName[0]) : "Живем Дома",
                            description: adObject.Description ? String(adObject.Description[0]) : '',
                            balconyOrLoggia: adObject.BalconyOrLoggia && adObject.BalconyOrLoggia.length > 0 ? String(adObject.BalconyOrLoggia[0]) : "Без балкона и лоджий",
                            passengerElevator: adObject.PassengerElevator ? String(adObject.PassengerElevator[0]) : '',
                            freightElevator: adObject.FreightElevator ? String(adObject.FreightElevator[0]) : '',
                            ceilingHeight: adObject.CeilingHeight ? String(adObject.CeilingHeight[0]) : '',
                            renovation: adObject.Renovation ? String(adObject.Renovation[0]) : '',
                            bathroomMulti: adObject.BathroomMulti ? String(adObject.BathroomMulti[0].Option[0]) : '',
                            dealType: adObject.DealType ? String(adObject.DealType[0]) : '',
                            roomType: roomArr,
                            saleOptions: saleArr,
                            phone: adObject.ContactPhone ? String(adObject.ContactPhone[0]) : "",
                            img: {
                                set: cleanLinks
                            },
                            rooms: adObject.Rooms ? String(adObject.Rooms[0]) : '',
                            square: adObject.Square ? String(adObject.Square[0]) : '',
                            floors: adObject.Floors ? String(adObject.Floors[0]) : '',
                            floor: adObject.Floor ? String(adObject.Floor[0]) : '',
                            wallsType: adObject.WallsType ? String(adObject.WallsType[0]) : 'Не указан',
                            propertyRights: adObject.PropertyRights ? String(adObject.PropertyRights[0]) : '',
                            objectType: adObject.ObjectType ? String(adObject.ObjectType[0]) : '',
                            transactionType: adObject.transactionType ? (adObject.transactionType[0]) : '',

                            //Если дом
                            landArea: adObject.LandAre ? String(adObject.LandArea[0]) : '',
                            houseServices: houseServicesArr,
                            // cadastralNumber: adObject.CadastralNumber ? String(adObject.CadastralNumber[0]) : '',
                            cadastralNumber: '',

                            //Для коммерческой
                            parkingType: adObject.ParkingType ? (adObject.ParkingType[0]) : '',
                            rentalType: adObject.RentalType ? (adObject.RentalType[0]) : '',
                            decoration: adObject.Decoration ? (adObject.Decoration[0]) : '',
                            leaseCommissionSize: adObject.LeaseCommissionSize ? (adObject.LeaseCommissionSize[0]) : '',
                            leaseDeposit: adObject.LeaseDeposit ? (adObject.LeaseDeposit[0]) : '',
                        }
                    })

                    console.log(newAdObject)
                } catch (error) {
                    console.error(error)
                    console.log(adObject.Id[0] + ' ' + parts)
                }
            } else {
                const cleanLinks = adObject.Images[0].Image.map(image => image.$.url);
                const updateUser = await db.objectIntrum.update({
                    where: {
                        id_intrum: adObject.Id[0],
                    },
                    data: {
                        img: {
                            set: cleanLinks
                        },
                    },
                })
            
            }
        }
        // await wait(5000)
    } catch (error) {
        console.error(error)
    }
}


start()