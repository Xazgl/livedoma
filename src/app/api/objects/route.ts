import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";

export async function GET(request: NextRequest,{ params }: { params: { id: string } }) {
  const searchParams = request.nextUrl.searchParams;

  //params
  const category = searchParams.get("category");
  const city = searchParams.get("city");
  const rooms = searchParams.get("rooms");
  const district = searchParams.get("district");
  const street = searchParams.get("street");
  const companyName = searchParams.get("companyName");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const renovation = searchParams.get("renovation");
  const floor = searchParams.get("floor");
  const floors = searchParams.get("floors");
  const sPage = searchParams.get("page");
  const page = sPage ? +sPage : 1;
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc"; // По умолчанию сортируем по убыванию
  const sortPrice =  searchParams.get("sortPrice")? (searchParams.get("sortPrice") === "asc" ? "asc" : "desc") : null; // По умолчанию сортируем по убыванию


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

    const countCity = await db.objectIntrum.groupBy({
      by: ["city"],
      _count: true,
      where: {
        ...(city ? { city: { contains: city } } : {}),
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

    const countDistrict  = await db.objectIntrum.groupBy({
      by: ["district"],
      _count: true,
      where: {
        ...(district  ? { district : { contains: district  } } : {}),
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
    if (!category && !city && !rooms && !street && !district && !companyName && !renovation && !floors) {
      filter = {
        category: countCategory.map((el) => el.category),
        city:countCity.map((el) => el.city),
        rooms: countRooms.map((el) => el.rooms),
        renovation: countRenovation.map((el) => el.renovation),
        //@ts-ignore
        district:countDistrict.map((el) => el.district),
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
        ...(city ? { city: { contains: city } } : {}),
        ...(rooms ? { rooms: { contains: rooms } } : {}),
        ...(renovation ? { renovation: { contains: renovation } } : {}),
        ...(district ? { district: { contains: district } } : {}),
        ...(street ? { street: { contains: street } } : {}),
        ...(companyName ? { companyName: { contains: companyName } } : {}),
        ...(floor ? { floor: { contains: floor } } : {}),
        ...(floors ? { floors: { contains: floors } } : {}),
        ...(minPrice && maxPrice?
            { price: { gte: parseInt(minPrice), lte: parseInt(maxPrice) } } : {}),
      },
      // orderBy: {
      //   createdAt: sortOrder
      // },
      orderBy: sortPrice ? { price: sortPrice } : { createdAt: sortOrder },
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
        ...(city ? { city: { contains: city } } : {}),
        ...(rooms ? { rooms: { contains: rooms } } : {}),
        ...(renovation ? { renovation: { contains: renovation } } : {}),
        ...(district ? { district: { contains: district } } : {}),
        ...(street ? { street: { contains: street } } : {}),
        ...(companyName ? { companyName: { contains: companyName } } : {}),
        ...(floor ? { floor: { contains: floor } } : {}),
        ...(floors ? { floors: { contains: floors } } : {}),
        ...(minPrice && maxPrice
          ? { price: { gte: parseInt(minPrice), lte: parseInt(maxPrice) } }
          : {}),
      },
      // orderBy: {
      //   createdAt: sortOrder 
      // },
      orderBy: sortPrice ? { price: sortPrice } : { createdAt: sortOrder },
      select: {
        category: true,
        city:true,
        rooms: true,
        renovation:true,
        district:true,
        street: true,
        companyName: true,
        floor:true,
        floors:true,
        price: true,
      },
    });

    //Если есть значения в фильтре, то сохраняем их в объект filter, беря их из все объектов
    //а не только с первой страницы из 10 объектов
    if (category || city || rooms || district ||street || companyName || renovation || floor || floors) {
      filter = {
        category: [...new Set(allFilteredObject.map((el) => el.category))],
        city: [...new Set(allFilteredObject.map((el) => el.city))],
        rooms: [...new Set(allFilteredObject.map((el) => el.rooms))],
        renovation: [...new Set(allFilteredObject.map((el) => el.renovation))],
        floor: [...new Set(allFilteredObject.map((el) => el.floor))],
        floors: [...new Set(allFilteredObject.map((el) => el.floors))],
        //@ts-ignore
        district : [...new Set(allFilteredObject.map((el) => el.district))],
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









// import { NextRequest, NextResponse } from "next/server";
// import db, { ObjectIntrum } from "../../../../prisma";

// export async function GET(request: NextRequest,{ params }: { params: { id: string } }) {  const searchParams = request.nextUrl.searchParams;

//   //params
//   const category = searchParams.get("category");
//   const city = searchParams.get("city");
//   const rooms = searchParams.get("rooms");
//   const district = searchParams.get("district");
//   const street = searchParams.get("street");
//   const companyName = searchParams.get("companyName");
//   const minPrice = searchParams.get("minPrice");
//   const maxPrice = searchParams.get("maxPrice");
//   const renovation = searchParams.get("renovation");
//   const floor = searchParams.get("floor");
//   const floors = searchParams.get("floors");
//   const sPage = searchParams.get("page");
//   const page = sPage ? +sPage : 1;
//   const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
//   const sortPrice = searchParams.get("sortPrice") ? (searchParams.get("sortPrice") === "asc" ? "asc" : "desc") : null;

//   let filter = {};

//   try {
//     const countCategory: ObjectIntrum[] = await db.$queryRaw`SELECT category, COUNT(*) FROM "ObjectIntrum" GROUP BY category`;
//     const countCity: ObjectIntrum[] = await db.$queryRaw`SELECT city, COUNT(*) FROM "ObjectIntrum" GROUP BY city`;
//     const countRooms: ObjectIntrum[] = await db.$queryRaw`SELECT rooms, COUNT(*) FROM "ObjectIntrum" GROUP BY rooms`;
//     const countRenovation: ObjectIntrum[] = await db.$queryRaw`SELECT renovation, COUNT(*) FROM "ObjectIntrum" GROUP BY renovation`;
//     const countDistrict: ObjectIntrum[] = await db.$queryRaw`SELECT district, COUNT(*) FROM "ObjectIntrum" GROUP BY district`;
//     const countStreet: ObjectIntrum[] = await db.$queryRaw`SELECT street, COUNT(*) FROM "ObjectIntrum" GROUP BY street`;
//     const countCompanyName: ObjectIntrum[] = await db.$queryRaw`SELECT "companyName", COUNT(*) FROM "ObjectIntrum" GROUP BY "companyName"`;
//     const countFloor: ObjectIntrum[] = await db.$queryRaw`SELECT floor, COUNT(*) FROM "ObjectIntrum" GROUP BY floor`;
//     const countFloors: ObjectIntrum[] = await db.$queryRaw`SELECT floors, COUNT(*) FROM "ObjectIntrum" GROUP BY floors`;

//     // Если фильтры не выбраны, то отсылаем все доступные значения для фильтра по умолчанию
//     if (!category && !city && !rooms && !street && !district && !companyName && !renovation && !floors) {
//       filter = {
//         category: countCategory.map((el: any) => el.category),
//         city: countCity.map((el: any) => el.city),
//         rooms: countRooms.map((el: any) => el.rooms),
//         renovation: countRenovation.map((el: any) => el.renovation),
//         district: countDistrict.map((el: any) => el.district),
//         street: countStreet.map((el: any) => el.street),
//         companyName: countCompanyName.map((el: any) => el.companyName),
//         floor: countFloor.map((el: any) => el.floor),
//         floors: countFloors.map((el: any) => el.floors),
//       };
//     }

//     // Объекты 10шт. которые увидит клиент на странице
//     let  allObjects: ObjectIntrum[] = await db.$queryRawUnsafe(`
//       SELECT * FROM "ObjectIntrum",
//          COALESCE(thubmnail, '{}') AS thubmnail,
//          COALESCE(img, '{}') AS img
//       WHERE active = true
//       ${category ? `AND category ILIKE '%${category}%'` : ''}
//       ${city ? `AND city ILIKE '%${city}%'` : ''}
//       ${rooms ? `AND rooms::text ILIKE '%${rooms}%'` : ''}
//       ${renovation ? `AND renovation ILIKE '%${renovation}%'` : ''}
//       ${district ? `AND district ILIKE '%${district}%'` : ''}
//       ${street ? `AND street ILIKE '%${street}%'` : ''}
//       ${companyName ? `AND "companyName" ILIKE '%${companyName}%'` : ''}
//       ${floor ? `AND floor::text ILIKE '%${floor}%'` : ''}
//       ${floors ? `AND floors::text ILIKE '%${floors}%'` : ''}
//       ${minPrice && maxPrice ? `AND price BETWEEN ${minPrice} AND ${maxPrice}` : ''}
//       ORDER BY ${sortPrice ? `price ${sortPrice}` : `"createdAt" ${sortOrder}`}
//       LIMIT 10 OFFSET ${(page - 1) * 10}
//     `)

//         // Обработка значений img и thubmnail,imgUrl
//         // allObjects = allObjects.map(obj => {
//         //   return {
//         //     ...obj,
//         //     img: obj.img && obj.img.length > 0 ? obj.img: [],
//         //     thubmnail: obj.thubmnail && obj.thubmnail.length > 0 ?  obj.thubmnail: [],
//         //     imgUrl: obj.imgUrl && obj.imgUrl.length > 0 ?  obj.imgUrl: [],
//         //   };
//         // });

//     // Все отфильтрованные объекты (кроме тех 10, что увидит клиент) и определенные поля
//     let allFilteredObject: ObjectIntrum[] = await db.$queryRawUnsafe(`
//       SELECT category, city, rooms, renovation, district, street, "companyName", floor, floors, price FROM "ObjectIntrum"
//       WHERE active = true
//       ${category ? `AND category ILIKE '%${category}%'` : ''}
//       ${city ? `AND city ILIKE '%${city}%'` : ''}
//       ${rooms ? `AND rooms::text ILIKE '%${rooms}%'` : ''}
//       ${renovation ? `AND renovation ILIKE '%${renovation}%'` : ''}
//       ${district ? `AND district ILIKE '%${district}%'` : ''}
//       ${street ? `AND street ILIKE '%${street}%'` : ''}
//       ${companyName ? `AND "companyName" ILIKE '%${companyName}%'` : ''}
//       ${floor ? `AND floor::text ILIKE '%${floor}%'` : ''}
//       ${floors ? `AND floors::text ILIKE '%${floors}%'` : ''}
//       ${minPrice && maxPrice ? `AND price BETWEEN ${minPrice} AND ${maxPrice}` : ''}
//       ORDER BY ${sortPrice ? `price ${sortPrice}` : `"createdAt" ${sortOrder}`}
//     `);



//     // Если есть значения в фильтре, то сохраняем их в объект filter, беря их из всех объектов, а не только с первой страницы из 10 объектов
//     if (category || city || rooms || district || street || companyName || renovation || floor || floors) {
//       filter = {
//         category: [...new Set(allFilteredObject.map((el: any) => el.category))],
//         city: [...new Set(allFilteredObject.map((el: any) => el.city))],
//         rooms: [...new Set(allFilteredObject.map((el: any) => el.rooms))],
//         renovation: [...new Set(allFilteredObject.map((el: any) => el.renovation))],
//         floor: [...new Set(allFilteredObject.map((el: any) => el.floor))],
//         floors: [...new Set(allFilteredObject.map((el: any) => el.floors))],
//         district: [...new Set(allFilteredObject.map((el: any) => el.district))],
//         street: [...new Set(allFilteredObject.map((el: any) => el.street))],
//         companyName: [...new Set(allFilteredObject.map((el: any) => el.companyName))],
//       };
//     }

//     if (allObjects.length > 0) {
//       const prices = allFilteredObject.map((obj: any) => obj.price);
//       prices.length > 0
//         ? (filter = {
//             ...filter, // Копируем предыдущие свойства из filter
//             maxPrice: Math.max(...prices).toString(),
//             minPrice: minPrice ? Math.min(...prices).toString() : "0",
//           })
//         : null;

//       const countObjects = allFilteredObject.length;

   
 
//       return NextResponse.json({
//         allObjects,
//         filter,
//         totalPages: Math.ceil(countObjects / 10),
//         countObjects: countObjects,
//       });
//     } else {
//       return new Response("'В базе нету объектов'", { status: 404 });
//     }
//   } catch (error) {
//     console.error(error);
//     return new Response("'Запрос не может быть выполнен'", { status: 500 });
//   }
// }
