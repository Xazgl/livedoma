import { ObjectIntrum } from "@prisma/client";
import { ParentFilterBlock } from "./ParentFilterBlock";
import { Suspense } from "react";

type Props = {
  objects: ObjectIntrum[];
  pages: number;
  page: number;
};

export function SuspenseFilter({ objects, pages, page }: Props) {
  return (
    <>
     <Suspense fallback={null}>
      {objects && objects.length > 0 && (
        <ParentFilterBlock objects={objects} pages={pages} page={page} />
      )}
      </Suspense>
    </>
  );
}
