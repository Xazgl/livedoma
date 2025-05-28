const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function normalizeWazzupNumber(phone) {
    if (phone !== "Admin" && !phone.startsWith("+")) {
        return `+${phone}`;
    }
    return phone;
}

// Полный массив без сокращений
const rawLeads = [
    { phone: "79220635777", name: "Аэлита Олещенко", text: "" },
    { phone: "79608835980", name: "Федор", text: "" },
    { phone: "79026511233", name: "avoskresenskov94", text: "" },
    { phone: "79377353257", name: "takshaitov rustam2", text: "" },
    { phone: "79034687523", name: "Анастасия", text: "" },
    { phone: "79275396898", name: "Кайрат", text: "" },
    { phone: "79608960007", name: "MR. Alex", text: "" },
    { phone: "79275380503", name: "Дмитрий", text: "" },
    { phone: "79199847755", name: "А", text: "" },
    { phone: "79883948299", name: "maksgrenaderov90430", text: "" },
    { phone: "79053382317", name: "Аня", text: "" },
    { phone: "79880120879", name: "krylovm614", text: "" },
    { phone: "79047580903", name: "ольга", text: "" },
    { phone: "79996240368", name: "Самонин Антон", text: "Интересует конкретный дом" },
    { phone: "79047758596", name: "Вадим", text: "" },
    { phone: "79275030780", name: "Ольга Федорова", text: "" },
    { phone: "79999943777", name: "Александр Смирнов", text: "" },
    { phone: "79044164137", name: "Кирилл", text: "" },
    { phone: "79218139817", name: "Антон", text: "" },
    { phone: "79897947654", name: "Сергей", text: "" },
    { phone: "79954137757", name: "Наталья Пучкова", text: "" },
    { phone: "79272545235", name: "не указано", text: "" },
    { phone: "79954162133", name: "Татьяна", text: "" },
    { phone: "79044350683", name: "Дарья", text: "" },
    { phone: "79377107883", name: "не указано", text: "" },
    { phone: "79616734439", name: "Ирина Могилевская", text: "" },
    { phone: "79880433402", name: "Владимир", text: "" },
    { phone: "79880206299", name: "Игорь", text: "" },
    { phone: "79053350123", name: "Влад", text: "" },
    { phone: "79053900954", name: "Екатерина", text: "" },
    { phone: "79093796404", name: "Ирина", text: "" },
    { phone: "79370817614", name: "Виктор", text: "" },
    { phone: "79064095763", name: "Ольга", text: "" },
    { phone: "79026530526", name: "Артемий", text: "" },
    { phone: "79064043920", name: "Владимир Зенякин", text: "" },
    { phone: "79616921316", name: "Ирина", text: "" },
    { phone: "79297802020", name: "Артём", text: "" },
    { phone: "79275217761", name: "Василий", text: "Добрый день! Сельская ипотека есть в каком банке?" },
    { phone: "79282955789", name: "Геннадий", text: "Можно самые ещё дешёвые варианты" },
    { phone: "79608887565", name: "Мария Конева", text: "" },
    { phone: "79103944234", name: "Андрей", text: "" },
];

async function sendIntrumCrm(message, double) {
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
    params.append("params[request][request_type]", "23");
    params.append("params[request][status]", "unselected");
    params.append("params[request][request_name]", double ? "Повторное обращение(дубль) получили каталог в Вотсапе ТОП-10" : "Получили каталог в Вотсапе ТОП-10 проектов домов");
    params.append("params[request][employee_id]", double ? "1693" : message.managerId !== "Ошибка в выборе менеджера" ? message.managerId : managerIdRandom);
    ["309", "1584", "1693", "2588", "2535", "2536"].forEach((id, i) => {
        params.append(`params[request][additional_employee_id][${i}]`, id);
    });
    params.append("params[request][fields][0][id]", "4059");
    params.append("params[request][fields][0][value]", double ? "Дубль" : "WhatsApp");
    params.append("params[request][fields][1][id]", "4056");
    params.append("params[request][fields][1][value]", "WhatsApp");
    params.append("params[request][fields][2][id]", "4057");
    params.append("params[request][fields][2][value]", formattedDate);
    params.append("params[request][fields][3][id]", "4058");
    params.append("params[request][fields][3][value]", "Указать стадию");
    params.append("params[request][fields][4][id]", "5079");
    params.append("params[request][fields][4][value]", "Не заполнено");
    params.append("params[request][fields][4][id]", "4992");
    params.append("params[request][fields][4][value]", "Заявка не проверена");

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

        const newContact = await db.wazzup.create({
            data: {
                name: lead.name,
                phone: phone,
                text: text,
                typeSend: "wapp",
                sendCrm: false,
                managerId: manager,
            },
        });

        const double = { isDuplicate: false, within24Hours: false };
        const crmAnswer = await sendIntrumCrm(newContact, double.isDuplicate);

        if (crmAnswer && crmAnswer.data && crmAnswer.data.request) {
            const intrumRequestId = crmAnswer.data.request.toString();
            const intrumUrl = `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${intrumRequestId}#request`;

            await db.wazzup.update({
                where: { id: newContact.id },
                data: {
                    sendCrm: true,
                    intrumId: intrumRequestId,
                    intrumUrl: intrumUrl,
                },
            });

            if (!double.isDuplicate) {
                await db.managerQueue.create({
                    data: {
                        managerId: manager,
                        url: intrumUrl,
                        type: "Wazzup",
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
