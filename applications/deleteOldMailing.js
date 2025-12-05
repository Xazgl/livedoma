const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function deleteOldMailing() {
    const now = new Date();

    const res = await db.usersForMailing.deleteMany({
        where: {
            deleteAt: {
                lte: now,
            },
        },
    });

    console.log(`Удалено записей с deleteAt <= ${now.toISOString()}: ${res.count}`);

    await db.$disconnect();
}

deleteOldMailing()
    .then(() => {
        console.log("Завершено");
    })
    .catch((e) => {
        console.error("Ошибка при очистке", e);
        db.$disconnect();
        process.exit(1);
    });
