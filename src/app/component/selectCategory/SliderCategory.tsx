import React, { useEffect, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TouchAppIcon from "@mui/icons-material/TouchApp";

type Category = {
  title: string;
  bgSrc: string;
};

type SliderProps = {
  categories: Category[];
  styleCard: string;
  titleClass: string;
  createCategoryHandler: (categoryName: string) => () => void;
};

export function SliderCategory({
  categories,
  styleCard,
  titleClass,
  createCategoryHandler,
}: SliderProps) {
  const [showIcon, setShowIcon] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    centerMode: true,
    centerPadding: "16%",
    touchThreshold: 10
  }

  return (
    <div className="sm:hidden w-full relative overflow-hidden">
      <Slider {...settings}>
        {categories.map((category, index) => (
          <figure key={index} className="cursor-pointer">
            <div
              className={`${styleCard} h-[200px] sm:h-[270px] `}
              onClick={createCategoryHandler(category.title)}
            >
              <Image
                src={category.bgSrc}
                alt={category.title}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                loading="lazy"
                sizes="(max-width: 750px) 75vw, (max-width: 828px) 90vw,
                (max-width: 1080px) 100vw, 100vw"
              />
            </div>
            <figcaption className={titleClass}>{category.title}</figcaption>
          </figure>
        ))}
      </Slider>
      {showIcon && (
        <div className="absolute  w-[90%] mt-[40px] bottom-0 left-1/2 transform -translate-x-1/2 flex justify-center">
          <TouchAppIcon
            sx={{
              paddingTop: "5px",
              color: "rgba(0, 0, 0, 0.5)",
              animation: "swipe 2s ease-in-out infinite",
              "@keyframes swipe": {
                "0%, 100%": { transform: "translateX(0)", opacity: 1 },
                "50%": { transform: "translateX(20px)", opacity: 0.5 },
                "65%": { opacity: 0 },
              }
            }}
          />
        </div>
      )}
    </div>
  );
}


