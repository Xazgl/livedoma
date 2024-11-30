"use client";
import React from "react";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@/app/component/provider/ThemeProvider";
import { checkTheme } from "@/shared/utils";

type SkeletonLoaderProps = {
  count: number;
  width: string;
};

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count, width }) => {
  const { theme } = useTheme();

  return (
    <>
      {new Array(count).fill(null).map((_, index) => (
        <div key={`skeleton-${index}`} style={{ width }} className="flex">
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="100%"
            height="50px"
            sx={{
              borderRadius: "8px",
              bgcolor: checkTheme(
                theme,
                "#3a3f46c9", 
                "rgba(255, 255, 255, .7)" 
              ),
            }}
          />
        </div>
      ))}
    </>
  );
};

export default React.memo(SkeletonLoader);
