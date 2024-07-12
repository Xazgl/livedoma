//@ts-check

const axios = require('axios').default
const { PrismaClient } = require("@prisma/client");
const { AxiosError } = require("axios");
const { foundName } = require("./lib");
const { commentArr } = require("./funcComment");





const db = new PrismaClient()

async function start() {
  const currentDate = new Date(); // Получаем дату
  const prevDay = new Date(currentDate.getTime() - (31 * 24 * 60 * 60 * 1000)); // Вычитаем 30 дней
  const formattedPrevDate = prevDay.toISOString().split('T')[0]; // Преобразуем в формат Y-m-d

  const day = new Date(currentDate.getTime());
  const formattedDateCurrent = day.toISOString().split('T')[0]; // Преобразуем в формат Y-m-d

  const params = new URLSearchParams();
  params.append("apikey", "9a75fc323d968db797ec0ab848572aad");
  params.append("params[types][0]", "14");
  params.append("params[publish]", "1");
  params.append("params[limit]", "499")
  params.append("params[date][from]", formattedPrevDate);
  params.append("params[date][to]", formattedDateCurrent);
  params.append("params[fields][0][id]", "5060");
  params.append("params[fields][0][value]",'1');

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
      const responsibleMain = responsibleName !== 'Нет' ? responsibleName : '';

      if (existingSale) {
        // Если сделка существует, обновляем ее поля
        return await db.constructionApplications.update({
          where: {
            id: existingSale.id
          },
          data: {
            idApplicationIntrum: application.id,
            translator: getField(application.fields, "1211")? getField(application.fields, "1211") : '',
            responsibleMain: responsibleMain,
            status: translateStatus(application.status),
            // postMeetingStage: getField(application.fields, "5020"),
            postMeetingStage: getField(application.fields, "5020") == 'Бронь' ? getField(application.fields, "5020")+ ( getField(application.fields, "5081")? ` Квартира${getField(application.fields, "5081")}` : 'Не указана') : getField(application.fields, "5020"),            desc: application.request_name, 
            typeApplication: getField(application.fields, "1091")? getField(application.fields, "1091") :"Показ объекта по Сансаре",
            contactedClient: getField(application.fields, "5069"),
            campaignUtm: 'нету',
            termUtm: 'нету',
            nextAction: getField(application.fields, "1404"),
            rejection: '',//отклонение работы с заявок
            //errorReejctionDone: getField(application.fields, "4993") !== 0 ? true : false, исправлена ошибка 
            datecallCenter: getField(application.fields, "5068"), 
            timecallCenter: getField(application.fields, "5067"),
            timesaletCenter: getField(application.fields, "5071"),
            dateFirstContact: getField(application.fields, "5072"),
            phone: getField(application.fields, "5073"),
            url: getField(application.fields, "5075") ? getField(application.fields, "5075") :`https://jivemdoma.intrumnet.com/crm/tools/exec/request/${application.id}#request` ,
            comment: await commentArr(application.id),
            typeApplicationCrm:"Сансара",
            createdAtCrm: application.date_create,
            createdAt: new Date(`${application.date_create}`)
          },
        });
      } else {
        return await db.constructionApplications.create({
          data: {
            idApplicationIntrum: application.id,
            translator: getField(application.fields, "1211")? getField(application.fields, "1211") : '',            responsibleMain: responsibleMain,            status: translateStatus(application.status),
            // postMeetingStage: getField(application.fields, "5074"),
            postMeetingStage: getField(application.fields, "5020") == 'Бронь' ? getField(application.fields, "5020")+ ( getField(application.fields, "5081")? ` Квартира${getField(application.fields, "5081")}` : 'Не указана') : getField(application.fields, "5020"),
            desc: application.request_name,
            typeApplication: getField(application.fields, "1091")? getField(application.fields, "1091") :"Показ объекта по Сансаре",
            contactedClient: getField(application.fields, "5069"),
            campaignUtm: 'нету',
            termUtm: 'нету',
            nextAction: getField(application.fields, "1404"),
            rejection: '',//отклонение работы с заявок
            //errorReejctionDone: getField(application.fields, "4993") !== 0 ? true : false, исправлена ошибка 
            datecallCenter: getField(application.fields, "5068"), 
            timecallCenter: getField(application.fields, "5067"),
            timesaletCenter: getField(application.fields, "5071"),
            dateFirstContact: getField(application.fields, "5072"),
            phone: getField(application.fields, "5073"),
            url: getField(application.fields, "5075") ? getField(application.fields, "5075") :`https://jivemdoma.intrumnet.com/crm/tools/exec/request/${application.id}#request` ,
            comment: await commentArr(application.id),
            typeApplicationCrm:"Сансара",
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