"use client";
import dynamic from "next/dynamic";
// import { useEffect, useState } from "react";
// Динамический импорт компонентов фильтра
const MobileHeader = dynamic(() => import("../mainBarMobile/MobileBar"));
const Header = dynamic(() => import("../header/Header"));

export function AllHeader({}) {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//         if(window.innerWidth < 1100){
//           setIsMobile(true);
//         } else if (window.innerWidth > 1100) {
//             setIsMobile( false);
//         }
//     };

//     handleResize(); // Проверка на первой загрузке
//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

  return (
    <>
        <Header /> 
        <MobileHeader /> 
      {/* {isMobile == false ? 
        <Header /> 
        : 
        <MobileHeader /> 
      } */}
    </>
  );
}
