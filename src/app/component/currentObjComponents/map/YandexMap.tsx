"use client";
import { ObjectIntrum } from "@prisma/client";
import { useEffect, useState } from "react";
import { Coordinates } from "../../../../../@types/dto";
import React from "react";
import { apiMapKey } from "@/lib/apiKeyMap";

type Props = {
  object: ObjectIntrum;
};

export function YandexMap({ object }: Props) {
  const [coordinates, setCoordinates] = useState<Coordinates>({
    longitude: "",
    latitude: "",
  });

  useEffect(() => {
    async function mapStart() {
      const geoResponse = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${apiMapKey}&format=json&geocode=Волгоград,${object.street}`
      );
      const geoData = await geoResponse.json();
      // Извлекаем координаты из ответа Яндекса
      const geoObject =
        geoData.response.GeoObjectCollection.featureMember[0].GeoObject;
      const coordinates = geoObject.Point.pos.split(" ");
      //   const lat = coordinates[1];
      //   const lon = coordinates[0];
      const [lon, lat] = geoObject.Point.pos.split(" ");
      setCoordinates({ latitude: lat, longitude: lon });
    }

    mapStart();
  }, []);

  return (
    <div className="flex w-full h-auto mt-[5px] mb-[30px]">
    {coordinates.latitude !='' &&  coordinates.longitude !='' &&
      <iframe
        src={`https://yandex.ru/map-widget/v1/?ll=${coordinates.longitude},${coordinates.latitude}&z=16&pt=${coordinates.longitude},${coordinates.latitude},pm2rdm`}
        width="100%"
        height="400px"
        frameBorder="0"
      />
    }
    </div>
  );
}

export default React.memo(YandexMap);

