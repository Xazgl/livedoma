import "server-only";
import { Header } from "../component/header/Header";
import { MobileHeader } from "../component/mainBarMobile/MobileBar";
import { Metadata } from "next";
import { Mortgage } from "../component/mortgage/Mortgage";

 
export const metadata: Metadata = {
  title: 'Ипотека Волгоград',
}

// export const dynamic = 'force-dynamic'



export default async function Home() {



  return (
    <>
      <Header />
      <MobileHeader />
      <Mortgage/>
 
    </>
  );
}
