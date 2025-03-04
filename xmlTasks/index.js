//@ts-check

const { PrismaClient } = require("@prisma/client");
const { AxiosError } = require("axios");
const fs = require('fs/promises');
const wait = require('timers/promises').setTimeout
const path = require("path");
const xml2js = require('xml2js')
const { getDistrictFromAddress,findDistrict } = require("./geocode");

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
            const compan = adObject.CompanyName? adObject.CompanyName[0].trim() : null;
            let companyNameStr = adObject.CompanyName ? (compan === "Живем дома" || compan === "АН Живем дома" || compan === "Живем Дома"  ) ? "Живем дома" : (compan == 'Партнер Недвижимость' || compan == 'Партнер' )? 'Партнер': (compan == 'Метры Недвижимость' || compan == 'Метры' )? 'Метры' :  compan : "Владис";
            let state = ''
            let city = ''
            let street = ''
            let str = adObject && adObject.Address  && adObject.Address[0]? adObject.Address[0] : ''
            if (companyNameStr !== 'Владис') {
                // Разделяем строку по запятой и удаляем лишние пробелы
                let parts = str.split(',').map(part => part.trim());
                // Извлекаем нужные элементы
                state = parts[1];
                city = parts[2];
                street = parts.slice(3).join(', '); // Объединяем элементы начиная с индекса 3 через запятую
            } else {
                let parts = str.split(',').map(part => part.trim());
                state = parts[1].trim();
                city = parts[1].trim();
                street = parts.slice(2).filter(Boolean).join(' ').trim();
            }

            const findObject = await db.objectIntrum.findUnique({
                where: {
                    id_intrum: adObject.Id[0],
                }
            })
            //  console.log(JSON.stringify(adObject.RoomType[0].Option[0]))

            function funcState(input) {
                const cityRoots = [
                    { root: "Волгоград", name: "Волгоградская область" },
                    { root: "Волж", name: "Волгоградская область" },
                    { root: "Краснодар", name: "Краснодарский край" },
                    { root: "Астрахан", name: "Астраханская область" }
                ];

                for (const city of cityRoots) {
                    if (input.includes(city.root)) {
                        return city.name;
                    }
                }

                return input;
            }


            function funcCity(input) {
                const cityRoots = [
                    { root: "Волгоград", name: "Волгоград" },
                    { root: "Волж", name: "Волжский" },
                    // { root: "Городищ", name: "Волг. обл. Городищенский" },
                    { root: "Фролов", name: "Фролово" },
                    { root: "ахтуб", name: "Среднеахтубинский" },
                    { root: "Елан", name: "Елань" },
                    { root: "Михайл", name: "Михайловка" },
                    { root: "Урюпинск", name: "Урюпинск" },
                    { root: "Калач", name: "Калач-на-Дону" },
                    // { root: "Новоникол", name: "Волг. обл. Новониколаевский" }
                ];

                for (const city of cityRoots) {
                    if (input.includes(city.root)) {
                        return city.name;
                    }
                }

                return input;
            }

            if (findObject === null) {
                try {
                    // console.log(JSON.stringify(adObject.BalconyOrLoggia[0] + adObject.WallsType[0]))
                    const cleanLinks = adObject.Images ? adObject.Images[0].Image.map(image => image.$.url) : [''];
                    // console.log(JSON.stringify(cleanLinks))
                    // console.log({cleanLinks, obj:adObject.Id[0] })
                    const roomArr = adObject.RoomType ? adObject.RoomType.map(room => room.Option[0]) : []
                    // console.log(roomArr)
                    const saleArr = adObject.SaleOptions ? adObject.SaleOptions.map(saleOpt => saleOpt.Option[0]) : []
                    // console.log(JSON.stringify(saleArr))
                    const houseServicesArr = adObject.SaleOptions ? adObject.SaleOptions.map(saleOpt => saleOpt.Option[0]) : []
                    // console.log(JSON.stringify(houseServicesArr))

                    const newAdObject = await db.objectIntrum.create({
                        data: {
                            id_intrum: String(adObject.Id[0]),
                            category: String(adObject.Category[0]),
                            operationType: String(adObject.OperationType[0]),
                            state: state ? funcState(state) : "Не указан",
                            city: city ? funcCity(city) : 'Не указан',
                            district: adObject.Description[0] && city == 'Волгоград'?  findDistrict(adObject.Description[0]) : 'Не указан',
                            // district: str? await getDistrictFromAddress(str) : 'Не указан',
                            street: street ? street : 'Не указана',
                            price: adObject.Price ? Number(adObject.Price[0]) : 0,
                            companyName: companyNameStr,
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
                            imgUrl: {
                                // set:  cleanLinks.map(link => link.replace(/^http:\/\//i, 'https://'))
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
                    console.log(adObject.Id[0] + ' ' + str)
                }
            } else {
                try {
                    const roomArr = adObject.RoomType ? adObject.RoomType.map(room => room.Option[0]) : []
                    const saleArr = adObject.SaleOptions ? adObject.SaleOptions.map(saleOpt => saleOpt.Option[0]) : []
                    const houseServicesArr = adObject.SaleOptions ? adObject.SaleOptions.map(saleOpt => saleOpt.Option[0]) : []
                    const cleanLinks = adObject.Images ? adObject.Images[0].Image.map(image => image.$.url) : [''];
                   
                    const updateUser = await db.objectIntrum.update({
                        where: {
                            id_intrum: adObject.Id[0],
                        },
                        data: {
                            state: state ? funcState(state) : "Не указан",
                            city: city ? funcCity(city) : 'Не указан',
                            district: adObject.Description[0] && city == 'Волгоград'?  findDistrict(adObject.Description[0]) : 'Не указан',
                            // district: findObject.district? findObject.district : await getDistrictFromAddress(str) ,
                            street: street ? street : 'Не указана',
                            // state: state ? (city === "Волжский" || city === "г Волжский" ? "Волжский" : funcCity(state) ) : "Не указан",
                            price: adObject.Price ? Number(adObject.Price[0]) : 0,
                            companyName: companyNameStr,
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
                            imgUrl: {
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
                        },
                    })
                    console.log('Обновили' + updateUser.id)
                } catch (error) {
                    console.error(error)
                    console.log(adObject.Id[0] + ' не смогли обновить' + str)
                }

            }
        }
        // await wait(5000)
    } catch (error) {
        console.error(error)
    }
}


start()