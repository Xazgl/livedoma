const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient()

async function updateContactedClientStatus() {
    try {
        // Получаем все записи из модели constructionApplications, где поле contactedClient равно 0 или 1
        const applications = await db.constructionApplications.findMany({
            where: {
                OR: [
                    { contactedClient: '0' },
                    { contactedClient: '1' }
                ]
            }
        });

        // Формируем массив промисов для обновления записей
        const updatePromises = applications.map(async (application) => {
            const { id, contactedClient } = application;

            // Определяем новое значение для поля contactedClient
            let newStatus = '';
            if (contactedClient === '0') {
                newStatus = 'Нет';
            } else if (contactedClient === '1') {
                newStatus = 'Да';
            }

            // Обновляем запись в базе данных
            await db.constructionApplications.update({
                where: { id },
                data: { contactedClient: newStatus },
            });
        });

        // Ждём завершения всех обновлений
        await Promise.all(updatePromises);

        console.log("Статус contactedClient успешно обновлен для всех записей.");
    } catch (error) {
        console.error("Ошибка при обновлении статуса contactedClient:", error);
    } finally {
        // Закрываем соединение с базой данных
        await db.$disconnect();
    }
}

// Выполняем функцию обновления
updateContactedClientStatus();
