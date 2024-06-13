import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';

type Props = {
  src: string;
  alt: string;
  setShowModalImg: Dispatch<SetStateAction<boolean>>;
  setHouseStepImg: Dispatch<SetStateAction<string>>;
  img: string;
};

const DynamicImgSlider: React.FC<Props> = ({ src, alt, setShowModalImg, setHouseStepImg, img }) => {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imgRef.current) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const { width, height } = img;
        setAspectRatio(width / height);
      };
    }
  }, [src]);

  function showModalImgFunction(item: string) {
    setShowModalImg(true);
    setHouseStepImg(item);
  }

  const getContainerStyles = () => {
    return {
      width: '100%',
      height: '100%',
      position: 'relative' as const,
    };
  };

  const getImageStyles = () => {
    if (aspectRatio) {
      return {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
      };
    }
    return {};
  };

  return (
    <div style={getContainerStyles()}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        style={getImageStyles()}
        loading="lazy"
        className="cursor-zoom-in"
        onClick={() => showModalImgFunction(img)}
      />
    </div>
  );
};

export default DynamicImgSlider;
