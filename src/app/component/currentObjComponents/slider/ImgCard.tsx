import { CircularProgress } from "@mui/material";
import Image from 'next/image';
import { Dispatch, SetStateAction } from "react";


type Props = {
    showModalImg: boolean,
    setShowModalImg: Dispatch<SetStateAction<boolean>>,
    setHouseStepImg: (Dispatch<SetStateAction<string>>)
    img: string
}

export function ImgCard({ img, setShowModalImg, setHouseStepImg }: Props) {


    function showModalImgFunction(item: string) {
        setShowModalImg(true)
        setHouseStepImg(item)
    }


    return (
        <>
            {img !== null ?
                <>
                    <div className="card"
                    //    className="flex justify-center text-center flex-col w-[100%] h-[auto]
                    //    mt-[40px] rounded-[7px] cursor-pointer duration-700  ease-in-out "
                    >
                        <div className="imgDiv">
                            <Image
                                src={img}
                                alt={img}
                                layout="fill"
                                sizes="(max-width: 750px) 80vw,
                                            (max-width: 828px) 70vw,
                                            (max-width: 1080px) 73vw,
                                            80vw"
                                loading="lazy"
                                style={{ cursor: 'zoom-in' }}
                                onClick={() => showModalImgFunction(img)}
                            />
                        </div>
                    </div>

                </>
                : <CircularProgress />
            }

            <style jsx>{`
            @keyframes cblackit-open {
                    0% {
                        opacity: 0;
                        margin-top:-5em;
                    }
                 
                50% {
                    opacity: 0.5;

                }

                60% {
                    opacity: 0.8;
                }

                   80% {
                       opacity: 0.9;
                   }
   
                   100% {
                       opacity: 1;
                   }
               }

                .card {
                    display: flex;
                    justify-content: center;
                    text-align: center;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                    height:auto;
                    margin-top: 40px;
                    border-radius: 7px;
                    transition: 0.3s;
                    cursor: pointer;
                    animation: slideAnimation 1s ease-in-out;        
                }

                .card.active {
                    opacity: 1;
                    transform: translateX(0px);
                }

                .imgDiv {
                    display: flex;
                    justify-content: center;
                    width: 100%;
                    height: 250px;
                    position: relative;
                }


                @media(max-width: 1200px) {
                    .background {
                    height: 100%;
                    }
                }

                @media(max-width: 1000px) {
                    .cardsSlider{
                         flex - wrap: wrap;
                         width: auto;
                         justify-content: center;
                         height: auto;
                    }
                .btnDiv {
                    margin - top: 20px;
                    }
                }

                @media(max-width: 720px) {

                .card:hover .cblackit {
                    display: none;
                    }
                .card:hover {
                    transform: scale(1);
                height: auto;
                   }
                .card{
                    height: auto;
                   }

                .cardImg{
                    width: 100%;
                height: auto;
                border-radius: 0;
                    }

        
                }

        `}</style>
        </>
    )

}
