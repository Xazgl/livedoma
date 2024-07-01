import { NextRequest, NextResponse } from "next/server";
import db, { InparseObjects } from "../../../../prisma";
import { isExactMatchThree } from "@/lib/foundAdress";
// import { normalizeAddressApi } from "@/lib/inparseExcel";




export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    try {
       // Загружаем все объекты из баз данных параллельно
      const [allInparseObjects, allIntumAddresses] = await Promise.all([
        db.inparseObjects.findMany(),
        db.objectIntrum.findMany({select: {street: true}}).then(objects => objects.map(obj => obj.street)),
      ]);

      let results: InparseObjects[] = [];
      //делаем батч по 200 объектов
      const batchSize = 100;

      for (let i = 0; i < allInparseObjects.length; i += batchSize) {
        const batch = allInparseObjects.slice(i, i + batchSize);
        for (const inparseObj of batch) {
          console.log(inparseObj.idInparse)
          const isUnique = await Promise.all(allIntumAddresses.map(async (address) => {
            return await isExactMatchThree(address!, inparseObj.address);
          })).then(matches => matches.every(match => match === false));

          if (isUnique) {
            results.push(inparseObj);
          }
        }
      }

      return NextResponse.json({ results }, { status: 200 });
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}


// export async function GET(req: NextRequest) {
//   if (req.method === "GET") {
//     try {
//       // Загружаем все объекты из баз данных параллельно
//       const [allInparseObjects, allIntumAddresses] = await Promise.all([
//         db.inparseObjects.findMany(),
//         db.objectIntrum.findMany({ select: { street: true } }).then(objects => objects.map(obj => obj.street)),
//       ]);

//       let results: InparseObjects[] = [];
//       const batchSize = 400;// батч по 400 объектов 

//       const limitConcurrency = async (tasks: any[], limit: number) => {
//         const results = [];
//         const executing: Promise<void>[] = [];

//         for (const task of tasks) {
//           const p = Promise.resolve().then(() => task());
//           results.push(p);

//           if (limit <= tasks.length) {
//             const e: any = p.then(() => executing.splice(executing.indexOf(e), 1));
//             executing.push(e);
//             if (executing.length >= limit) {
//               await Promise.race(executing);
//             }
//           }
//         }

//         return Promise.all(results);
//       };

//       const processBatch = async (batch: InparseObjects[]) => {
//         const tasks = batch.map(inparseObj => async () => {
//           const isUnique = await Promise.all(allIntumAddresses.map(address => {
//             console.log(inparseObj.idInparse)
//             return isExactMatchThree(address!, inparseObj.address);
//           })).then(matches => matches.every(match => match === false));

//           if (isUnique) {
//             results.push(inparseObj);
//           }
//         });

//         await limitConcurrency(tasks, 7); // Ограничение до 7 параллельных задач
//       };

//       const batches = [];
//       for (let i = 0; i < allInparseObjects.length; i += batchSize) {
        
//         batches.push(allInparseObjects.slice(i, i + batchSize));
//       }

//       await Promise.all(batches.map(processBatch));

//       return NextResponse.json({ results }, { status: 200 });
//     } catch (error) {
//       console.error("Error processing request:", error);
//       return NextResponse.json(
//         { error: "Internal Server Error" },
//         { status: 500 }
//       );
//     }
//   }
// }



















// export async function GET(req: NextRequest) {
//   if (req.method === "GET") {
//     try {
//        // Загружаем все объекты из баз данных параллельно
//       const [allInparseObjects, allIntrumObjects] = await Promise.all([
//         db.inparseObjects.findMany(),
//         db.objectIntrum.findMany(),
//       ]);

//       let results: InparseObjects[] = [];

//       // Создаем словарь для быстрого поиска объектов Inparse по адресу
//       const inparseAddressMap: { [key: string]: InparseObjects[] } = {};
//       allInparseObjects.forEach((obj) => {
//         const address = normalizeAddressApi(obj.address);
//         if (!inparseAddressMap[address]) {
//           inparseAddressMap[address] = [];
//         }
//         inparseAddressMap[address].push(obj);
//       });

//       const batchSize = 200;
//       for (let i = 0; i < allIntrumObjects.length; i += batchSize) {
//         const batch = allIntrumObjects.slice(i, i + batchSize);
//         for (const obj of batch) {
//           console.log(obj.id_intrum);
//           const address = obj.street;
//           if (address) {
//             const normalizedAddress = normalizeAddressApi(
//               address.replace(/\d+/g, "").trim().split(" ")[0]
//             );
//             console.log(normalizedAddress)

//             const foundObjects = inparseAddressMap[normalizedAddress] || [];

//             // Проверка на уникальность через функцию isExactMatchThree
//             for (const inparseObj of foundObjects) {
//                await Promise.all(allIntrumObjects.map(async (intrumObj) => {
//                   const isMatch =  await isExactMatchThree(
//                     intrumObj.street!,
//                     inparseObj.address
//                   );
//                   if (isMatch == false) {
//                     results.push(inparseObj);
//                   }
//                 })
//               );

//               // const isUnique = isMatchArray.every(isMatch => isMatch === false);

//               // if (isUnique) {
//               //   results.push(inparseObj);
//               // }
//             }
//           }
//         }
//       }

//       return NextResponse.json({ results }, { status: 200 });
//     } catch (error) {
//       console.error("Error processing request:", error);
//       return NextResponse.json(
//         { error: "Internal Server Error" },
//         { status: 500 }
//       );
//     }
//   }
// }

// export async function GET(req: NextRequest) {
//   if (req.method === "GET") {
//     try {
//       // Загружаем все объекты из баз данных параллельно
//       const [allInparseObjects, allIntrumObjects] = await Promise.all([
//         db.inparseObjects.findMany(),
//         db.objectIntrum.findMany(),
//       ]);

//       let results: InparseObjects[] = [];

//       // Создаем словарь для быстрого поиска объектов Inparse по адресу
//       const inparseAddressMap: { [key: string]: InparseObjects[] } = {};
//       allInparseObjects.forEach((obj) => {
//         const address =  normalizeAddressApi(obj.address);
//         if (!inparseAddressMap[address]) {
//           inparseAddressMap[address] = [];
//         }
//         inparseAddressMap[address].push(obj);
//       });

//       for (const obj of allIntrumObjects) {
//         console.log(obj.id_intrum);
//         const address = obj.street;
//         if (address) {
//           const normalizedAddress =  normalizeAddressApi(
//             address.replace(/\d+/g, "").trim().split(" ")[0]
//           );

//           // Найти все совпадающие объекты в InparseObjects
//           const foundObjects = inparseAddressMap[normalizedAddress] || [];

//           // Проверка на уникальность через функцию isExactMatchTwo
//           for (const inparseObj of foundObjects) {
//             await Promise.all(
//               allIntrumObjects.map(async (intrumObj) => {
//                 const match = await isExactMatchThree(
//                   intrumObj.street || "",
//                   inparseObj.address
//                 );
//                 if (match == false) {
//                   results.push(inparseObj);
//                 }
//               })
//             );
//           }
//         }
//       }

//       // Предполагается, что ответ содержит массив объектов
//       return NextResponse.json({ results }, { status: 200 });
//     } catch (error) {
//       console.error("Error processing request:", error);
//       return NextResponse.json(
//         { error: "Internal Server Error" },
//         { status: 500 }
//       );
//     }
//   }
// }

// export async function GET(req: NextRequest, res: NextResponse) {
//   if (req.method === "GET") {
//     try {
//       console.log('1')
//       // Загружаем все объекты из баз данных параллельно
//       const [allInparseObjects, allIntrumObjects] = await Promise.all([
//         db.inparseObjects.findMany(),
//         db.objectIntrum.findMany()
//       ]);

//       let results: InparseAnswer[] = [];

//       for (const obj of allIntrumObjects) {
//         console.log(obj.id_intrum)
//         const address = obj.street;
//         if (address) {
//           const normalizedAddress = normalizeAddress(address.replace(/\d+/g, "").trim().split(' ')[0]);

//           // Найти все совпадающие объекты в InparseObjects
//           const foundObjects = allInparseObjects.filter(inparseObj =>
//             inparseObj.address.toLowerCase().includes(normalizedAddress.toLowerCase())
//           );

//           // Проверка на уникальность через функцию isExactMatchTwo
//           const uniqueFoundObjectsPromises = foundObjects.map(async (inparseObj) => {
//             const isUnique = !(await Promise.all(allIntrumObjects.map(async (intrumObj) => {
//               return await isExactMatchTwo(intrumObj.street || '', inparseObj.address);
//             }))).includes(true);

//             if (isUnique) {
//               return inparseObj;
//             } else {
//               return null;
//             }
//           });

//           const uniqueFoundObjects = (await Promise.all(uniqueFoundObjectsPromises)).filter(obj => obj !== null);

//           const currentObjects: InparseAnswer = {
//             address: obj.street || '',
//             idIntrum: obj.id_intrum,
//             price: obj.price ? obj.price.toString() : '',
//             manager: obj.managerName || '',
//             rooms: obj.rooms || '',
//             objects: uniqueFoundObjects as InparseObjects[],
//           };

//           results.push(currentObjects);
//         }
//       }

//       // Предполагается, что ответ содержит массив объектов
//       return NextResponse.json({ results }, { status: 200 });
//     } catch (error) {
//       console.error("Error processing request:", error);
//       return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
//   }
// }

// function normalizeAddress(address: string): string {
//   // Ваша функция нормализации адреса
//   return address;
// }

// export async function GET(req: NextRequest, res: NextResponse) {
//   if (req.method === "GET") {
//     try {
//       // Загружаем все объекты из баз данных
//       const [allInparseObjects, allIntrumObjects] = await Promise.all([
//         db.inparseObjects.findMany(),
//         db.objectIntrum.findMany()
//       ]);

//       const results: InparseAnswer[] = [];

//       const uniqueObjects = await Promise.all(allIntrumObjects.map(async (obj) => {
//         const address = obj.street;
//         if (!address) return null;

//         const normalizedAddress = normalizeAddress(address.replace(/\d+/g, "").trim().split(' ')[0]);

//         // Найти все совпадающие объекты в InparseObjects
//         const foundObjects = allInparseObjects.filter(inparseObj =>
//           inparseObj.address.toLowerCase().includes(normalizedAddress.toLowerCase())
//         );

//         // Проверка на уникальность через функцию isExactMatchTwo
//         const uniqueFoundObjects = [];
//         for (const inparseObj of foundObjects) {
//           console.log(inparseObj.idInparse)
//           const isUnique = !(await Promise.all(allIntrumObjects.map(async (intrumObj) => {
//             return await isExactMatchTwo(intrumObj.street || '', inparseObj.address);
//           }))).includes(true);

//           if (isUnique) {
//             uniqueFoundObjects.push(inparseObj);
//           }
//         }

//         return {
//           address: obj.street || '',
//           idIntrum: obj.id_intrum,
//           price: obj.price ? obj.price.toString() : '',
//           manager: obj.managerName || '',
//           rooms: obj.rooms || '',
//           objects: uniqueFoundObjects
//         };
//       }));

//       // Фильтрация null значений из результатов
//       results.push(...uniqueObjects.filter(obj => obj !== null) as InparseAnswer[]);

//       // Предполагается, что ответ содержит массив объектов
//       return NextResponse.json({ results }, { status: 200 });
//     } catch (error) {
//       console.error("Error processing request:", error);
//       return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
//   }
// }

// function normalizeAddress(address: string): string {
//   // Ваша функция нормализации адреса
//   return address;
// }
