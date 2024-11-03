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
        NOT: {
          responsibleMain: 'Тест Тестович',
        },
        createdAtCrm: {
          lte: dateEnd? dateEnd : "2022-01-30",
          gte: date ? date : "2022-01-30",
        },
        typeApplicationCrm:'Срочный выкуп'
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    if (table) {
      applications = await db.constructionApplications.findMany({
        where: {
          NOT: {
            responsibleMain: 'Тест Тестович',
          },
          typeApplicationCrm:'Срочный выкуп',
          createdAtCrm: {
            lte: dateEnd? dateEnd : "2022-01-30",
            gte: date ? date : "2022-01-30",
          },
        },
        orderBy: {
          createdAt: 'asc'
        }
        
      });
    } else {
      applications = await db.constructionApplications.findMany({
        where: {
          NOT: {
            responsibleMain: 'Тест Тестович',
          },
          typeApplicationCrm:'Срочный выкуп',
          createdAtCrm: {
            lte: dateEnd? dateEnd : "2022-01-30",
            gte: date ? date : "2022-01-30",
          },
        },
        orderBy: {
          createdAt: 'asc'
        }
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
