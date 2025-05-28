"use client";
import dynamic from "next/dynamic";
const MobileHeader = dynamic(() => import("../mainBarMobile/MobileBar"));
const Header = dynamic(() => import("../header/Header"));

export function AllHeader({}) {

  return (
    <>
        <Header /> 
        <MobileHeader /> 
    </>
  );
}
