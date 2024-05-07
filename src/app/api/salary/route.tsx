import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";

export async function GET(request: NextRequest,{ params }: { params: { id: string } }) {

  const searchParams = request.nextUrl.searchParams;
  //params
  const date = searchParams.get("date");
  const dateEnd = searchParams.get("dateEnd");

  let sales = [];

  try {
   
     sales = await db.sales.findMany({
      where: {
        dateStage: {
          lte: dateEnd? dateEnd : "2022-01-30",
          gte: date ? date : "2022-01-30",
        },
      },
    });

    return NextResponse.json({
      sales: sales,
      allFilteredSales: sales
    });
  } catch {
    return NextResponse.json({
      applicationsExcel: [],
      allFilteredSales: [],
    });
  }
}
