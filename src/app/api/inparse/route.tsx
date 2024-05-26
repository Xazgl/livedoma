import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method == "POST") {
    try {
      let answer = await req.json();
      let objects: object[] = answer.objects;

    //   const postResponse = await axios(
    //     `https://inpars.ru/api/v2/estate?sortBy=updated_asc&regionId=34&access-token=_aPxqTB4ch1YHWR3q72bcNLTgMYMC-Iv&latFrom=48.783657&lngFrom=44.557372&lngTo=44.565583&latTo=48.789083`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       }
    //     }
    //   );
    //   console.log( postResponse.data.data)
    //   const ress = postResponse.data.data

      
    //   return NextResponse.json({  ress}, { status: 200 });

      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


      // Проходим по каждому объекту и отправляем запросы
      for (const obj of objects) {
        //@ts-ignore
        const address = obj["Название"]; // Получаем название объекта

        // Делаем запрос к API Яндекс.Карт для получения координат
        const geoResponse = await fetch(
          `https://geocode-maps.yandex.ru/1.x/?apikey=fab78cee-5042-4e98-92f2-76c2bc8bbb17&format=json&geocode=Волгоград,${address}`
        );
        const geoData = await geoResponse.json();
        
        console.log(geoData);

        if (geoData.response.GeoObjectCollection.featureMember.length === 0) {
          console.error(`No geocode result for address: ${address}`);
          continue;
        }

        // Извлекаем координаты из ответа Яндекса
        const geoObject = geoData.response.GeoObjectCollection.featureMember[0].GeoObject;
        const coordinates = geoObject.Point.pos.split(" ");
        const lat = coordinates[1];
        const lon = coordinates[0];

        // Извлекаем границы из ответа Яндекса
        const envelope = geoObject.boundedBy.Envelope;
        const [lngFrom, latFrom] = envelope.lowerCorner.split(" ");
        const [lngTo, latTo] = envelope.upperCorner.split(" ");

        // Делаем POST-запрос к вашему API с полученными координатами
        const postResponse = await axios(
          `https://inpars.ru/api/v2/estate?sortBy=updated_asc&regionId=34&access-token=_aPxqTB4ch1YHWR3q72bcNLTgMYMC-Iv&latFrom=${latFrom}&latTo=${latTo}&lngFrom=${lngFrom}&lngTo=${lngTo}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            //   Authorization: "Basic _aPxqTB4ch1YHWR3q72bcNLTgMYMC-Iv",
            //   "Access-Control-Allow-Origin": "*",
            },
          }
        );
        let postData = postResponse.data.data;
        console.log(postData)
        // const postData = await postResponse.json();

        // Добавляем данные к объекту
        //@ts-ignore
        obj["coordinates"] = { lat, lon };
        //@ts-ignore
        obj["concurrency"] = postData;
        await delay(1000); // Задержка в 1 секунду (1000 миллисекунд)
      }

      return NextResponse.json({ objects: objects }, { status: 200 });
    } catch (error) {
      console.error("Error processing file:", error);
    }
  }
}
