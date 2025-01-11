import React from "react";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "../provider/ThemeProvider";
import { checkTheme } from "@/shared/utils";

const SkeletonCard: React.FC = () => {
  const { theme } = useTheme();
  const skeletonBackground = checkTheme(
    theme,
    "#3a3f46c9",
    "rgba(255, 255, 255, .7)"
  );
  return (
    <div className="flex justify-center md:justify-start md:w-full mt-[35px] md:mt-[0px]">
      <div
        className={`flex flex-col md:flex-row h-[100%] w-[85vw] sm:w-[320px] md:w-full md:h-[250px] xxl:h-[300px] sm:p-2 md:mt-[10px] md:gap-[50px]`}
      >
        {/* Image Skeleton */}
        <div className="flex flex-col w-[auto] h-[100%] md:justify-around">
          <div className="flex w-[100%] h-[200px] sm:w-[300px] sm:h-[260px] lg:w-[400px] lg:h-[98%] relative overflow-hidden">
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{ borderRadius: "8px", bgcolor: skeletonBackground }}
            />
          </div>
        </div>

        {/* Text Skeleton */}
        <div className="flex mt-[5px] gap-[5px] md:mt-[0px] flex-col w-full h-full items-start md:gap-[20px]">
          <Skeleton
            sx={{ bgcolor: skeletonBackground }}
            variant="text"
            width="80%"
            height="24px"
          />
          <Skeleton
            sx={{ bgcolor: skeletonBackground }}
            variant="text"
            width="60%"
            height="20px"
          />
          <Skeleton
            sx={{ bgcolor: skeletonBackground }}
            variant="text"
            width="40%"
            height="20px"
          />
          <div className="hidden md:flex flex-col md:flex-row gap-[5px] md:gap-[40px] mt-[5px] md:mt-[30px]">
            <Skeleton
              sx={{ bgcolor: skeletonBackground }}
              variant="text"
              width="30%"
              height="20px"
            />
            <Skeleton
              sx={{ bgcolor: skeletonBackground }}
              variant="text"
              width="30%"
              height="20px"
            />
          </div>
          <Skeleton
            sx={{ bgcolor: skeletonBackground }}
            variant="text"
            width="50%"
            height="30px"
          />
        </div>
      </div>
    </div>
  );
};

const ProgressBar: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full gap-[20px] overflow-hidden">
      {Array.from({ length: 10 }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default ProgressBar;
