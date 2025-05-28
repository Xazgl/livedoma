"use client";
import { AllHeader } from "@/app/component/allHeader/AllHeader";
import YandexMap from "@/app/component/currentObjComponents/map/YandexMap";
import { ModalImg } from "@/app/component/modalWindow/ModalImg";
import { ObjectIntrum } from "@prisma/client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import SwiperImg from "@/app/component/currentObjComponents/slider/SwiperImg";
import DescriptionObj from "@/app/component/currentObjComponents/description/DescriptionObj";
import { isImage } from "@/shared/utils";
const Footer = dynamic(() => import("@/app/component/folder/Footer"));

export default function ObjectPage({ params }: { params: { id: string } }) {
  const [showModalImg, setShowModalImg] = useState(false);
  const [houseStepImg, setHouseStepImg] = useState("");
  const [object, setObject] = useState<ObjectIntrum>();
  const [houseImg, setHouseImg] = useState<string[]>([]);

  useEffect(() => {
    async function start() {
      const res = await fetch("/api/object/" + params.id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const answer = await res.json();
        console.log(answer);
        setObject(answer.currentObject);
        answer.currentObject.img.length > 0
          ? setHouseImg(answer.currentObject.img)
          : setHouseImg(answer.currentObject.imgUrl);
      }
    }
    start();
  }, [params.id]);

  const imgOriginal = object?.img && object?.img?.length > 0 ? object?.img : object?.imgUrl
  const filteredImgs = imgOriginal ? imgOriginal.filter((url) => isImage(url)) : [];

  return (
    <>
      <AllHeader />
      {object && (
        <>
          {filteredImgs?.length > 0 && filteredImgs[0] !== "" && (
            <SwiperImg
              img={filteredImgs}
              setShowModalImg={setShowModalImg}
              setHouseStepImg={setHouseStepImg}
              showModalImg={showModalImg}
            />
          )}
          <DescriptionObj object={object} />
          <YandexMap object={object} />
          <Footer />
        </>
      )}

      {showModalImg && (
        <ModalImg
          houseImg={houseImg}
          showModalImg={showModalImg}
          setShowModalImg={setShowModalImg}
          houseStepImg={houseStepImg}
        />
      )}
    </>
  );
}
