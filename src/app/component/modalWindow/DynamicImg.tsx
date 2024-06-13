import React, { useState, useEffect, useRef } from 'react';


type Props = {
  src: string;
  alt: string;
};

const DynamicImage: React.FC<Props> = ({ src, alt }) => {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const { width, height } = img;
      setAspectRatio(width / height);
    };
  }, [src]);

  const getContainerStyles = () => {
    if (aspectRatio) {
      return {
        width: '100%', // Adjust as needed
        paddingTop: `${100 / aspectRatio}%`,
        position: 'relative' as const,
      };
    }
    return {};
  };

  const getImageStyles = () => {
    if (aspectRatio) {
      return {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain' as const,
      };
    }
    return {};
  };

  return (
    <div className="dynamic-image-container" style={getContainerStyles()}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="dynamic-image zoom-in"
        style={getImageStyles()}
        loading="lazy"
      />
    </div>
    
  );
};

export default DynamicImage;
