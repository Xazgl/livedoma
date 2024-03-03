
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

        for (const adObject of adsObjects) {
            let str = adObject.Address[0]
            // Разделяем строку по запятой и удаляем лишние пробелы
            let parts = str.split(',').map(part => part.trim());
            // Извлекаем нужные элементы
            let state = parts[1];
            let city = parts[2];
            let street = parts.slice(3).join(', '); // Объединяем элементы начиная с индекса 3 через запятую

            const findObject = await db.test.findUnique({
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

                    const newAdObject = await db.test.create({
                        data: {
                            id_intrum: String(adObject.Id[0]),
                            category: String(adObject.Category[0]),
                            operationType: String(adObject.OperationType[0]),
                            state: state ? state : "Не указан",
                            city: city ? city : 'Не указан',
                            street: street ? street : 'Не указана',
                            price: adObject.Price ? Number(adObject.Price[0]) : 0,
                            companyName: adObject.CompanyName ? String(adObject.CompanyName[0]) : "АН Живем дома",
                            managerName: adObject.ManagerName ? String(adObject.ManagerName[0]) : "Живем Дома",
                            description: adObject.Description ? String(adObject.Description[0]) : '',
                            balconyOrLoggia: adObject.BalconyOrLoggia && adObject.BalconyOrLoggia.length > 0 ? String(adObject.BalconyOrLoggia[0]) : "Без балкона и лоджий",
                            passengerElevator: adObject.PassengerElevator ? String(adObject.PassengerElevator[0]) : '',
                            freightElevator: adObject.FreightElevator ? String(adObject.FreightElevator[0]) : '',
                            ceilingHeight: adObject.CeilingHeight ? String(adObject.CeilingHeight[0]) : '',
                            renovation: adObject.Renovation ? String(adObject.Renovation[0]) : '',
                            bathroomMulti: adObject.BathroomMulti ? String(adObject.BathroomMulti[0].Option[0]) : '',
                            dealType: adObject.DealType ? String(adObject.DealType[0]) : '',
                            roomType: ['test', 'test'],
                            saleOptions:  ['test', 'test'],
                            phone: adObject.ContactPhone ? String(adObject.ContactPhone[0]) : "",
                            img: {
                                set: cleanLinks
                            },
                            rooms: adObject.Rooms ? String(adObject.Rooms[0]) : '',
                            square: adObject.Square ? String(adObject.Square[0]) : '',
                            floors: adObject.Floors ? String(adObject.Floors[0]) : '',
                            floor: adObject.Floor ? String(adObject.Floor[0]) : 'df',
                            wallsType: adObject.WallsType ? String(adObject.WallsType[0]) : 'Не указан',
                            propertyRights: adObject.PropertyRights ? String(adObject.PropertyRights[0]) : '',
                            objectType: adObject.ObjectType ? String(adObject.ObjectType[0]) : '',
                            transactionType: adObject.transactionType ? (adObject.transactionType[0]) : '',

                            // //Если дом
                            // landArea: adObject.LandAre ? String(adObject.LandArea[0]) : '',
                            // houseServices: {
                            //     set: (adObject.SaleOptions[0])
                            // },
                            // // cadastralNumber: adObject.CadastralNumber ? String(adObject.CadastralNumber[0]) : '',
                            // cadastralNumber: '',

                            // //Для коммерческой
                            // parkingType: adObject.ParkingType ? (adObject.ParkingType[0]) : '',
                            // rentalType: adObject.RentalType ? (adObject.RentalType[0]) : '',
                            // decoration: adObject.Decoration ? (adObject.Decoration[0]) : '',
                            // leaseCommissionSize: adObject.LeaseCommissionSize ? (adObject.LeaseCommissionSize[0]) : '',
                            // leaseDeposit: adObject.LeaseDeposit ? (adObject.LeaseDeposit[0]) : '',
                        }
                    })

                    console.log(newAdObject)
                } catch (error) {
                    console.error(error)
                    console.log(adObject.Id[0] + ' ' + parts)
                }
            } else {
                // console.log(car);
            }
        }
        // await wait(5000)
    } catch (error) {
        console.error(error)
    }
}


start()



















// //@ts-check

// const { PrismaClient } = require("@prisma/client");
// const { AxiosError } = require("axios");
// const fs = require('fs/promises');
// const wait = require('timers/promises').setTimeout
// const path = require("path");
// const xml2js = require('xml2js')

// const cbrLinks = [ "http://www.cbr.ru/scripts/XML_daily.asp?date_req=02/03/2002"] //ссылка на файлы от Макспостера
// const axios = require('axios').default

// const db = new PrismaClient()
// const parser = new xml2js.Parser()


// async function start() {
//     try {
//         /**
//          * @type {import('./valute').Valute[] }
//          */
//         const valutes = (await Promise.all(cbrLinks.map(async (cbrLink) => {
//             try {
//                 const res = await axios.get(cbrLink)
//                 const xml = await parser.parseStringPromise(res.data)
//                 //  if(xml.valutes.length > 0) {
//                 // console.log(`ответ ${(xml.valutes.valute)}`)
//                 return xml?.ValCurs?.Valute || []; // возвращаем пустой массив, если нет данных
//             } catch (error) {
//                 if (error instanceof AxiosError) {
//                     console.error(error.code + ': ' + error.message)
//                     // logger.error(error.toJSON())
//                 }
//                 return [];
//             }
//         }))).filter(veh => veh !== null).flat()
//         for (const valute of valutes) {
//             console.log(JSON.stringify(valute.Name[0]))
//             const valuteDb = await db.exchangeRate.findUnique({
//                 where: {
//                     id: valute['$'].ID,
//                 }
//             })
//             if (valuteDb === null) {
//                 try {
//                     const newValute = await db.exchangeRate.create({
//                         data: {
//                             id: valute['$'].ID,
//                             value: valute.Value[0],
//                             nominal:valute.Nominal[0],
//                             name:valute.Name[0],
//                             charCode:valute.CharCode[0],

//                         }
//                     })

//                     console.log(newValute)
//                 } catch (error) {
//                     console.error(error)
//                     // console.log('VIN: ' + valute.name[0])
//                 }
//             } else {
//                 // console.log(car);
//             }
//         }

//         await wait(5000)
//     } catch (error) {
//         console.error(error)
//     }
// }


// start()

