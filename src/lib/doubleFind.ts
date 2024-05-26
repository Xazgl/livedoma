import db from "../../prisma";

export async function doubleFind(phone: string) {

  const doubleMessageOne = await db.tilda.findFirst({
    where: {
      phone: phone,
    },
  });

  const doubleMessageTwo = await db.wazzup.findFirst({
    where: {
      phone: phone,
    },
  });

  console.log({doubleMessageOne:doubleMessageOne,doubleMessageTwo:doubleMessageTwo  })
  
  if(!doubleMessageOne && !doubleMessageTwo) {
    return false;
  } else {
    return true;
  }

}


