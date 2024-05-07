'use client'
import { DescriptionObj } from "@/app/component/currentObjComponents/description/DescriptionObj"
import { SwiperImg } from "@/app/component/currentObjComponents/slider/SwiperImg"
import { Header } from "@/app/component/header/Header"
import { MobileHeader } from "@/app/component/mainBarMobile/MobileBar"
import { ModalImg } from "@/app/component/modalWindow/ModalImg"
import { ObjectIntrum } from "@prisma/client"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"


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
                setHouseImg(answer.currentObject.img)
            }
        }

        start()

    }, [params.id]);


    return <>
        <Header />
        <MobileHeader />
        {object &&
            <>
                <SwiperImg
                    img={object.img}
                    setShowModalImg={setShowModalImg}
                    setHouseStepImg={setHouseStepImg}
                    showModalImg={showModalImg}
                />
                <DescriptionObj object={object} />
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