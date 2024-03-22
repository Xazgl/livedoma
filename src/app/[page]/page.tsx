import "server-only";
import { Header } from "./../component/header/Header";
import { ParentFilterBlock } from "./../component/main-block-filter/ParentFilterBlock";
import { FilterUserOptions } from "../../../@types/dto";
import db from "../../../prisma";


 export const dynamic = 'force-dynamic'

async function getObjects(page?: string, filter?: FilterUserOptions) {
  const objectsNum = await db.objectIntrum.count();
  const curPage =
    page && Number.isInteger(+page) && +page > 0 && +page <= Math.ceil(objectsNum / 10)
      ? +page
      : 1;
  try {
    const objects = await db.objectIntrum.findMany({
      where: {
        active: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (curPage - 1) * 10,
      take: 10,
    });

    return { objects: objects, pages: Math.ceil(objectsNum / 10), page:curPage };

  } catch (error) {
    console.error(error);
    return { objects: [], pages: 1, page:1 };
    // return [];
  }
}

export default async function Home({
    params,
}: {
  params: { page?: string };
}) {
  // console.log(params);

   const {objects, pages, page}  = await getObjects(params.page);


  return (
    <>
      <Header />
      {objects && objects.length > 0 && 
        <ParentFilterBlock objects={objects} pages={pages} page={page} />
      }
      <div className="flex gap-2 text-black">

      {/* {
        Array(pages).fill(0).map((el, i) => {
          return <Link href={`/${i+1}`}  key={i} >{i+1}</Link>
        })
      } */}
      </div>
    </>
  );
}
