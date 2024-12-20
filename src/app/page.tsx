import "server-only";
import db from "../../prisma";
import { Metadata } from 'next'
import { AllHeader } from "./component/allHeader/AllHeader";
import dynamicImport from 'next/dynamic';
import SuspenseFilter from "./component/main-block-filter/SuspenseFilter";
const Footer = dynamicImport(() => import("./component/folder/Footer"));
 
export const metadata: Metadata = {
  title: 'Мультилистинг Волгоград',
}

export const dynamic = 'force-dynamic'

async function getObjects(page?: string) {
  const objectsNum = await db.objectIntrum.count();
  const curPage =
    page && Number.isInteger(+page) && +page > 0 && +page <= Math.ceil(objectsNum / 10)
      ? +page
      : 1;
  try {
    const objects = await db.objectIntrum.findMany({
      where: {
        active: true,
        operationType:'Продам',
        thubmnail: {
          isEmpty: false,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (curPage - 1) * 10,
      take: 10,
    });

    const maxPriceDb = await db.objectIntrum.aggregate({
      _max: {
        price: true
      },
      where: {
        active: true,
        operationType: 'Продам'
      }
    });
    let priceMax = maxPriceDb._max.price!== undefined  ? maxPriceDb._max.price  : 100000000 ;
    if (priceMax && priceMax >= 1000000000) {
      priceMax = 100000000;
    }

    return { 
      objects: objects, pages: Math.ceil(objectsNum / 10), 
      page: curPage, priceMax: priceMax 
    };
   
  } catch (error) {
    console.error(error);
    return { objects: [], pages: 1, page:1 };
  }
}


export default async function Home() {

  const {objects, pages, page, priceMax}  = await getObjects('1');

  return (
    <>
      <AllHeader/>
      { objects && objects.length > 0 && priceMax &&
       <>
         <SuspenseFilter priceMax={priceMax} objects={objects}  pages={pages} page={page}/>
         <Footer/>
       </>
      }
    </>
  );
}
