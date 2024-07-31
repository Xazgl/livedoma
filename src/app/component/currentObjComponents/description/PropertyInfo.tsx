"use client";
import React from "react";
import Image from 'next/image';
import { useTheme } from "../../provider/ThemeProvider";

type PropertyInfoProps = {
  icon: string;
  label: string;
  value: string | number;
};

const PropertyInfo: React.FC<PropertyInfoProps> = ({ icon, label, value }) => {
  const { theme } = useTheme();
  return (
    <div className="flex gap-[10px] h-[40px]">
      <div className="flex flex-col h-full">
        <Image src={icon} alt={label} />
      </div>
      <div className="flex flex-col h-full">
        <span className="flex text-[#737a8e] text-sm">{label}</span>
        <span className={`flex font-bold text-sm  ${theme === "dark"? "text-[white]":"text-[black]"}`}>{value}</span>
      </div>
    </div>
  );
};

export default PropertyInfo;