import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";

export async function GET(request: NextRequest,{ params }: { params: { id: string } }) {
  const searchParams = request.nextUrl.searchParams;
  //params
  const dateStage = searchParams.get("dateStage");

  //создаем пустой объекты фильтра, куда потом буду попадать все значения фильтра
  let filter = {};

  try {
    const countdateStage = await db.sales.groupBy({
      by: ["dateStage"],
      _count: true,
      where: {
        ...(dateStage ? { dateStage: { contains: dateStage } } : {}),
      },
    });

    //Если фильтры не выбраны, то отсылаем все доступные значения для филтра по умолчанию
    if (!dateStage) {
      filter = {
        dateStage: countdateStage.map((el) => el.dateStage),
      };
    }

    const allFilteredObject = await db.sales.findMany({
      where: {
        ...(dateStage  ? { dateStage : { contains: dateStage } } : {}),
      },
      select: {
        dateStage : true,
      },
    });


    if (dateStage) {
        filter = {
          category: [...new Set(allFilteredObject.map((el) => el.dateStage ))],
        };
      }

    // const allFilteredSales = await db.sales.findMany({
    //   where: {
    //     ...(dateStage ? { dateStage: { contains: dateStage } } : {}),
    //   },
    // });

    const allFilteredSales = await db.sales.findMany({
      where: {
        dateStage: {
          gte:  dateStage?  dateStage : '', 
        }
      }
    });

    return NextResponse.json({
        allFilteredObject:allFilteredObject,
        allFilteredSales:allFilteredSales,
        filter:filter,
        // totalPages: Math.ceil( parseInt(countdateStage) / 10),
        countdateStage: countdateStage,
      });
  } catch {}
}
