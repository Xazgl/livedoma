import "server-only";
import { Metadata } from "next";
import { Mortgage } from "../component/mortgage/Mortgage";
import { AllHeader } from "../component/allHeader/AllHeader";
import dynamic from 'next/dynamic';
const Footer = dynamic(() => import("@/app/component/folder/Footer"));

 
export const metadata: Metadata = {
  title: 'Ипотека Волгоград',
}

// export const dynamic = 'force-dynamic'



export default async function Home() {



  return (
    <>
      <AllHeader/>
      <Mortgage/>
      <Footer/>
 
    </>
  );
}
