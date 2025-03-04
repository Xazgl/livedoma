import React, {  useRef } from "react";
import noPhoto from "/public/images/noPhoto.jpg";

type Props = {
  src: string;
  alt: string;
};


const DynamicCardImg: React.FC<Props> = ({ src, alt }) => {
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = noPhoto.src; 
  };

  const getContainerStyles = () => {
      return {
        width: "100%",
        height: "100%",
        position: "relative" as const,
      };
  };

  const getImageStyles = () => {
      return {
        position: "absolute" as const,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius:'5px',
        objectFit: "cover" as const,
      };
  };

  return (
    <div className="dynamic-image-container" style={getContainerStyles()}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onError={handleError}
        className="dynamic-image"
        style={getImageStyles()}
        //  loading="lazy"
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
            height: 200px; 
          }
        }

        @media (min-width: 1024px) {
          .dynamic-image-container {
            height: 400px;
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(DynamicCardImg);
