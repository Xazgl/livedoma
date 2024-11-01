import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import DynamicImage from './DynamicImg';

type ModelProps = {
  showModalImg: boolean;
  setShowModalImg: (show: boolean) => void;
  houseImg: string[];
  houseStepImg: string;
  
};

export function ModalImg({
  showModalImg,
  setShowModalImg,
  houseImg,
  houseStepImg,
}: ModelProps) {
  const theme = useTheme();
  const [closeStarting, setCloseStarting] = useState(false);
  const [activeStep, setActiveStep] = useState(
    houseStepImg && houseImg.includes(houseStepImg)
      ? houseImg.indexOf(houseStepImg)
      : 0
  );
  const [isVisible, setIsVisible] = useState(showModalImg);
  const maxSteps = houseImg.length;

  useEffect(() => {
    if (showModalImg) {
      setIsVisible(true);
    }
  }, [showModalImg]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  function closeModal() {
    setCloseStarting(true);
    setTimeout(() => {
      setShowModalImg(false);
      setIsVisible(false);
      setCloseStarting(false);
    }, 500);
  }

  const backgroundEl = useRef<HTMLDivElement | null>(null);
  const className = [
    "modalBackground",
    isVisible ? "modalBackground_show" : "",
    closeStarting ? "modalBackground_close-starting" : "",
  ].join(" ");

  if (!isVisible) return null;

  return (
    <>
      <div
        className={className}
        style={{ color: "black" }}
        id="modalBackground"
        ref={backgroundEl}
        onClick={(event) => {
          if (event.target === backgroundEl.current) closeModal();
        }}
      >
        <div
          className="modalWindow"
          id="modalWindow"
        >
          <DynamicImage
            src={`${houseImg[activeStep]}`}
            alt={`${houseImg[activeStep]}`}
          />

          <MobileStepper
            sx={{
              display: 'flex',
              width: '100%',
              position: 'absolute',
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)', 
              color: 'white',
            }}
            variant="text"
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}
                sx={{ color: 'white' }} 
              >
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{ color: 'white' }} 
              >
                <KeyboardArrowLeft />
              </Button>
            }
          />
        </div>
      </div>

      <style jsx>
        {`
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
            align-items: center;
            top: 0;
            right: 0;
            left: 0;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            cursor: pointer;
          }

          .modalBackground_show {
            animation: modalBackground-open 0.5s forwards;
            display: flex;
          }

          .modalBackground_close-starting {
            animation: modalBackground-close 0.5s forwards;
          }

          .modalWindow {
            width: 90%;
            max-width: 800px;
            height: auto;
            max-height: 90vh;
            background: white;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            border-radius: 8px;
          }

          @media (max-width: 600px) {
            .modalWindow {
              width: 100%;
              border-radius: 0;
              background: transparent;
            }
          }
        `}
      </style>
    </>
  );
}


