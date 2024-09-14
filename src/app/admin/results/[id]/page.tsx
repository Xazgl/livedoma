import "server-only";
import db from "../../../../../prisma";
import ControlTable from "@/app/component/admin/results/ControlTable";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

async function getObjects(identifier?: string) {
  try {
    const reviewLink = await db.reviewLink.findUnique({
      where: { identifier },
    });
    console.log({ identifier, reviewLink });

    if (!reviewLink) {
      // Обработка случая, когда ReviewLink не найден
      console.error(`ReviewLink с идентификатором ${identifier} не найден`);
      return { objects: [] };
    }

    const objectIds = reviewLink.objectIds;

    const objects = await db.inparseObjects.findMany({
      where: {
        id: { in: objectIds },
      },
    });

    return {
      objects: objects,
    };
  } catch (error) {
    console.error(error);
    return { objects: [] };
  }
}

export default async function Home({ params }: { params: { id?: string } }) {
  const { objects } = await getObjects(params.id);

  if (!objects || objects.length === 0) {
    return <div>Данных нет</div>;
  }

  return (
    <>
      {params.id && objects.length > 0 && objects  &&(
          <ControlTable  idPage={params.id}   objectsAll = {objects}/>
      )}
    </>
  );
}
