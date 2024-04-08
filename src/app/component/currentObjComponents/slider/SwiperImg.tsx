import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import React from 'react';
import Carousel from 'react-material-ui-carousel'
import { ImgCard } from "./ImgCard";



type Props = {
    showModalImg: boolean,
    setShowModalImg: Dispatch<SetStateAction<boolean>>,
    setHouseStepImg: (Dispatch<SetStateAction<string>>)
    img?: string[]
}

export function SwiperImg({ showModalImg, img, setShowModalImg, setHouseStepImg }: Props) {

    const [houseArrImg, setHouseArrImg] = useState<string[]>([]);
    const [firstImageLoaded, setFirstImageLoaded] = useState(false);

    const handleFirstImageLoad = () => {
        setFirstImageLoaded(true);
    }

    useEffect(() => {
        if (!Array.isArray(img) || !img.length) {
            return;
        }
        const ImgsObject = Array(12).fill(0).map(el => img[Math.floor(Math.random() * img.length)]);
        setHouseArrImg(ImgsObject);
    }, [img]);


    const [itemsPerPage, setItemsPerPage] = useState(0);

    // Определение количества отображаемых элементов в зависимости от ширины экрана
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 768) {
                setItemsPerPage(2);
            } else if (window.innerWidth < 1200) {
                setItemsPerPage(3);
            } else if (window.innerWidth > 1200) {
                setItemsPerPage(4);
            } else if (window.innerWidth < 550) {
                setItemsPerPage(1);
            }
        }
        window.addEventListener("resize", handleResize);
        // Вызываем handleResize сразу при монтировании компонента
        handleResize();
        // Убираем обработчик события при размонтировании компонента
        return () => window.removeEventListener("resize", handleResize);
    }, [])


    const resultArr = houseArrImg.reduce((resultArray:string[][], item, index) => {
        const chunkIndex = Math.floor(index / itemsPerPage);

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
        }

        resultArray[chunkIndex].push(item);
        return resultArray;
    }, []);


    return (

        <section className="w-[100%] m-[0 auto] bg-[#f5f2f261] gap-[0px] p-[20px] justify-center">
            {houseArrImg.length > 0 ?
                <Carousel sx={{ height: 'auto' }} animation="slide" autoPlay={false} swipe indicators cycleNavigation fullHeightHover
                    navButtonsAlwaysVisible
                >
                    {resultArr.map((houseArrImg, index) =>
                        <Item
                            setShowModalImg={setShowModalImg}
                            setHouseStepImg={setHouseStepImg}
                            showModalImg={showModalImg}
                            key={index}
                            houseArrImg={houseArrImg}
                        />
                    )}
                </Carousel>
                : <CircularProgress />
            }
        </section>
    )


    function Item({ houseArrImg, showModalImg, setShowModalImg, setHouseStepImg }:
        {
            houseArrImg: string[], showModalImg: boolean, setShowModalImg: Dispatch<SetStateAction<boolean>>
            , setHouseStepImg: Dispatch<SetStateAction<string>>
        },
    ) {
        return (
            <div className="flex h-[auto] justify-center gap-[6px]">
                {
                    houseArrImg.map((img) =>
                        <ImgCard
                            img={img}
                            key={img}
                            setShowModalImg={setShowModalImg}
                            setHouseStepImg={setHouseStepImg}
                            showModalImg={showModalImg}
                        />
                    )
                }
            </div>


        )
    }



}