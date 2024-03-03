import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Button, MobileStepper, useTheme } from "@mui/material";
import { useState } from "react";
import { Dispatch, SetStateAction, useRef } from "react";


type ModelProps = {
    showModalImg: boolean,
    setShowModalImg: Dispatch<SetStateAction<boolean>>,
    houseImg: string[],
    houseStepImg: string
}


export function ModalImg({ showModalImg, setShowModalImg, houseImg, houseStepImg }: ModelProps) {
    const theme = useTheme();
    const [closeStarting, setCloseStarting] = useState(false)
    const [activeStep, setActiveStep] = useState(
        houseStepImg && houseImg.includes(houseStepImg) ? houseImg.indexOf(houseStepImg) : 0
    );
    const maxSteps = houseImg.length;


    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    function closeModal() {
        setCloseStarting(true)
        setTimeout(() => {
            setShowModalImg(false)
            setCloseStarting(false)
        }, 500)
    }

    const backgroundEl = useRef(null)
    const className = [
        'modalBackground',
        showModalImg ? 'modalBackground_show' : '',
        closeStarting ? 'modalBackground_close-starting' : '',
    ]

    return <>
        <div className={className.join(' ')} style={{ color: 'black' }} id="modalBackground" ref={backgroundEl} onClick={(event) => {
            if (event.target === backgroundEl.current) closeModal()
        }}>

            <div
                className="w-[250px] h-[250px]   sm:w-[400px] sm:h-[310px]  md:w-[500px] md:h-[450px] lg:h-[700px]  lg:w-[800px]
                overflow-hidden   bg-center  bg-contain  bg-no-repeat"
                id="modalWindow"
            >
                <div className="imagesContainer">
                </div>

                <MobileStepper
                    sx={{ display: 'flex', width: '100%', color: ' #131313' }}
                    variant="text"
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                        < Button
                            size="small"
                            onClick={handleNext}
                            disabled={activeStep === maxSteps - 1}
                        >
                            <KeyboardArrowRight sx={{ color: ' #131313' }} />
                        </Button>
                    }
                    backButton={
                        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                            <KeyboardArrowLeft sx={{ color: ' #131313' }} />
                        </Button>
                    }
                />
            </div>
        </div >

        <style jsx>{`
            @keyframes modalBackground-open {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }

            @keyframes modalBackground-close {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }

            .disable-scroll {
                overflow: hidden;
            }

            .modalBackground {
                display: none;
                position: fixed;
                justify-content: center;
                top: 0;
                right: 0;
                left: 0;
                height: 100vh;
                background-color: rgb(0,0,0, 0.5);
                align-items: center;
                z-index: 9999;
                cursor: pointer;
            }

            .modalBackground_show {
                animation:modalBackground-open.5s ;
                display: flex;
            }

            .modalBackground_close-starting {
                animation:modalBackground-close.5s ;
            }

            .imagesContainer {
                display: flex;
                height: 600px;
                width: 800px;
                background-image: url('${houseImg[activeStep]}');
                background-size:contain;
                background-repeat: no-repeat;  
            }



            @media(max-width: 840px) {
                .imagesContainer {
                  height: 400px;
                  width: 600px;
                }
            }

            @media(max-width: 600px) {
                .imagesContainer {
                  height: 260px;
                  width: 400px;
                  background-size: cover;
                }
            }

            @media(max-width: 414px) {
                .imagesContainer {
                  height: 200px;
                  width: 300px;
                }
            }

            @media(max-width: 320px) {
                .imagesContainer {
                  width: 250px;
                }
            }
            
      `}
        </style>
    </>
}
