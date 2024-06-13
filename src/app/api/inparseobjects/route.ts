import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";

export async function GET(request: NextRequest,{ params }: { params: { id: string } }) {
  const searchParams = request.nextUrl.searchParams;

  //params
  const street = searchParams.get("street");
  const sPage = searchParams.get("page");
  const page = sPage ? +sPage : 1;

  //создаем пустой объекты фильтра, куда потом буду попадать все значения фильтра
  let filter = {};

  try {

    const countStreet = await db.inparseObjects.groupBy({
      by: ["address"],
      _count: true,
      where: {
        ...(street ? { address: { contains: street } } : {})
      },
    });

    //Если фильтры не выбраны, то отсылаем все доступные значения для филтра по умолчанию
    if (!street) {
      filter = {
        //@ts-ignore
        street: countStreet.map((el) => el.street),
      };
    }

    //Объекты 10шт. которые увидит клиент на странице
    const allObjects = await db.inparseObjects.findMany({
      where: {
        ...(street ? { address: { contains: street } } : {})
      },
      // orderBy: {
      //   createdAt: "desc", // Сортировка по дате добавления в обратном порядке
      // },

      skip: (page - 1) * 10,
      take: 10,
    });

    // Все отфильтрованные объекты (кроме тех 10,что увидит клиент) и определенные поля
    const allFilteredObject = await db.inparseObjects.findMany({
      where: {
        ...(street ? { address: { contains: street } } : {}),
      },
      select: {
        title: true,
        address: true,
        floors:true,
        floor: true,
        url: true,
        source: true,
      },
    });

    //Если есть значения в фильтре, то сохраняем их в объект filter, беря их из все объектов
    //а не только с первой страницы из 10 объектов
    if ( street ) {
      filter = {
        //@ts-ignore
        street: [...new Set(allFilteredObject.map((el) => el.street))],
      };
    }

    if (allObjects.length > 0) {
      const countObjects = allFilteredObject.length;

      return NextResponse.json({
        allObjects,
        filter,
        totalPages: Math.ceil(countObjects / 10),
        countObjects: countObjects,
      });
    } else {
      return new Response("'В базе нету объектов'", { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return new Response("'Запрос не может быть выполнен'", { status: 500 });
  }
}
