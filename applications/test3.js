const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function getPreviousManagerIds(
    index,
    totalManagers
) {
    if (index < totalManagers) {
        return [];
    }

    const previousQueueItems = await db.managerSansaraQueue.findMany({
        skip: index - totalManagers,
        take: totalManagers,
        orderBy: { createdAt: "desc" },
    });

    return previousQueueItems.map((item) => item.managerId);
}

async function getManagerWithLeastRequests(managerIds) {
    if (managerIds.length === 0) {
        throw new Error("No manager IDs provided.");
    }

    const managerRequestCounts = await db.managerSansaraQueue.groupBy({
        by: ["managerId"],
        _count: {
            managerId: true,
        },
        where: {
            managerId: { in: managerIds },
        },
    });

    const managerCountMap =
        managerRequestCounts.reduce(
            (acc, { managerId, _count }) => {
                acc[managerId] = _count.managerId;
                return acc;
            },
            {}
        );

    return managerIds.sort(
        (a, b) => (managerCountMap[a] || 0) - (managerCountMap[b] || 0)
    )[0];
}


async function managerFindRansom() {
    try {
        const existingQueueCount = await db.managerSansaraQueue.count();
        const totalManagers = 3; // количество кругов
        const currentManagerIndex = existingQueueCount % totalManagers;
        let selectedManagerId;

        const previousManagerIds = await getPreviousManagerIds(
            existingQueueCount,
            totalManagers
        );

        if (currentManagerIndex === 0) {
            selectedManagerId = firstRoundManagers[0];
        } else if (currentManagerIndex === 1) {
            const availableManagers = secondRoundManagers.filter(
                (id) => !previousManagerIds.includes(id)
            );
            selectedManagerId = await getManagerWithLeastRequests(availableManagers);
        } else {
            const availableManagers = fourthRoundManagers.filter(
                (id) => !previousManagerIds.includes(id)
            );
            selectedManagerId = await getManagerWithLeastRequests(availableManagers);
        }

        return selectedManagerId;
    } catch (error) {
        console.error("Error in managerFindSansara:", error);
        throw new Error("Unable to find a suitable manager.");
    }
}

async function normalizeWazzupNumber(phone) {
    if (phone !== "Admin" && !phone.startsWith("+")) {
        return `+${phone}`;
    }
    return phone;
}

// Полный массив без сокращений
const rawLeads = [
    {
        phone: "79610837177",
        name: "не указано",
        utm_source: "",
        utm_medium: "",
        utm_campaign: "",
        utm_content: "",
        utm_term: "",
        text: "СОСТОЯНИЕ_РЕМОНТА: Косметический\nСКОЛЬКО_КОМНАТ: 1\nАдрес: Красноармейскиий район, г. Волгоград, ул. Удмуртская\nЭтаж: 2"
    },
    {
        phone: "79047508149",
        name: "не указано",
        utm_source: "",
        utm_medium: "",
        utm_campaign: "",
        utm_content: "",
        utm_term: "",
        text: "СОСТОЯНИЕ_РЕМОНТА: Без ремонта\nСКОЛЬКО_КОМНАТ: 2\nАдрес: Краснооктябрьский\nЭтаж: 4"
    },
    {
        phone: "79064067497",
        name: "не указано",
        utm_source: "",
        utm_medium: "",
        utm_campaign: "",
        utm_content: "",
        utm_term: "",
        text: "СОСТОЯНИЕ_РЕМОНТА: Без ремонта\nСКОЛЬКО_КОМНАТ: 2\nАдрес: Республиканская\nЭтаж: 1"
    },
    {
        phone: "79889789715",
        name: "не указано",
        utm_source: "",
        utm_medium: "",
        utm_campaign: "",
        utm_content: "",
        utm_term: "",
        text: "СОСТОЯНИЕ_РЕМОНТА: Косметический\nСКОЛЬКО_КОМНАТ: 2\nАдрес: Краснополянская 14а\nЭтаж: 5"
    },
    {
        phone: "79616745946",
        name: "не указано",
        utm_source: "",
        utm_medium: "",
        utm_campaign: "",
        utm_content: "",
        utm_term: "",
        text: "СОСТОЯНИЕ_РЕМОНТА: Без ремонта\nСКОЛЬКО_КОМНАТ: 1\nАдрес: Ул. Тулака\nЭтаж: 3"
    },
    {
        phone: "79177204124",
        name: "не указано",
        utm_source: "",
        utm_medium: "",
        utm_campaign: "",
        utm_content: "",
        utm_term: "",
        text: "Заявка от 01.07.2025\nСОСТОЯНИЕ_РЕМОНТА: Косметический\nСКОЛЬКО_КОМНАТ: 1\nАдрес: Дзержинский район ул.В-КАЗАХСАНСКАЯ д12\nЭтаж: 4"
    }
];

async function sendIntrumCrm(message, double) {
    // const manager = await managerFindRansom();
    const managers = await db.activeManagers.findMany({
        where: { company_JDD_active: true },
        select: { manager_id: true },
    });

    const randomManager = managers[Math.floor(Math.random() * managers.length)];
    const managerIdRandom = randomManager.manager_id;

    const formattedDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const params = new URLSearchParams();
    params.append("apikey", "7917e0838a4d494b471ceb36d7e3a67b");
    params.append("params[customer][manager_id]", "0");
    params.append("params[customer][name]", message.name || "");
    params.append("params[customer][phone][]", message.phone);
    params.append("params[customer][marktype]", "8");
    params.append("params[customer][fields][0][id]", "5078"); // доп поле для контактов
    params.append(
        "params[customer][fields][0][value]",
        message.timeForClientCall ? message.timeForClientCall : ""
    );
    params.append("params[customer][fields][1][id]", "3725"); // доп поле для контактов
    params.append("params[customer][fields][1][value]", "Квартира");
    params.append("params[request][request_type]", "3"); // Id типа заявка (тут Прием объекта)
    params.append("params[request][status]", "unselected"); //статус сделки
    params.append("params[request][request_name]", double ? "ДУБЛЬ ПОВТРНОЕ ОБРАЩЕНИЕ по срочному выкупу!!!!! " + message.answers : "Заявка на срочный выкуп");

    params.append("params[request][employee_id]", '1693');
    params.append("params[request][additional_employee_id][0]", "309"); //массив доп отв
    params.append("params[request][additional_employee_id][1]", "1584"); //массив доп отв
    params.append("params[request][additional_employee_id][2]", "1693"); //массив доп отв
    params.append("params[request][additional_employee_id][3]", "2588"); //массив доп отв
    params.append("params[request][additional_employee_id][4]", "2535"); //массив доп отв
    params.append("params[request][additional_employee_id][5]", "2536"); //массив доп отв
    params.append("params[request][fields][0][id]", "1277");
    params.append(
        "params[request][fields][0][value]",
        "лендинг"
    ); //доп поле 2
    // params.append(
    //     "params[request][fields][0][value]",
    //     message.utm_campaign || message.utm_content || message.utm_term
    //         ? "лендинг"
    //         : "наш сайт"
    // ); //доп поле 2
    params.append("params[request][fields][1][id]", "5150"); // доп поле 3
    params.append(
        "params[request][fields][1][value]",
        message.utm_campaign ? message.utm_campaign : ""
    ); //доп поле 3

    params.append("params[request][fields][2][id]", "5152"); // доп поле 4
    params.append(
        "params[request][fields][2][value]",
        message.utm_term ? message.utm_term : ""
    ); //доп поле 4

    params.append("params[request][fields][4][id]", "3233"); // доп поле 5
    params.append("params[request][fields][4][value]", formattedDate); //доп поле 5

    params.append("params[request][fields][5][id]", "1327"); // доп поле 6
    params.append(
        "params[request][fields][5][value]",
        "объект не готов к передаче"
    ); //доп поле 6

    params.append("params[request][fields][6][id]", "1393"); // доп поле 6
    params.append("params[request][fields][6][value]", "Квартира вторичка"); //доп поле 6

    params.append("params[request][fields][6][id]", "1366"); // доп поле 6
    params.append("params[request][fields][6][value]", "Не выбран"); //доп поле 6

    params.append("params[request][fields][7][id]", "3667"); // доп поле 7
    params.append("params[request][fields][7][value]", "1"); //доп поле 7

    params.append("params[request][fields][10][id]", "5271"); // доп поле 10
    params.append("params[request][fields][10][value]", "1"); //доп поле 10


    if (double) {
        params.append("params[request][fields][8][id]", "5205"); // доп поле 8
        params.append("params[request][fields][8][value]", "1"); //доп поле 8
    }

    const response = await axios.post(
        "http://jivemdoma.intrumnet.com:81/sharedapi/applications/addCustomer",
        params,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return response.data;
}

async function processLeads() {
    for (const lead of rawLeads) {
        const phone = await normalizeWazzupNumber(lead.phone);
        const text = lead.text || "Каталог";
        const manager = "Ошибка в выборе менеджера";

        const newContact = await db.tilda.create({
            data: {
                name: lead.name,
                answers: lead.text,
                phone: phone,
                formid: '',
                typeSend: "Tilda Срочный Выкуп",
                utm_medium: lead.utm_medium,
                utm_campaign: lead.utm_campaign,
                utm_content: lead.utm_content,
                utm_term: lead.utm_term,
                sendCrm: false,
                managerId: '1693'
            },
        });

        const double = { isDuplicate: false, within24Hours: false };
        const crmAnswer = await sendIntrumCrm(newContact, double.isDuplicate);

        if (crmAnswer && crmAnswer.data && crmAnswer.data.request) {
            const intrumRequestId = crmAnswer.data.request.toString();
            const intrumUrl = `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${intrumRequestId}#request`;

            await db.tilda.update({
                where: {
                    id: newContact.id,
                },
                data: {
                    sendCrm: true,
                    intrumId: crmAnswer.data.request.toString(),
                    intrumUrl: `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${crmAnswer.data.request.toString()}#request`,
                },
            });

            if (!double.isDuplicate) {
                await db.managerRansomQueue.create({
                    data: {
                        managerId:
                            manager && manager !== ""
                                ? manager
                                : "Ошибка в выборе менеджера",
                        url: `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${crmAnswer.data.request.toString()}#request`,
                        type: "Tilda Срочный Выкуп",
                    },
                });
            }

            await db.tilda.create({
                data: {
                    name: "",
                    phone: "",
                    formid: "",
                    typeSend: "Очередь",
                    utm_medium: "",
                    utm_campaign: "",
                    utm_content: "",
                    utm_term: "",
                    sendCrm: false,
                    managerId: manager,
                },
            });

            console.log(`Заявка успешно отправлена: ${intrumUrl}`);
        } else {
            console.log(`Не удалось получить ответ от CRM для ${phone}`);
        }
    }
}

processLeads().catch(console.error)

// async function sendIntrumCrm(message, double) {
//   const managers = await db.activeManagers.findMany({
//     where: { company_JDD_active: true },
//     select: { name: true, manager_id: true },
//   });

//   const randomManager = managers[Math.floor(Math.random() * managers.length)];
//   const managerIdRandom = randomManager.manager_id;

//   const messageCreatedAt = new Date();
//   const nextDay = new Date(messageCreatedAt.getTime() + 24 * 60 * 60 * 1000);
//   const formattedDate = nextDay.toISOString().split("T")[0];

//   const params = new URLSearchParams();
//   params.append("apikey", "7917e0838a4d494b471ceb36d7e3a67b");
//   params.append("params[customer][manager_id]", "0");
//   params.append("params[customer][name]", message.name || "");
//   params.append("params[customer][phone][]", message.phone);
//   params.append("params[customer][marktype]", "8");
//   params.append("params[request][request_type]", "23");
//   params.append("params[request][status]", "unselected");
//   params.append("params[request][request_name]", double ? "Повторное обращение(дубль) получили каталог в Вотсапе ТОП-10" : "Получили каталог в Вотсапе ТОП-10 проектов домов");
//   params.append("params[request][employee_id]", double ? "1693" : (message.managerId === "Ошибка в выборе менеджера" ? managerIdRandom : message.managerId));
//   params.append("params[request][additional_employee_id][0]", "309");
//   params.append("params[request][additional_employee_id][1]", "1584");
//   params.append("params[request][additional_employee_id][2]", "1693");
//   params.append("params[request][additional_employee_id][3]", "2588");
//   params.append("params[request][additional_employee_id][4]", "2535");
//   params.append("params[request][additional_employee_id][5]", "2536");
//   params.append("params[request][fields][0][id]", "4059");
//   params.append("params[request][fields][0][value]", double ? "Дубль" : "WhatsApp");
//   params.append("params[request][fields][1][id]", "4056");
//   params.append("params[request][fields][1][value]", "WhatsApp");
//   params.append("params[request][fields][2][id]", "4057");
//   params.append("params[request][fields][2][value]", formattedDate);
//   params.append("params[request][fields][3][id]", "4058");
//   params.append("params[request][fields][3][value]", "Указать стадию");
//   params.append("params[request][fields][4][id]", "5079");
//   params.append("params[request][fields][4][value]", "Не заполнено");
//   params.append("params[request][fields][4][id]", "4992");
//   params.append("params[request][fields][4][value]", "Заявка не проверена");

//   try {
//     const response = await axios.post(
//       "http://jivemdoma.intrumnet.com:81/sharedapi/applications/addCustomer",
//       params,
//       { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Ошибка отправки:", error);
//   }
// }

// async function processLeads() {
//   for (const lead of rawLeads) {
//     const phone = await normalizeWazzupNumber(lead.phone);
//     const text = lead.text || "Каталог";
//     const manager = "Ошибка в выборе менеджера";

//     const newContact = await db.wazzup.create({
//       data: {
//         name: lead.name,
//         phone: phone,
//         text: text,
//         typeSend: "wapp",
//         sendCrm: false,
//         managerId: manager,
//       },
//     });

//     const double = { isDuplicate: false, within24Hours: false };
//     const result = await sendIntrumCrm(newContact, double.isDuplicate);
//     console.log("Заявка отправлена:", result);
//   }
// }

// processLeads();
