import { NextRequest, NextResponse } from "next/server";
import db, { InparseObjects } from "../../../../prisma";
import { InparseAnswer, objectExcel } from "../../../../@types/dto";
// import { pipeline } from 'stream';
// import { promisify } from 'util';
// const pump = promisify(pipeline);

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method == "POST") {

    const normalizeAddress = (address: string) => {
      return address.toLowerCase().replace(/[.,]/g, "").trim();
    };

    try {
      const answer = await req.json();
      const objects:objectExcel[] = answer.objects;

      let results: InparseAnswer[] = [];

      for (const obj of objects) {
        const address = obj.address; // Преобразуем в строку, если адрес существует
        const normalizedAddress = normalizeAddress(
          address.replace(/\d+/g, "").trim().split(' ')[0]
        ); 
        // console.log(normalizedAddress)

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

          const currentObjects: { address: string, manager: string ,price: string, idIntrum:string,
            rooms:string, objects: InparseObjects[] }= {
            address: obj.address,
            idIntrum: obj.objectId,
            price:obj.price,
            manager: obj.responsible,
            rooms:obj.rooms,
            objects: foundObjects,
          };
          results.push(currentObjects);
        }
      }

            // Предполагается, что ответ содержит массив объектов
      return NextResponse.json({ results }, { status: 200 });
  
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}





          // console.log("Array of objects:", objectsRes);

          // const res = await fetch(`/api/inparse`, {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({ objects}),
          // });
          // return res;

          // // Проходим по каждому объекту и отправляем запросы
          // for (const obj of objects) {
          //   const address = obj["Название"]; // Получаем название объекта

          //   // Делаем запрос к API Яндекс.Карт для получения координат
          //   const geoResponse = await fetch(
          //     `https://geocode-maps.yandex.ru/1.x/?apikey=fab78cee-5042-4e98-92f2-76c2bc8bbb17&format=json&geocode=Волгоград,${address}`
          //   );
          //   const geoData = await geoResponse.json();

          //   if (
          //     geoData.response.GeoObjectCollection.featureMember.length === 0
          //   ) {
          //     console.error(`No geocode result for address: ${address}`);
          //     continue;
          //   }

          //   // Извлекаем координаты из ответа Яндекса
          //   const geoObject = geoData.response.GeoObjectCollection.featureMember[0].GeoObject;
          //   const coordinates = geoObject.Point.pos.split(" ");
          //   const lat = coordinates[1];
          //   const lon = coordinates[0];

          //   // Извлекаем границы из ответа Яндекса
          //   const envelope = geoObject.boundedBy.Envelope;
          //   const [lngFrom, latFrom] = envelope.lowerCorner.split(" ");
          //   const [lngTo, latTo] = envelope.upperCorner.split(" ");

          //   // Делаем POST-запрос к вашему API с полученными координатами
          //   const postResponse = await axios(
          //     `https://inpars.ru/api/v2/estate?sortBy=updated_asc&regionId=34&access-token=_aPxqTB4ch1YHWR3q72bcNLTgMYMC-Iv&latFrom=${latFrom}&latTo=${latTo}&lngFrom=${lngFrom}&lngTo=${lngTo}`,
          //     {
          //       method: "POST",
          //       headers: {
          //         "Content-Type": "application/json",
          //       }
          //     }
          //   );
          //   const postData = await postResponse;
          //   // const postData = await postResponse.json();

          //   // Добавляем данные к объекту
          //   obj["coordinates"] = { lat, lon };
          //   obj["concurrency"] = postData;
          // }
          // console.log("finish:", objects);