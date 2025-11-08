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


  // нормализует границы периода
  const toDate = (s?: string | null) => new Date((s ?? "2022-01-30") as string);
  const start = toDate(date); // включительно
  const endExclusive = new Date(toDate(dateEnd).getTime() + 24 * 60 * 60 * 1000); // следующий день (исключительно)

  try {
    const applicationsExcel = await db.constructionApplications.findMany({
      where: {
        createdAtCrm: {
          lte: dateEnd? dateEnd : "2022-01-30",
          gte: date ? date : "2022-01-30",
        },
        typeApplicationCrm:'ЖДД'
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    if (table) {
      applications = await db.constructionApplications.findMany({
        where: {
          typeApplicationCrm:'ЖДД',
          createdAtCrm: {
            lte: dateEnd? dateEnd : "2022-01-30",
            gte: date ? date : "2022-01-30",
          },
          translator: table === '1' ? { in: ['Наш сайт', 'лендинг', 'Вконтакте'] } : 'WhatsApp'
        },
        orderBy: {
          createdAt: 'asc'
        }
        
      });
    } else {
      applications = await db.constructionApplications.findMany({
        where: {
          typeApplicationCrm:'ЖДД',
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


