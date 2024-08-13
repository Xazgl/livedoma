import db from "../../prisma";
import { differenceInHours } from 'date-fns';


export async function doubleFind(phone: string) {
  const doubleMessageOne = await db.tilda.findFirst({
    where: {
      phone: phone,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const doubleMessageTwo = await db.wazzup.findFirst({
    where: {
      phone: phone,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  console.log({ doubleMessageOne: doubleMessageOne, doubleMessageTwo: doubleMessageTwo });

  const now = new Date();

  // Check for duplicates within the last 24 hours
  if (doubleMessageOne && differenceInHours(now, new Date(doubleMessageOne.createdAt)) <= 24) {
    return { isDuplicate: true, within24Hours: true };
  }

  if (doubleMessageTwo && differenceInHours(now, new Date(doubleMessageTwo.createdAt)) <= 24) {
    return { isDuplicate: true, within24Hours: true };
  }

  if (!doubleMessageOne && !doubleMessageTwo) {
    return { isDuplicate: false, within24Hours: false };
  } else {
    return { isDuplicate: true, within24Hours: false };
  }
}

// export async function doubleFind(phone: string) {

//   const doubleMessageOne = await db.tilda.findFirst({
//     where: {
//       phone: phone,
//     },
//     orderBy: {
//       createdAt: 'desc',
//     },
//   });

//   const doubleMessageTwo = await db.wazzup.findFirst({
//     where: {
//       phone: phone,
//     },
//     orderBy: {
//       createdAt: 'desc',
//     },
//   });

//   console.log({doubleMessageOne:doubleMessageOne,doubleMessageTwo:doubleMessageTwo  })
  
//   if(!doubleMessageOne && !doubleMessageTwo) {
//     return false;
//   } else {
//     return true;
//   }

// }


