//@ts-check
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function start() {
  try {
    const startDate = new Date("2025-12-02T00:00:00Z");

    // Берём всех пользователей
    const users = await db.usersForMailing.findMany({
      select: {
        phoneNumber: true,
      },
    });

    for (const user of users) {
      const { phoneNumber } = user;

      // Приводим номер пользователя к формату без + и оставляем последние 10 цифр
      const normalizedUserPhone = phoneNumber.replace(/\D/g, '').slice(-10);

      // Ищем записи в constructionApplications
      const crmRecords = await db.constructionApplications.findMany({
        where: {
          translator: "WhatsApp",
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          id: true,
          phone: true,
          datecallCenter: true,
          timecallCenter: true,
          url: true,
          desc: true,
          status: true,
          createdAt: true,
        },
      });

      // Фильтруем по совпадению последних 10 цифр
      const matchedRecords = crmRecords.filter(record => {
        if (!record.phone) return false;
        const normalizedCrmPhone = record.phone.replace(/\D/g, '').slice(-10);
        return normalizedCrmPhone === normalizedUserPhone;
      });

      if (matchedRecords.length > 0) {
        console.log(`Номер: ${phoneNumber}`);
        matchedRecords.forEach(record => {
          console.log({
            id: record.id,
            phone: record.phone,
            datecallCenter: record.datecallCenter,
            timecallCenter: record.timecallCenter,
            desc: record.desc,
            status: record.status,
            createdAt: record.createdAt.toISOString(),
          });
        });
      }
    }
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
  } finally {
    await db.$disconnect();
  }
}

start();
