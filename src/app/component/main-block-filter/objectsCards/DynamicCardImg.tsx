import React, { useState, useEffect, useRef } from "react";

type Props = {
  src: string;
  alt: string;
};

const DynamicCardImg: React.FC<Props> = ({ src, alt }) => {
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
        width: "100%",
        height: "100%",
        position: "relative" as const,
      };
    }
    return {};
  };

  const getImageStyles = () => {
    if (aspectRatio) {
      return {
        position: "absolute" as const,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius:'5px',
        objectFit: "cover" as const,
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
        className="dynamic-image"
        style={getImageStyles()}
        loading="lazy"
      />

      <style jsx>{`
        /* styles.css */
        .dynamic-image-container {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }

        .dynamic-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @media (max-width: 600px) {
          .dynamic-image-container {
            height: 200px; /* Set a specific height for mobile view */
          }
        }

        @media (min-width: 1024px) {
          .dynamic-image-container {
            height: 400px; /* Set a specific height for larger screens */
          }
        }
      `}</style>
    </div>
  );
};

export default DynamicCardImg;
