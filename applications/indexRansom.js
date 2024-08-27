//@ts-check

const axios = require('axios').default
const { PrismaClient } = require("@prisma/client");
const { AxiosError } = require("axios");
const { foundName } = require("./lib");
const { findPhone } = require("./lib");
const { commentArr } = require("./funcComment");





const db = new PrismaClient()

async function start() {
  const currentDate = new Date(); // Получаем дату
  const prevDay = new Date(currentDate.getTime() - (120 * 24 * 60 * 60 * 1000)); // Вычитаем 120 дней
  const formattedPrevDate = prevDay.toISOString().split('T')[0]; // Преобразуем в формат Y-m-d

  const day = new Date(currentDate.getTime());
  const formattedDateCurrent = day.toISOString().split('T')[0]; // Преобразуем в формат Y-m-d

  const params = new URLSearchParams();
  params.append("apikey", "9a75fc323d968db797ec0ab848572aad");
  params.append("params[types][0]", "3");
  params.append("params[publish]", "1");
  params.append("params[limit]", "499")
  params.append("params[date][from]", formattedPrevDate);
  params.append("params[date][to]", formattedDateCurrent);
  params.append("params[fields][0][id]", "3667");
  params.append("params[fields][0][value]", '1');

  try {
    const response = await axios.post('http://jivemdoma.intrumnet.com:81/sharedapi/applications/filter',
      params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const data = response.data.data.list;
    console.log(data)
    const getField = (fields, id) => {
      return fields[id] ? fields[id].value : null;
    };

    // Перебор массива объектов с помощью метода map
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

      const addHours = (dateString, hours) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() + hours);
        return date;
      };

      const responsibleName = await foundName(application.employee_id);
      const responsibleMain = responsibleName !== 'Нет' ? responsibleName : 'Отвественный не назначен';

      const phoneValue = getField(application.fields, "5158");
      const phone = typeof phoneValue === 'string' ? phoneValue : await findPhone(application.customer_id);

      console.log(getField(application.fields, "4629"))
      if (existingSale) {
        // Если сделка существует, обновляем ее поля
        return await db.constructionApplications.update({
          where: {
            id: existingSale.id
          },
          data: {
            idApplicationIntrum: application.id,
            translator: getField(application.fields, "1277") ? getField(application.fields, "1277") : '',
            responsibleMain: responsibleMain,
            status: translateStatus(application.status),
            typeApplication:'Прием объекта Срочный Выкуп',
            contactedClient: getField(application.fields, "5069"),
            campaignUtm: getField(application.fields, "5150")? getField(application.fields, "5150") : '',
            termUtm: getField(application.fields, "5152")? getField(application.fields, "5152") : '',
            nextAction: getField(application.fields, "1404"),
            timecallCenter: getField(application.fields, "4630"), //Сколько заявка была в обработке у рекламы.
            timesaletCenter: getField(application.fields, "4629"), // Время + дата размещения в рекламе
            dateFirstContact: getField(application.fields, "1327"), // Передача в отдел рекламы
            phone: phone,
            url: getField(application.fields, "5075") ? getField(application.fields, "5075") : `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${application.id}#request`,
            comment: await commentArr(application.id),
            typeApplicationCrm: "Срочный выкуп",
            createdAtCrm: application.date_create,
            createdAt: new Date(`${application.date_create}`)
          },
        });
      } else {
        return await db.constructionApplications.create({
          data: {
            idApplicationIntrum: application.id,
            translator: getField(application.fields, "1277") ? getField(application.fields, "1277") : '',
            responsibleMain: responsibleMain,
            status: translateStatus(application.status),
            typeApplication:'Прием объекта Срочный Выкуп',
            contactedClient: getField(application.fields, "5069"),
            campaignUtm: getField(application.fields, "5150")? getField(application.fields, "5150") : '',
            termUtm: getField(application.fields, "5152")? getField(application.fields, "5152") : '',
            nextAction: getField(application.fields, "1404"),
            timecallCenter: getField(application.fields, "4630"), //Сколько заявка была в обработке у рекламы.
            timesaletCenter: getField(application.fields, "4629"), // Время + дата размещения в рекламе
            dateFirstContact: getField(application.fields, "1327"), // Передача в отдел рекламы
            phone: phone,
            url: getField(application.fields, "5075") ? getField(application.fields, "5075") : `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${application.id}#request`,
            comment: await commentArr(application.id),
            typeApplicationCrm: "Срочный выкуп",
            createdAtCrm: application.date_create,
            createdAt: new Date(`${application.date_create}`)
          },
        });
      }
    }));

    // console.log(mappedData)
    return 'Заявки успешно скачены';

  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    throw error;
  }
}

start()