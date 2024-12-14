import React from "react";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@/app/component/provider/ThemeProvider";
import { checkTheme } from "@/shared/utils";


type ThemedSkeletonProps = {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
};

const FilterSkeleton: React.FC<ThemedSkeletonProps> = ({
  width = "100%",
  height = "48px",
  borderRadius = "20px",
}) => {
  const { theme } = useTheme();

  return (
    <Skeleton
      variant="rectangular"
      animation="pulse"
      width={width}
      height={height}
      sx={{
        borderRadius,
        bgcolor: checkTheme(
          theme,
          "#4a4f58", // Цвет для темной темы
          "rgba(255, 255, 255, .7)" // Цвет для светлой темы
        ),
      }}
    />
  );
};

export default FilterSkeleton;
