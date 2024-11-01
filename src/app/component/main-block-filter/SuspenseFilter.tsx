import { ObjectIntrum } from "@prisma/client";

import { Suspense } from "react";
import ParentFilterBlock from "./ParentFilterBlock";
import React from "react";

type Props = {
  objects: ObjectIntrum[];
  pages: number;
  page: number;
  priceMax: number;
};

function SuspenseFilter({ objects, pages, page, priceMax }: Props) {
  return (
    <>
      <Suspense fallback={null}>
        {objects && objects.length > 0 && (
          <ParentFilterBlock
            objects={objects}
            pages={pages}
            page={page}
            priceMax={priceMax}
          />
        )}
      </Suspense>
    </>
  );
}

export default React.memo(SuspenseFilter);
