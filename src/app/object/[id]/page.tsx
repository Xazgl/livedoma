'use client'
import { AllHeader } from "@/app/component/allHeader/AllHeader"
import YandexMap from "@/app/component/currentObjComponents/map/YandexMap"
import { ModalImg } from "@/app/component/modalWindow/ModalImg"
import { ObjectIntrum } from "@prisma/client"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import dynamic from 'next/dynamic';
import SwiperImg from "@/app/component/currentObjComponents/slider/SwiperImg"
import DescriptionObj from "@/app/component/currentObjComponents/description/DescriptionObj"
const Footer = dynamic(() => import("@/app/component/folder/Footer"));


export default function ObjectPage({ params }: { params: { id: string } }) {

    const [showModalImg, setShowModalImg] = useState(false)
    const [houseStepImg, setHouseStepImg] = useState('')
    const [object, setObject] = useState<ObjectIntrum>()
    const [houseImg, setHouseImg] = useState<string[]>([])
    const router = useRouter()

    useEffect(() => {
        async function start() {
            const res = await fetch('/api/object/' + params.id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            if (res.ok) {
                const answer = await res.json()
                console.log(answer);
                setObject(answer.currentObject)
                answer.currentObject.img.length > 0 ? setHouseImg(answer.currentObject.img)  : setHouseImg(answer.currentObject.imgUrl)
            }
        }
        start()
    }, [params.id]);


    return <>
        <AllHeader/>
        {object &&
            <>
            {object.imgUrl.length > 0  && object.imgUrl[0] !== "" &&        
                <SwiperImg
                    img={object.img.length > 0 ?  object.img : object.imgUrl}
                    setShowModalImg={setShowModalImg}
                    setHouseStepImg={setHouseStepImg}
                    showModalImg={showModalImg}  
                />
            }
                <DescriptionObj object={object} />
                <YandexMap object={object}/>
                <Footer/>
            </>
        }

        {showModalImg &&
            <ModalImg
                houseImg={houseImg}
                showModalImg={showModalImg}
                setShowModalImg={setShowModalImg}
                houseStepImg={houseStepImg}
            />
        }

    </>
}