//@ts-check

const axios = require('axios').default;
const { PrismaClient } = require("@prisma/client");
const { AxiosError } = require("axios");
const { foundName } = require("../report/lib");
const { findPhone } = require("./lib");
const { commentArr } = require("./funcComment");

const db = new PrismaClient();

async function startBatch(fromDate, toDate) {
    const params = new URLSearchParams();
    params.append("apikey", "9a75fc323d968db797ec0ab848572aad");
    params.append("params[types][0]", "23");
    params.append("params[publish]", "1");
    params.append("params[limit]", "499");
    params.append("params[date][from]", fromDate);
    params.append("params[date][to]", toDate);

    try {
        const response = await axios.post('http://jivemdoma.intrumnet.com:81/sharedapi/applications/filter', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const data = response.data.data.list;
        console.log(`Processing data from ${fromDate} to ${toDate}`);
        const getField = (fields, id) => {
            return fields[id] ? fields[id].value : null;
        };

        const mappedData = await Promise.all(data.map(async application => {
            const existingSale = await db.constructionApplications.findUnique({
                where: {
                    idApplicationIntrum: application.id,
                },
            });

            function translateStatus(englishStatus) {
                const statusMap = {
                    unselected: "Новое обращение или звонок",
                    processnow: "0",
                    processed: "Встреча состоялась",
                    malformed: "Объект уже продан или снят с продажи",
                    mustbeprocessed: "Согласование встречи",
                    reprocess: "Встреча назначена",
                    postponed: "Встреча отложена",
                    cancelled: "Встречу отменил клиент"
                };

                return statusMap[englishStatus] || 'Статус не найден';
            }

            const phoneValue = getField(application.fields, "5033");
            const phone = typeof phoneValue === 'string' ? phoneValue : await findPhone(application.customer_id);

            if (existingSale) {
                return await db.constructionApplications.update({
                    where: {
                        id: existingSale.id
                    },
                    data: {
                        idApplicationIntrum: application.id,
                        translator: getField(application.fields, "4056") ? getField(application.fields, "4056") : '',
                        responsibleMain: await foundName(application.employee_id) !== '0' || await foundName(application.employee_id) !== 0 ? application.employee_id.toString() : '',
                        status: translateStatus(application.status),
                        postMeetingStage: getField(application.fields, "4058"),
                        desc: application.request_name,
                        typeApplication: getField(application.fields, "4059"),
                        contactedClient: getField(application.fields, "5079") ? getField(application.fields, "5079") : getField(application.fields, "4994"),
                        campaignUtm: existingSale.mangoUtm ? existingSale.campaignUtm : getField(application.fields, "5001"),
                        sourceUtm: existingSale.mangoUtm ? existingSale.sourceUtm : getField(application.fields, "5184"),
                        termUtm: existingSale.mangoUtm ? existingSale.termUtm : getField(application.fields, "5000"),
                        nextAction: getField(application.fields, "4057"),
                        rejection: getField(application.fields, "4992"),
                        errorReejctionDone: getField(application.fields, "4993") !== 0 ? true : false,
                        datecallCenter: getField(application.fields, "5002"),
                        timecallCenter: getField(application.fields, "5003"),
                        timesaletCenter: getField(application.fields, "4999"),
                        dateFirstContact: getField(application.fields, "4997"),
                        phone: phone,
                        url: getField(application.fields, "5032"),
                        comment: await commentArr(application.id),
                        typeApplicationCrm: "ЖДД",
                        createdAtCrm: application.date_create,
                        createdAt: new Date(`${application.date_create}`)
                    },
                });
            }
        }));

        console.log(`Батч от  ${fromDate} до ${toDate} загружен успешно`);
    } catch (error) {
        console.error(`Ошибка при выполнении запроса для периода ${fromDate} - ${toDate}:`, error);
        throw error;
    }
}

async function start() {
    const currentDate = new Date();
    let toDate = currentDate;
    const batchSize = 30; // Количество дней в одном батче
    const totalBatches = 7; // Общее количество батчей

    for (let i = 0; i < totalBatches; i++) {
        const fromDate = new Date(toDate.getTime() - (batchSize * 24 * 60 * 60 * 1000));
        await startBatch(fromDate.toISOString().split('T')[0], toDate.toISOString().split('T')[0]);
        toDate = fromDate;

        if (i < totalBatches - 1) {
            //1,5 мин между батчами
            await new Promise(resolve => setTimeout(resolve, 90 * 1000));
        }
    }
}

start();
