const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient()


async function normalizeWazzupNumbers() {
    try {
        const allWazzupRecords = await db.wazzup.findMany();
        const updatePromises = allWazzupRecords.map(async (record) => {
            const { id, phone } = record;
            if (!phone.startsWith('+') && phone !== 'Admin') {
                const updatedPhone = `+${phone}`;
                await db.wazzup.update({
                    where: { id },
                    data: { phone: updatedPhone },
                });
            }
        });

        await Promise.all(updatePromises);

        console.log("Все номера телефонов успешно обновлены.");
    } catch (error) {
        console.error("Ошибка при обновлении номеров телефонов:", error);
    }
}
normalizeWazzupNumbers();