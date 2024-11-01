import "server-only";
import { FilterUserOptions } from "../../../@types/dto";
import db from "../../../prisma";
import { AllHeader } from "../component/allHeader/AllHeader";
import ParentFilterBlock from "../component/main-block-filter/ParentFilterBlock";


export const dynamic = "force-dynamic";

async function getObjects(page?: string, filter?: FilterUserOptions) {
  const objectsNum = await db.objectIntrum.count();
  const curPage =
    page &&
    Number.isInteger(+page) &&
    +page > 0 &&
    +page <= Math.ceil(objectsNum / 10)
      ? +page
      : 1;
  try {
    const objects = await db.objectIntrum.findMany({
      where: {
        active: true,
        operationType: "Продам",
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
      objects: objects,
      pages: Math.ceil(objectsNum / 10),
      page: curPage,
      priceMax:priceMax
    };
  } catch (error) {
    console.error(error);
    return { objects: [], pages: 1, page: 1 };
  }
}

export default async function Home({ params }: { params: { page?: string } }) {

  const { objects, pages, page, priceMax} = await getObjects(params.page);

  return (
    <>
      <AllHeader/>
      {objects && objects.length > 0 && priceMax && (
        <ParentFilterBlock
          objects={objects}
          pages={pages}
          page={page}
          priceMax={priceMax}
        />
      )}
    </>
  );
}
