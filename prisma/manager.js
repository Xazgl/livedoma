const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function copyManagers() {
  try {
    // За два дня 
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Получаем все записи из Wazzup за последние два дня, где typeSend != "Очередь"
    const wazzupRecords = await db.wazzup.findMany({
      where: {
        createdAt: {
          gte: twoDaysAgo,
        },
        typeSend: {
          not: "Очередь",
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Получаем все записи из Tilda за последние два дня, где typeSend != "Очередь"
    const tildaRecords = await db.tilda.findMany({
      where: {
        createdAt: {
          gte: twoDaysAgo,
        },
        typeSend: {
          not: "Очередь",
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Копируем записи из Wazzup в таблицу ManagerQueue
    const wazzupPromises = wazzupRecords.map(async (record) => {
      await db.managerQueue.create({
        data: {
          managerId: record.managerId,
          url: record.intrumUrl,
          type: record.typeSend,
          createdAt: record.createdAt,
        },
      });
    });

    // Копируем записи из Tilda в таблицу ManagerQueue
    const tildaPromises = tildaRecords.map(async (record) => {
      await db.managerQueue.create({
        data: {
          managerId: record.managerId,
          url: record.intrumUrl,
          type: record.typeSend,
          createdAt: record.createdAt,
        },
      });
    });

    await Promise.all([...wazzupPromises, ...tildaPromises]);

    console.log("Все данные успешно скопированы в таблицу ManagerQueue.");
  } catch (error) {
    console.error("Ошибка при копировании данных:", error);
  } finally {
    await db.$disconnect();
  }
}

copyManagers();
