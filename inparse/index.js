//@ts-check

const axios = require('axios').default
const { PrismaClient } = require("@prisma/client");
const { AxiosError } = require("axios");
const db = new PrismaClient()

async function start() {
      // Удаляем все объекты из базы данных
      await db.inparseObjects.deleteMany();
  try {
    const arrHoods = [
      {
        hood: 'Тракторный',
        coordinates: {
          lowerCorner: "44.576219 48.786317",
          upperCorner: "44.626093 48.808608"
        }
      },
      {
        hood: 'Краснооктябрьский',
        coordinates: {
          lowerCorner: "44.489163 48.737956",
          upperCorner: "44.608774 48.813609"
        }
      },
      {
        hood: 'Центральный',
        coordinates: {
          lowerCorner: "44.48902 48.693968",
          upperCorner: "44.56508 48.75162"
        },
      },
      {
        hood: 'Ворошиловский',
        coordinates: {
          lowerCorner: "44.377682 48.675528",
          upperCorner: "44.521242 48.720746"
        }
      },
      {
        hood: 'Советский',
        coordinates: {
          lowerCorner: "44.108861 48.480498",
          upperCorner: "44.492451 48.709213"
        }
      },
      {
        hood: 'Кировский',
        coordinates: {
          lowerCorner: "44.329128 48.506155",
          upperCorner: "44.648435 48.713143"
        }
      },
      {
        hood: 'Красноармейский',
        coordinates: {
          lowerCorner: "44.421736 48.406955",
          upperCorner: "44.687386 48.557524"
        }
      },
      {
        hood: 'Городищенский',
        coordinates: {
          lowerCorner: "44.427467 48.828184",
          upperCorner: "44.430216 48.83077"
        }
      },
      {
        hood: 'Среднеахтубинский район',
        coordinates: {
          lowerCorner: "44.512322 48.521129",
          upperCorner: "45.415147 49.146554"
        }
      },
      {
        hood: 'Волжский',
        coordinates: {
          lowerCorner: "44.629902 48.724157",
          upperCorner: "44.877289 48.938906"
        }
      },
    ]


    let arrObjects = []

    for (const obj of arrHoods) {
      const lowerCorner = obj.coordinates ? obj.coordinates.lowerCorner.split(' ') : '';
      const upperCorner = obj.coordinates ? obj.coordinates.upperCorner.split(' ') : '';

      const lngFrom = lowerCorner[0];
      const latFrom = lowerCorner[1];
      const lngTo = upperCorner[0];
      const latTo = upperCorner[1]; 

      const url = `https://inpars.ru/api/v2/estate?sortBy=created_desc&regionId=34&access-token=_aPxqTB4ch1YHWR3q72bcNLTgMYMC-Iv&latFrom=${latFrom}&lngFrom=${lngFrom}&lngTo=${lngTo}&latTo=${latTo}&limit=1000`

      const response = await axios(
        `https://inpars.ru/api/v2/estate?sortBy=created_desc&regionId=34&access-token=_aPxqTB4ch1YHWR3q72bcNLTgMYMC-Iv&latFrom=${latFrom}&lngFrom=${lngFrom}&lngTo=${lngTo}&latTo=${latTo}&limit=1000`
      );

      // if (!response.ok) {
      //   throw new Error(`Ошибка запроса для ${obj.hood}`);
      // }

      const data = response.data.data

      const arr = data.map(el => arrObjects.push(el))
    }

    // //  // Получаем все объекты из базы данных
    // const dbObjects = await db.inparseObjects.findMany();
    // // Получаем идентификаторы объектов из базы данных
    // const dbObjectIds = dbObjects.map(obj => obj.idInparse);
    // // Получаем идентификаторы объектов из XML-файлов
    // const xmlObjectIds = arrObjects.map(obj => obj.id);

    //  // Удаляем объекты из базы данных, которых нет в XML-файлах
    // const objectsToDelete = dbObjectIds.filter(id => !xmlObjectIds.includes(id));
    // await Promise.all(objectsToDelete.map(async (id) => {
    //   await db.inparseObjects.delete({
    //     where: {
    //       idInparse: id
    //     }
    //   });
    //   console.log(`Объект удален из базы с  ${id}  т.к. он не найден в фиде`);
    // }));


    for (const adObject of arrObjects) {

      const findObject = await db.inparseObjects.findUnique({
        where: {
          idInparse: String(adObject.id),
        }
      })

      try {
        const imgArr = (adObject.images || []).map(el => String(el));
        const phoneArr = (adObject.phones || []).map(el => String(el));

        if (findObject === null) {
          const newAdObject = await db.inparseObjects.create({
            data: {
              idInparse: String(adObject.id),
              regionId: String(adObject.regionId),
              cityId: String(adObject.regionId ? adObject.regionId : ''),
              typeAd: String(adObject.typeAd ? adObject.typeAd : ''),
              sectionId: String(adObject.sectionId ? adObject.sectionId : ''),
              categoryId: String(adObject.categoryId ? adObject.categoryId : ''),
              title: String(adObject.title ? adObject.title : ''),
              address: String(adObject.address ? adObject.address : ''),
              floor: String(adObject.floor ? adObject.floor : ''),
              floors: String(adObject.floors ? adObject.floors : ''),
              sq: String(adObject.sq ? adObject.sq : ''),
              sqLand: String(adObject.sqLand ? adObject.sqLand : ''),
              price: String(adObject.cost ? adObject.cost : ''),
              description: String(adObject.text ? adObject.text : ''),
              images: {
                set: imgArr
              },
              lat: String(adObject.lat ? adObject.lat : ''),
              lng: String(adObject.lng ? adObject.lng : ''),
              name: String(adObject.name ? adObject.name : ''),
              phones: {
                set: phoneArr
              },
              url: String(adObject.url ? adObject.url : ''),
              agent: String(adObject.agent ? adObject.agent : ''),
              source: String(adObject.source ? adObject.source : ''),
              sourceId: String(adObject.sourceId ? adObject.sourceId : '')
            }
          })
        } else {
          const updateObject = await db.inparseObjects.update({
            where: {
              idInparse: String(adObject.id),
            },
            data: {
              idInparse: String(adObject.id),
              regionId: String(adObject.regionId),
              cityId: String(adObject.regionId ? adObject.regionId : ''),
              typeAd: String(adObject.typeAd ? adObject.typeAd : ''),
              sectionId: String(adObject.sectionId ? adObject.sectionId : ''),
              categoryId: String(adObject.categoryId ? adObject.categoryId : ''),
              title: String(adObject.title ? adObject.title : ''),
              address: String(adObject.address ? adObject.address : ''),
              floor: String(adObject.floor ? adObject.floor : ''),
              floors: String(adObject.floors ? adObject.floors : ''),
              sq: String(adObject.sq ? adObject.sq : ''),
              sqLand: String(adObject.sqLand ? adObject.sqLand : ''),
              price: String(adObject.cost ? adObject.cost : ''),
              description: String(adObject.text ? adObject.text : ''),
              images: {
                set: imgArr
              },
              lat: String(adObject.lat ? adObject.lat : ''),
              lng: String(adObject.lng ? adObject.lng : ''),
              name: String(adObject.name ? adObject.name : ''),
              phones: {
                set: phoneArr
              },
              url: String(adObject.url ? adObject.url : ''),
              agent: String(adObject.agent ? adObject.agent : ''),
              source: String(adObject.source ? adObject.source : ''),
              sourceId: String(adObject.sourceId ? adObject.sourceId : '')
            }
          })
        }
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        throw error;
      }
    }
    return arrObjects.length;
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    throw error;
  }
}

start()