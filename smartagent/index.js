
//@ts-check

const axios = require('axios').default;
const { PrismaClient } = require("@prisma/client");
const { AxiosError } = require('axios');

const db = new PrismaClient();




async function start() {
  try {

  const currentDate = new Date(); // Получаем текущую дату
  const prevDay = new Date(currentDate.getTime() - (14 * 24 * 60 * 60 * 1000)); // Вычитаем 14 дней
  const formattedPrevDate = prevDay.toISOString().split('T')[0]; // Преобразуем в формат Y-m-d
  const formattedDateCurrent = currentDate.toISOString().split('T')[0]; // Преобразуем в формат Y-m-d

    // Запрос на получение новых объектов
    const response = await axios.get(`https://smartagent.ru/api/new?auth[login]=79950272077&auth[password]=89442&property=2&region=15&updated_at${formattedPrevDate}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (response.data.success === true && response.data.payload.items.length > 0) {
      const items = response.data.payload.items;
      const itemIds = items.map(item => item.id.toString()); // Список ID объектов

      for (const item of items) {
        try {
          // Запрос на получение подробной информации по каждому объекту
          const detailResponse = await axios.get(`https://smartagent.ru/api/get?id=${item.id}&auth[login]=79950272077&auth[password]=89442&property=2&region=15`, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });

          if (detailResponse.data.success === true) {
            const payload = detailResponse.data.payload;

            // Преобразование данных в соответствующий формат
            const images_source = payload.images_source.map(source => JSON.stringify(source));
            const images_ids = payload.images_ids.map(id => id.toString());


            // Запрос на получение контактов для каждого объекта
            const contactResponse = await axios.get(`https://smartagent.ru/api/phone?id=${item.id}&auth[login]=79950272077&auth[password]=89442&property=2`, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            });

            let numbers = [];
            let emails = [];
            let virtual_numbers = [];
            let history = [];
            let source_url = "";

            if (contactResponse.data.success === true) {
              numbers = contactResponse.data.payload.numbers || [];
              emails = contactResponse.data.payload.emails || [];
              virtual_numbers = contactResponse.data.payload.virtual_numbers || [];
              history = contactResponse.data.payload.history || [];

              if (history.length > 0) {
                source_url = history[0].source_url || "";
              }
            }


            // Сохранение данных в базу данных
            await db.smartAgentObjects.upsert({
              where: { idSmartAgent: payload.id },
              update: {
                region_id: payload.region_id,
                hierarchy_top_level: payload.hierarchy_top_level,
                full_hierarchy: payload.full_hierarchy,
                street_ids: payload.street_ids,
                street_cache: payload.street_cache,
                metro_ids: payload.metro_ids,
                metro_cache: payload.metro_cache,
                deal_type: payload.deal_type,
                holding_period_in_years: payload.holding_period_in_years,
                rooms: payload.rooms,
                price: payload.price,
                agent_commission: payload.agent_commission,
                client_commission: payload.client_commission,
                floor: payload.floor,
                floors: payload.floors,
                distance: payload.distance,
                transport: payload.transport,
                period: payload.period,
                building: payload.building,
                corpus: payload.corpus,
                hometype: payload.hometype,
                total_area: payload.total_area,
                living_area: payload.living_area,
                kitchen_area: payload.kitchen_area,
                land_area: payload.land_area,
                remont: payload.remont,
                fridge: payload.fridge,
                washer: payload.washer,
                sell_balcony: payload.sell_balcony,
                tv: payload.tv,
                slavs: payload.slavs,
                rf: payload.rf,
                children: payload.children,
                pets: payload.pets,
                furniture: payload.furniture,
                isolated: payload.isolated,
                view_from_windows: payload.view_from_windows,
                wc: payload.wc,
                checked_at: payload.checked_at,
                updated_at: payload.updated_at,
                user_id_who_created: payload.user_id_who_created,
                order_for_user_id: payload.order_for_user_id,
                name: payload.name,
                note: payload.note,
                owner: payload.owner,
                lon: payload.lon,
                lat: payload.lat,
                alternatives: payload.alternatives,
                edit_hash: payload.edit_hash,
                new_building: payload.new_building,
                feed_export_enabled: payload.feed_export_enabled,
                images_source: images_source,
                images: payload.images,
                images_ids: images_ids,
                note_generated: payload.note_generated,
                phone: numbers,
                source_url: source_url 
              },
              create: {
                idSmartAgent: payload.id,
                region_id: payload.region_id,
                hierarchy_top_level: payload.hierarchy_top_level,
                full_hierarchy: payload.full_hierarchy,
                street_ids: payload.street_ids,
                street_cache: payload.street_cache,
                metro_ids: payload.metro_ids,
                metro_cache: payload.metro_cache,
                deal_type: payload.deal_type,
                holding_period_in_years: payload.holding_period_in_years,
                rooms: payload.rooms,
                price: payload.price,
                agent_commission: payload.agent_commission,
                client_commission: payload.client_commission,
                floor: payload.floor,
                floors: payload.floors,
                distance: payload.distance,
                transport: payload.transport,
                period: payload.period,
                building: payload.building,
                corpus: payload.corpus,
                hometype: payload.hometype,
                total_area: payload.total_area,
                living_area: payload.living_area,
                kitchen_area: payload.kitchen_area,
                land_area: payload.land_area,
                remont: payload.remont,
                fridge: payload.fridge,
                washer: payload.washer,
                sell_balcony: payload.sell_balcony,
                tv: payload.tv,
                slavs: payload.slavs,
                rf: payload.rf,
                children: payload.children,
                pets: payload.pets,
                furniture: payload.furniture,
                isolated: payload.isolated,
                view_from_windows: payload.view_from_windows,
                wc: payload.wc,
                checked_at: payload.checked_at,
                updated_at: payload.updated_at,
                user_id_who_created: payload.user_id_who_created,
                order_for_user_id: payload.order_for_user_id,
                name: payload.name,
                note: payload.note,
                owner: payload.owner,
                lon: payload.lon,
                lat: payload.lat,
                alternatives: payload.alternatives,
                edit_hash: payload.edit_hash,
                new_building: payload.new_building,
                feed_export_enabled: payload.feed_export_enabled,
                images_source: images_source,
                images: payload.images,
                images_ids: images_ids,
                note_generated: payload.note_generated,
                phone: numbers,
                source_url: source_url 
              }
            });
          }
        } catch (detailError) {
          if (detailError instanceof AxiosError) {
            console.error('Detail Axios error: ', detailError.message);
          } else {
            console.error('Unexpected error: ', detailError);
          }
        }
      }

      // Удаление неактуальных объектов из базы данных
      const allDbItems = await db.smartAgentObjects.findMany({
        select: { idSmartAgent: true }
      });
      const dbItemIds = allDbItems.map(item => item.idSmartAgent);
      const idsToDelete = dbItemIds.filter(id => !itemIds.includes(id));
      
      await db.smartAgentObjects.deleteMany({
        where: {
          idSmartAgent: { in: idsToDelete }
        }
      });
    } else {
      console.log('No new objects found or request failed.');
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Axios error: ', error.message);
    } else {
      console.error('Unexpected error: ', error);
    }
  }
}

// async function start2() {
//   try {

//   const currentDate = new Date(); // Получаем текущую дату
//   const prevDay = new Date(currentDate.getTime() - (20 * 24 * 60 * 60 * 1000)); // Вычитаем 20 дней
//   const formattedPrevDate = prevDay.toISOString().split('T')[0]; // Преобразуем в формат Y-m-d
//   const formattedDateCurrent = currentDate.toISOString().split('T')[0]; // Преобразуем в формат Y-m-d

//     // Запрос на получение новых объектов
//     const response = await axios.get(`https://smartagent.ru/api/new-smart-agent?auth[login]=79950272077&auth[password]=89442&property=2&region=15&updated_at${formattedPrevDate}`, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       }
//     });

//     if (response.data.success === true && response.data.payload.items.length > 0) {
//       const items = response.data.payload.items;
//       const itemIds = items.map(item => item.id.toString()); // Список ID объектов

//       for (const item of items) {
//         try {
//           // Запрос на получение подробной информации по каждому объекту
//           const detailResponse = await axios.get(`https://smartagent.ru/api/get?id=${item.id}&auth[login]=79950272077&auth[password]=89442&property=2&region=15`, {
//             headers: {
//               'Content-Type': 'application/x-www-form-urlencoded'
//             }
//           });

//           if (detailResponse.data.success === true) {
//             const payload = detailResponse.data.payload;

//             // Преобразование данных в соответствующий формат
//             const images_source = payload.images_source.map(source => JSON.stringify(source));
//             const images_ids = payload.images_ids.map(id => id.toString());

//             // Сохранение данных в базу данных
//             await db.smartAgentObjects.upsert({
//               where: { idSmartAgent: payload.id },
//               update: {
//                 region_id: payload.region_id,
//                 hierarchy_top_level: payload.hierarchy_top_level,
//                 full_hierarchy: payload.full_hierarchy,
//                 street_ids: payload.street_ids,
//                 street_cache: payload.street_cache,
//                 metro_ids: payload.metro_ids,
//                 metro_cache: payload.metro_cache,
//                 deal_type: payload.deal_type,
//                 holding_period_in_years: payload.holding_period_in_years,
//                 rooms: payload.rooms,
//                 price: payload.price,
//                 agent_commission: payload.agent_commission,
//                 client_commission: payload.client_commission,
//                 floor: payload.floor,
//                 floors: payload.floors,
//                 distance: payload.distance,
//                 transport: payload.transport,
//                 period: payload.period,
//                 building: payload.building,
//                 corpus: payload.corpus,
//                 hometype: payload.hometype,
//                 total_area: payload.total_area,
//                 living_area: payload.living_area,
//                 kitchen_area: payload.kitchen_area,
//                 land_area: payload.land_area,
//                 remont: payload.remont,
//                 fridge: payload.fridge,
//                 washer: payload.washer,
//                 sell_balcony: payload.sell_balcony,
//                 tv: payload.tv,
//                 slavs: payload.slavs,
//                 rf: payload.rf,
//                 children: payload.children,
//                 pets: payload.pets,
//                 furniture: payload.furniture,
//                 isolated: payload.isolated,
//                 view_from_windows: payload.view_from_windows,
//                 wc: payload.wc,
//                 checked_at: payload.checked_at,
//                 updated_at: payload.updated_at,
//                 user_id_who_created: payload.user_id_who_created,
//                 order_for_user_id: payload.order_for_user_id,
//                 name: payload.name,
//                 note: payload.note,
//                 owner: payload.owner,
//                 lon: payload.lon,
//                 lat: payload.lat,
//                 alternatives: payload.alternatives,
//                 edit_hash: payload.edit_hash,
//                 new_building: payload.new_building,
//                 feed_export_enabled: payload.feed_export_enabled,
//                 images_source: images_source,
//                 images: payload.images,
//                 images_ids: images_ids,
//                 note_generated: payload.note_generated
//               },
//               create: {
//                 idSmartAgent: payload.id,
//                 region_id: payload.region_id,
//                 hierarchy_top_level: payload.hierarchy_top_level,
//                 full_hierarchy: payload.full_hierarchy,
//                 street_ids: payload.street_ids,
//                 street_cache: payload.street_cache,
//                 metro_ids: payload.metro_ids,
//                 metro_cache: payload.metro_cache,
//                 deal_type: payload.deal_type,
//                 holding_period_in_years: payload.holding_period_in_years,
//                 rooms: payload.rooms,
//                 price: payload.price,
//                 agent_commission: payload.agent_commission,
//                 client_commission: payload.client_commission,
//                 floor: payload.floor,
//                 floors: payload.floors,
//                 distance: payload.distance,
//                 transport: payload.transport,
//                 period: payload.period,
//                 building: payload.building,
//                 corpus: payload.corpus,
//                 hometype: payload.hometype,
//                 total_area: payload.total_area,
//                 living_area: payload.living_area,
//                 kitchen_area: payload.kitchen_area,
//                 land_area: payload.land_area,
//                 remont: payload.remont,
//                 fridge: payload.fridge,
//                 washer: payload.washer,
//                 sell_balcony: payload.sell_balcony,
//                 tv: payload.tv,
//                 slavs: payload.slavs,
//                 rf: payload.rf,
//                 children: payload.children,
//                 pets: payload.pets,
//                 furniture: payload.furniture,
//                 isolated: payload.isolated,
//                 view_from_windows: payload.view_from_windows,
//                 wc: payload.wc,
//                 checked_at: payload.checked_at,
//                 updated_at: payload.updated_at,
//                 user_id_who_created: payload.user_id_who_created,
//                 order_for_user_id: payload.order_for_user_id,
//                 name: payload.name,
//                 note: payload.note,
//                 owner: payload.owner,
//                 lon: payload.lon,
//                 lat: payload.lat,
//                 alternatives: payload.alternatives,
//                 edit_hash: payload.edit_hash,
//                 new_building: payload.new_building,
//                 feed_export_enabled: payload.feed_export_enabled,
//                 images_source: images_source,
//                 images: payload.images,
//                 images_ids: images_ids,
//                 note_generated: payload.note_generated
//               }
//             });
//           }
//         } catch (detailError) {
//           if (detailError instanceof AxiosError) {
//             console.error('Detail Axios error: ', detailError.message);
//           } else {
//             console.error('Unexpected error: ', detailError);
//           }
//         }
//       }

//       // Удаление неактуальных объектов из базы данных
//       const allDbItems = await db.smartAgentObjects.findMany({
//         select: { idSmartAgent: true }
//       });
//       const dbItemIds = allDbItems.map(item => item.idSmartAgent);
//       const idsToDelete = dbItemIds.filter(id => !itemIds.includes(id));
      
//       await db.smartAgentObjects.deleteMany({
//         where: {
//           idSmartAgent: { in: idsToDelete }
//         }
//       });
//     } else {
//       console.log('No new objects found or request failed.');
//     }
//   } catch (error) {
//     if (error instanceof AxiosError) {
//       console.error('Axios error: ', error.message);
//     } else {
//       console.error('Unexpected error: ', error);
//     }
//   }
// }
start();
// start2();












































// //@ts-check

// const axios = require('axios').default;
// const { PrismaClient } = require("@prisma/client");
// const { AxiosError } = require('axios');

// const db = new PrismaClient();

// async function start() {
//   // const currentDate = new Date(); // Получаем текущую дату
//   // const prevDay = new Date(currentDate.getTime() - (31 * 24 * 60 * 60 * 1000)); // Вычитаем 30 дней
//   // const formattedPrevDate = prevDay.toISOString().split('T')[0]; // Преобразуем в формат Y-m-d
//   // const formattedDateCurrent = currentDate.toISOString().split('T')[0]; // Преобразуем в формат Y-m-d

//   // const params = new URLSearchParams();
//   // params.append("auth[login]", "79950272077");
//   // params.append("auth[password]", "89442");
//   // params.append("property", "2");
//   // params.append("region", "15");
//   // params.append("updated_at", formattedPrevDate);
//   // params.append("checked_at", formattedDateCurrent);

//   try {


//     const response = await axios.get('https://smartagent.ru/api/new-smart-agent?auth[login]=79950272077&auth[password]=89442&property=2&region=15', {
//       // params: params,
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       }
//     });
//     // const response = await axios.get('https://smartagent.ru/api/new', {
//     //   params: params,
//     //   headers: {
//     //     'Content-Type': 'application/x-www-form-urlencoded'
//     //   }
//     // });

//     console.log(response.data)
//     if(response.data.success == true && response.data.payload.items.length > 0 ) {

//       console.log(response.data.payload.items[0])
//     }

//     // if (response.data && response.data.length > 0) {
//     //   for (const object of response.data) {
//     //     // Обработка данных
//     //     console.log(`Object ID: ${object.id}, Updated at: ${object.updated_at}`);
        
//     //     // // Пример вставки в базу данных
//     //     // await db.objects.upsert({
//     //     //   where: { id: object.id },
//     //     //   update: {
//     //     //     updatedAt: object.updated_at,
//     //     //     checkedAt: object.checked_at,
//     //     //     // Добавьте другие необходимые поля
//     //     //   },
//     //     //   create: {
//     //     //     id: object.id,
//     //     //     updatedAt: object.updated_at,
//     //     //     checkedAt: object.checked_at,
//     //     //     // Добавьте другие необходимые поля
//     //     //   }
//     //     // });
//     //   }
//     // } else {
//     //   console.log('No new objects found.');
//     // }
//   } catch (error) {
//     if (error instanceof AxiosError) {
//       console.error('Axios error: ', error.message);
//     } else {
//       console.error('Unexpected error: ', error);
//     }
//   }
// }

// start();



// // массив объектов { id: 158447052, checked_at: 1719920944 } и по их первому id нужно получить то что ниже через запрос для каждого https://smartagent.ru/api/get?id=тут id &auth[login]=79950272077&auth[password]=89442&property=2&region=15


// // конкретные объект 
// //{ 
// //   success: true,
// //   msg: [],
// //   payload: {
// //     id: '158447052',
// //     region_id: '13',
// //     hierarchy_top_level: ',13,',
// //     full_hierarchy: ',13,54960,479920,72370700,72411972,18000000000,18214816001,',
// //     street_ids: ',479920,',
// //     street_cache: 'Волгоградская обл, Иловлинский м/р-н, Качалинское сп, Качалино ст, Молодежная ул',
// //     metro_ids: null,
// //     metro_cache: null,
// //     deal_type: '0',
// //     holding_period_in_years: '0',
// //     rooms: '2',
// //     price: '1000000',
// //     agent_commission: '0',
// //     client_commission: '0',
// //     floor: '2',
// //     floors: '2',
// //     distance: '0',
// //     transport: '0',
// //     period: '3',
// //     building: '0',
// //     corpus: null,
// //     hometype: '0',
// //     total_area: '50',
// //     living_area: '0',
// //     kitchen_area: '8',
// //     land_area: '0',
// //     remont: '0',
// //     fridge: '0',
// //     washer: '0',
// //     sell_balcony: '1',
// //     tv: '0',
// //     slavs: '0',
// //     rf: '0',
// //     children: '0',
// //     pets: '0',
// //     furniture: '1',
// //     isolated: '0',
// //     view_from_windows: '3',
// //     wc: '1',
// //     checked_at: '2024-07-02 14:49:04',
// //     updated_at: '2024-07-02 14:49:04',
// //     user_id_who_created: null,
// //     order_for_user_id: null,
// //     name: null,
// //     note: 'детские садики, оплата жкх',
// //     owner: '0',
// //     lon: '44.05704700',
// //     lat: '49.13013300',
// //     alternatives: null,
// //     edit_hash: null,
// //     new_building: '0',
// //     feed_export_enabled: '0',
// //     images_source: [],
// //     images: [
// //       'https://st01.smartagent.ru/uploaded-img/sell/01/58/44/70/0158447052/17199208881545493303.jpg',
// //       'https://st01.smartagent.ru/uploaded-img/sell/01/58/44/70/0158447052/17199208881994983863.jpg',
// //       'https://st01.smartagent.ru/uploaded-img/sell/01/58/44/70/0158447052/17199208881726991541.jpg'
// //     ],
// //     images_ids: [ 357171300, 357171302, 357171304 ],
// //     note_generated: 'Продается 2-к квартира в прекрасном благоустроенном районе. Квартира с хорошим балконом. Окна выходят как во двор, так и на улицу.'
// //   }
// // }