import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.nextUrl.searchParams;

  //params
  const category = searchParams.get("category");
  const rooms = searchParams.get("rooms");
  const street = searchParams.get("street");
  const companyName = searchParams.get("companyName");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const renovation = searchParams.get("renovation");
  const floor = searchParams.get("floor");
  const floors = searchParams.get("floors");
  const sPage = searchParams.get("page");
  const page = sPage ? +sPage : 1;

  //создаем пустой объекты фильтра, куда потом буду попадать все значения фильтра
  let filter = {};

  try {
    const countCategory = await db.objectIntrum.groupBy({
      by: ["category"],
      _count: true,
      where: {
        ...(category ? { category: { contains: category } } : {}),
      },
    });

    const countRooms = await db.objectIntrum.groupBy({
      by: ["rooms"],
      _count: true,
      where: {
        ...(rooms ? { rooms: { contains: rooms } } : {}),
      },
    });

    const countRenovation = await db.objectIntrum.groupBy({
      by: ["renovation"],
      _count: true,
      where: {
        ...(renovation ? { renovation: { contains: renovation } } : {}),
      },
    });

    const countStreet = await db.objectIntrum.groupBy({
      by: ["street"],
      _count: true,
      where: {
        ...(street ? { street: { contains: street } } : {}),
      },
    });

    const countCompanyName = await db.objectIntrum.groupBy({
      by: ["companyName"],
      _count: true,
      where: {
        ...(companyName ? { companyName: { contains: companyName } } : {}),
      },
    });


    const countFloor = await db.objectIntrum.groupBy({
      by: ["floor"],
      _count: true,
      where: {
        ...(floor ? { floor: { contains: floor } } : {}),
      },
    });

    const countFloors = await db.objectIntrum.groupBy({
      by: ["floors"],
      _count: true,
      where: {
        ...(floors ? { floors: { contains: floors } } : {}),
      },
    });

    //Если фильтры не выбраны, то отсылаем все доступные значения для филтра по умолчанию
    if (!category && !rooms && !street && !companyName && !renovation && !floors) {
      filter = {
        category: countCategory.map((el) => el.category),
        rooms: countRooms.map((el) => el.rooms),
        renovation: countRenovation.map((el) => el.renovation),
        //@ts-ignore
        street: countStreet.map((el) => el.street),
        companyName: countCompanyName.map((el) => el.companyName),
        floor: countFloor.map((el) => el.floor),
        floors: countFloors.map((el) => el.floors),
      };
    }

    //Объекты 10шт. которые увидит клиент на странице
    const allObjects = await db.objectIntrum.findMany({
      where: {
        active: true,
        // thubmnail: {
        //   isEmpty: false, // Проверка, что массив не пустой
        // },
        ...(category ? { category: { contains: category } } : {}),
        ...(rooms ? { rooms: { contains: rooms } } : {}),
        ...(renovation ? { renovation: { contains: renovation } } : {}),
        ...(street ? { street: { contains: street } } : {}),
        ...(companyName ? { companyName: { contains: companyName } } : {}),
        ...(floor ? { floor: { contains: floor } } : {}),
        ...(floors ? { floors: { contains: floors } } : {}),
        ...(minPrice && maxPrice
          ? { price: { gte: parseInt(minPrice), lte: parseInt(maxPrice) } }
          : {}),
      },
      orderBy: {
        createdAt: "desc" 
      },
      skip: (page - 1) * 10,
      take: 10,
    });

    // Все отфильтрованные объекты (кроме тех 10,что увидит клиент) и определенные поля
    const allFilteredObject = await db.objectIntrum.findMany({
      where: {
        active: true,
        // thubmnail: {
        //   isEmpty: false, // Проверка, что массив не пустой
        // },
        ...(category ? { category: { contains: category } } : {}),
        ...(rooms ? { rooms: { contains: rooms } } : {}),
        ...(renovation ? { renovation: { contains: renovation } } : {}),
        ...(street ? { street: { contains: street } } : {}),
        ...(companyName ? { companyName: { contains: companyName } } : {}),
        ...(floor ? { floor: { contains: floor } } : {}),
        ...(floors ? { floors: { contains: floors } } : {}),
        ...(minPrice && maxPrice
          ? { price: { gte: parseInt(minPrice), lte: parseInt(maxPrice) } }
          : {}),
      },
      select: {
        category: true,
        rooms: true,
        renovation:true,
        street: true,
        companyName: true,
        floor:true,
        floors:true,
        price: true,
      },
    });

    //Если есть значения в фильтре, то сохраняем их в объект filter, беря их из все объектов
    //а не только с первой страницы из 10 объектов
    if (category || rooms || street || companyName || renovation || floor || floors) {
      filter = {
        category: [...new Set(allFilteredObject.map((el) => el.category))],
        rooms: [...new Set(allFilteredObject.map((el) => el.rooms))],
        renovation: [...new Set(allFilteredObject.map((el) => el.renovation))],
        floor: [...new Set(allFilteredObject.map((el) => el.floor))],
        floors: [...new Set(allFilteredObject.map((el) => el.floors))],
        //@ts-ignore
        street: [...new Set(allFilteredObject.map((el) => el.street))],
        companyName: [
          ...new Set(allFilteredObject.map((el) => el.companyName)),
        ],
      };
    }

    if (allObjects.length > 0) {
      const prices = allFilteredObject.map((obj) => obj.price);
      prices.length > 0 ? 
        (filter = {
            ...filter, // Копируем предыдущие свойства из filter
            //@ts-ignore
            maxPrice: Math.max(...prices).toString(),
            //@ts-ignore
            minPrice: minPrice ? Math.min(...prices).toString() : 0,
          })
        : null;

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
