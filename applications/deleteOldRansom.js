const axios = require('axios').default;
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

/**
 * Удаляющий батч: берёт заявки  в CRM с publish=0 по ЖК Победа и удаляем из БД
 */
async function startBatchDelete(fromDate, toDate) {
    const params = new URLSearchParams();
    params.append("apikey", "9a75fc323d968db797ec0ab848572aad");
    params.append("params[types][0]", "3");
    params.append("params[publish]", "0");
    params.append("params[limit]", "499")
    params.append("params[date][from]", fromDate);
    params.append("params[date][to]", toDate);
    params.append("params[fields][0][id]", "3667");
    params.append("params[fields][0][value]", '1');

    try {
        const response = await axios.post(
            'http://jivemdoma.intrumnet.com:81/sharedapi/applications/filter',
            params,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const data = response.data?.data?.list || [];
        console.log(`Deleting by CRM publish=0 from ${fromDate} to ${toDate}. Found in CRM: ${data.length}`);

        for (const application of data) {
            const existing = await db.constructionApplications.findFirst({
                where: { idApplicationIntrum: application.id, typeApplicationCrm: 'Срочный выкуп' },
            });

            if (existing) {
                // Логируем перед удалением
                console.log(
                    `[DELETE] DB.id=${existing.id} | CRM.id=${application.id} | url=https://jivemdoma.intrumnet.com/crm/tools/exec/request/${application.id}#request`
                );

                await db.constructionApplications.delete({
                    where: { id: existing.id },
                });
            } else {
                // Если в нашей БД записи уже нет — просто информируем
                console.log(
                    `[SKIP] Not found in DB for CRM.id=${application.id} (nothing to delete)`
                );
            }
        }

        console.log(`Батч (delete) ${fromDate} → ${toDate} завершён`);
    } catch (error) {
        console.error(`Ошибка удаления для периода ${fromDate} - ${toDate}:`, error);
        throw error;
    }
}


async function startDelete() {
    const currentDate = new Date();
    let toDate = currentDate;
    const batchSize = 30; // Количество дней в одном батче 
    const totalBatches = 25; // Общее количество батчей 

    for (let i = 0; i < totalBatches; i++) {
        const fromDate = new Date(toDate.getTime() - (batchSize * 24 * 60 * 60 * 1000));
        await startBatchDelete(fromDate.toISOString().split('T')[0], toDate.toISOString().split('T')[0]);
        toDate = fromDate;

        if (i < totalBatches - 1) {
            // пауза 1,5 минуты между батчами
            await new Promise(resolve => setTimeout(resolve, 90 * 1000));
        }
    }

    console.log("Удаление по publish=0 завершено.");
}


startDelete();