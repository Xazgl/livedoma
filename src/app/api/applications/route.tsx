import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  //params
  const date = searchParams.get("date");
  const dateEnd = searchParams.get("dateEnd");
  const table = searchParams.get("table");
  let applications = [];

  try {
   
    const applicationsExcel = await db.constructionApplications.findMany({
      where: {
        createdAt: {
          lte: new Date(dateEnd? dateEnd : "2022-01-30"),
          gte: new Date(date ? date : "2022-01-30"),
        },
      },
    });

    if (table) {
      applications = await db.constructionApplications.findMany({
        where: {
          createdAt: {
             lte: new Date(dateEnd? dateEnd : "2022-01-30"),
            gte: new Date(date ? date : "2022-01-30"),
          }, 
          translator: table === '1' ? { in: ['Наш сайт', 'лендинг'] } : 'WhatsApp'
        },
      });
    } else {
      applications = await db.constructionApplications.findMany({
        where: {
          createdAt: {
            lte: new Date(dateEnd? dateEnd : "2022-01-30"),
            gte: new Date(date ? date : "2022-01-30"),
          },
        },
      });
    }

    return NextResponse.json({
      applicationsExcel: applicationsExcel,
      allFilteredSales: applications,
    });
  } catch {
    return NextResponse.json({
      applicationsExcel: [],
      allFilteredSales: [],
    });
  }
}
