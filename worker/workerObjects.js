// @ts-check
const { parentPort, workerData } = require('worker_threads');
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient()

async function getObjects() {
  try {
    const {
      category,
      city,
      rooms,
      district,
      street,
      companyName,
      minPrice,
      maxPrice,
      renovation,
      floor,
      floors,
      page,
      sortOrder,
      sortPrice,
    } = workerData;

    let filter = {};

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

    const countDistrict = await db.objectIntrum.groupBy({
      by: ["district"],
      _count: true,
      where: {
        ...(district ? { district: { contains: district } } : {}),
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

    if (!category && !city && !rooms && !street && !district && !companyName && !renovation && !floors) {
      filter = {
        category: countCategory.map((el) => el.category),
        city: countCity.map((el) => el.city),
        rooms: countRooms.map((el) => el.rooms),
        renovation: countRenovation.map((el) => el.renovation),
        district: countDistrict.map((el) => el.district),
        street: countStreet.map((el) => el.street),
        companyName: countCompanyName.map((el) => el.companyName),
        floor: countFloor.map((el) => el.floor),
        floors: countFloors.map((el) => el.floors),
      };
    }

    let allObjects = [];

    if (page === 1 && !category && !city && !rooms && !street && !district && !companyName && !renovation && !floors) {
      allObjects = await db.objectIntrum.findMany({
        where: {
          active: true,
          thubmnail: { isEmpty: false },
        },
        orderBy: sortPrice ? { price: sortPrice } : { createdAt: sortOrder },
        skip: (page - 1) * 10,
        take: 10,
      });
    } else {
      allObjects = await db.objectIntrum.findMany({
        where: {
          active: true,
        },
        orderBy: sortPrice ? { price: sortPrice } : { createdAt: sortOrder },
        skip: (page - 1) * 10,
        take: 10,
      });
    }

    const allFilteredObject = await db.objectIntrum.findMany({
        where: {
          active: true,
          ...(category ? { category: { contains: category } } : {}),
          ...(city ? { city: { contains: city } } : {}),
          ...(rooms ? { rooms: { contains: rooms } } : {}),
          ...(renovation ? { renovation: { contains: renovation } } : {}),
          ...(district ? { district: { contains: district } } : {}),
          ...(street ? { street: { contains: street,mode: "insensitive" } } : {}),
          ...(companyName ? { companyName: { contains: companyName } } : {}),
          ...(floor ? { floor: { contains: floor } } : {}),
          ...(floors ? { floors: { contains: floors } } : {}),
          ...(minPrice !== null &&
          minPrice !== undefined &&
          maxPrice !== null &&
          maxPrice !== undefined
            ? { price: { gte: parseInt(minPrice), lte: parseInt(maxPrice) } }
            : minPrice !== null && minPrice !== undefined
            ? { price: { gte: parseInt(minPrice) } }
            : maxPrice !== null && maxPrice !== undefined
            ? { price: { lte: parseInt(maxPrice) } }
            : {}),
        },
        orderBy: sortPrice ? { price: sortPrice } : { createdAt: sortOrder },
        select: {
          category: true,
          city: true,
          rooms: true,
          renovation: true,
          district: true,
          street: true,
          companyName: true,
          floor: true,
          floors: true,
          price: true,
        },
      });

      const prices = allFilteredObject
      .map((obj) => obj.price)
      .filter((price) => price !== null);
    const maxPriceAlternative =
      prices.length > 0 ? Math.max(...prices).toString() : null;

      if (
        category ||
        city ||
        rooms ||
        district ||
        street ||
        companyName ||
        renovation ||
        floor ||
        floors ||
        minPrice ||
        maxPrice
      ) {
        filter = {
          category: [...new Set(allFilteredObject.map((el) => el.category))],
          city: [...new Set(allFilteredObject.map((el) => el.city))],
          rooms: [...new Set(allFilteredObject.map((el) => el.rooms))],
          renovation: [...new Set(allFilteredObject.map((el) => el.renovation))],
          floor: [...new Set(allFilteredObject.map((el) => el.floor))],
          floors: [...new Set(allFilteredObject.map((el) => el.floors))],
          maxPrice: maxPrice ? maxPrice : maxPriceAlternative,
          minPrice: minPrice ? minPrice : 0,
          //@ts-ignore
          district: [...new Set(allFilteredObject.map((el) => el.district))],
          street: [...new Set(allFilteredObject.map((el) => el.street))],
          companyName: [
            ...new Set(allFilteredObject.map((el) => el.companyName)),
          ],
        };
      }
      if (allObjects.length > 0) {
        const countObjects = allFilteredObject.length;
        if (street) {
            return ({
              allObjects,
              filter,
              totalPages: Math.ceil(countObjects / 10),
              countObjects: countObjects,
              allFilteredObject: allFilteredObject,
            });
          } else {
            return ({
              allObjects,
              filter,
              totalPages: Math.ceil(countObjects / 10),
              countObjects: countObjects,
              allFilteredObject: [],
            });
          }
    }

  } catch (error) {
   return error
  }
}

getObjects().then((result) => {
    parentPort?.postMessage(result);
  });
