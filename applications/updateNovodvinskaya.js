//@ts-check

const axios = require('axios').default;
const { PrismaClient } = require("@prisma/client");
const { AxiosError } = require("axios");
const { foundName } = require("./lib");
const { findPhone } = require("./lib");
const { commentArr } = require("./funcComment");

const db = new PrismaClient();

async function startBatch(fromDate, toDate) {
    const params = new URLSearchParams();
    params.append("apikey", "9a75fc323d968db797ec0ab848572aad");
    params.append("params[types][0]", "14");
    params.append("params[publish]", "1");
    params.append("params[limit]", "499");
    params.append("params[date][from]", fromDate);
    params.append("params[date][to]", toDate);
    params.append("params[fields][0][id]", "5420");
    params.append("params[fields][0][value]", 'ЖК «Дом на Новодвинской»');

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
                    processnow: "Дубль",
                    processed: "Встреча состоялась",
                    malformed: "Объект уже продан или снят с продажи",
                    mustbeprocessed: "Согласование встречи",
                    reprocess: "Встреча назначена",
                    postponed: "Встреча отложена",
                    cancelled: "Встречу отменил клиент"
                };

                return statusMap[englishStatus] || 'Статус не найден';
            }

            const phoneValue = getField(application.fields, "5073");
            const phone = typeof phoneValue === 'string' ? phoneValue : await findPhone(application.customer_id);
            const responsibleName = await foundName(application.employee_id);
            const responsibleMain = responsibleName !== 'Нет' ? responsibleName : 'Отвественный не назначен';

            if (existingSale) {
                return await db.constructionApplications.update({
                    where: {
                        id: existingSale.id
                    },
                    data: {
                        idApplicationIntrum: application.id,
                        translator: existingSale.mangoUtm? existingSale.translator : getField(application.fields, "1211") ? getField(application.fields, "1211") : '',
                        responsibleMain: responsibleMain,
                        status: translateStatus(application.status),
                        postMeetingStage: getField(application.fields, "5020") == 'Бронь' ||  getField(application.fields, "5020") == 'Бесплатная бронь' ||  getField(application.fields, "5020") == 'Бронь с оплатой' ||   getField(application.fields, "5020") == 'ДДУ заключен'  ?
                              (getField(application.fields, "5081") ?  getField(application.fields, "5020") + `  ${getField(application.fields, "5081")}` : getField(application.fields, "5020")) : getField(application.fields, "5020"),
                        desc: application.request_name,
                        typeApplication: getField(application.fields, "1091") ? getField(application.fields, "1091") : "Показ объекта по Новодвинской",
                        contactedClient: getField(application.fields, "5069"),
                        campaignUtm: existingSale.mangoUtm? existingSale.campaignUtm : getField(application.fields, "5147")? getField(application.fields, "5147") : 'нету',
                        sourceUtm: existingSale.mangoUtm? existingSale.sourceUtm: getField(application.fields, "5185")? getField(application.fields, "5185") : 'нету',
                        termUtm: existingSale.mangoUtm? existingSale.termUtm : getField(application.fields, "5148")? getField(application.fields, "5148") : 'нету',
                        prodinfo: getField(application.fields, "5169")?  getField(application.fields, "5169") :'нету',
                        nextAction: getField(application.fields, "1404"),
                        rejection: '',//отклонение работы с заявок
                        datecallCenter: getField(application.fields, "5068"),
                        timecallCenter: getField(application.fields, "5067"),
                        timesaletCenter: getField(application.fields, "5071"),
                        dateFirstContact: getField(application.fields, "5072"),
                        phone: phone,
                        url: getField(application.fields, "5075") ? getField(application.fields, "5075") : `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${application.id}#request`,
                        comment: await commentArr(application.id),
                        typeApplicationCrm: "Новодвинская",
                        createdAtCrm: application.date_create,
                        createdAt: new Date(`${application.date_create}`)
                      },
                });
            } else {
                return await db.constructionApplications.create({
                    data: {
                        idApplicationIntrum: application.id,
                        translator: getField(application.fields, "1211") ? getField(application.fields, "1211") : '', responsibleMain: responsibleMain, status: translateStatus(application.status),
                        postMeetingStage: getField(application.fields, "5020") == 'Бронь' ||  getField(application.fields, "5020") == 'Бесплатная бронь' ||  getField(application.fields, "5020") == 'Бронь с оплатой' ||   getField(application.fields, "5020") == 'ДДУ заключен'  ?
                              (getField(application.fields, "5081") ?  getField(application.fields, "5020") + `  ${getField(application.fields, "5081")}` : getField(application.fields, "5020")) : getField(application.fields, "5020"),            
                        desc: application.request_name,
                        typeApplication: getField(application.fields, "1091") ? getField(application.fields, "1091") : "Показ объекта по Новодвинской",
                        contactedClient: getField(application.fields, "5069"),
                        campaignUtm: 'нету',
                        termUtm: 'нету',
                        nextAction: getField(application.fields, "1404"),
                        rejection: '',//отклонение работы с заявок
                        datecallCenter: getField(application.fields, "5068"),
                        timecallCenter: getField(application.fields, "5067"),
                        timesaletCenter: getField(application.fields, "5071"),
                        dateFirstContact: getField(application.fields, "5072"),
                        phone: phone,
                        comment: await commentArr(application.id),
                        typeApplicationCrm: "Новодвинская",
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
    const totalBatches = 25; // Общее количество батчей

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
