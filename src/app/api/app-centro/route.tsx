import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get("date");
  const dateEnd = searchParams.get("dateEnd");
  const startDate = date ? new Date(date) : new Date("2022-01-30");
  const endDate = dateEnd ? new Date(dateEnd) : new Date("2022-01-30");

  try {
    const applications = await db.tilda.findMany({
      where: {
        typeSend: "Tilda Опрос ОП",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
        orderBy: {
          createdAt: "asc",
        },
    });

    return NextResponse.json({
      applicationsExcel: applications,
      allFilteredSales: applications,
    });
  } catch {
    return NextResponse.json({
      applicationsExcel: [],
      allFilteredSales: [],
    });
  }
}
