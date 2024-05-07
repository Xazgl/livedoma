//@ts-check

const axios = require('axios').default
const { PrismaClient } = require("@prisma/client");
const { AxiosError } = require("axios");
const { foundName } = require("../report/lib");


const db = new PrismaClient()

async function start() {
  const currentDate = new Date(); // Получаем дату
  const prevDay = new Date(currentDate.getTime() - (60 * 24 * 60 * 60 * 1000)); // Вычитаем 60 дней
  const formattedPrevDate = prevDay.toISOString().split('T')[0]; // Преобразуем в формат Y-m-d

  const day = new Date(currentDate.getTime());
  const formattedDateCurrent = day.toISOString().split('T')[0]; // Преобразуем в формат Y-m-d

  const params = new URLSearchParams();
  params.append("apikey", "8bba96b3d2e3bea9f3204e6e8bba3547");
  params.append("params[types][0]", "23");
  params.append("params[publish]", "1");
  params.append("params[limit]", "499")
  params.append("params[date][from]", formattedPrevDate);
  params.append("params[date][to]", formattedDateCurrent);

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



      if (existingSale) {
        // Если сделка существует, обновляем ее поля
        // return await db.constructionApplications.update({
        //   where: {
        //     id: existingSale.id,
        //   },
        //   data: {
        //       idApplicationIntrum: application.id,
        //       translator: getField(application.fields, "4056"),
        //       responsibleMain: await foundName(application.employee_id ? application.employee_id.toString() : '0'),
        //       status: translateStatus(application.status),
        //       postMeetingStage: getField(application.fields, "4058"),
        //       desc: application.request_name,
        //       typeApplication: getField(application.fields, "4059"),
        //       contactedClient: getField(application.fields, "4994"),
        //       campaignUtm: getField(application.fields, "5001"),
        //       termUtm: getField(application.fields, "5000"),
        //       nextAction: getField(application.fields, "4057"),
        //       rejection: getField(application.fields, "4992"),
        //       errorReejctionDone: getField(application.fields, "4993"),
        //       datecallCenter: getField(application.fields, "5002"),
        //       timecallCenter: getField(application.fields, "5004"),
        //       timesaletCenter: getField(application.fields, "4999"),
        //       dateFirstContact: getField(application.fields, "4997"),
        //       phone: getField(application.fields, "5033"),
        //       url: getField(application.fields, "5032"),
        //       createdAt: new Date(`${application.date_create}`)
        //     },
        // });
        return;
      } else {
        return await db.constructionApplications.create({
          data: {
            idApplicationIntrum: application.id,
            translator: getField(application.fields, "4056") ? getField(application.fields, "4056") : '',
            responsibleMain: await foundName(application.employee_id) !== '0' || await foundName(application.employee_id) !== 0 ? application.employee_id.toString() : '',
            status: translateStatus(application.status),
            postMeetingStage: getField(application.fields, "4058"),
            desc: application.request_name,
            typeApplication: getField(application.fields, "4059"),
            contactedClient: getField(application.fields, "4994"),
            campaignUtm: getField(application.fields, "5001"),
            termUtm: getField(application.fields, "5000"),
            nextAction: getField(application.fields, "4057"),
            rejection: getField(application.fields, "4992"),
            errorReejctionDone: getField(application.fields, "4993") !== 0? true: false,
            datecallCenter: getField(application.fields, "5002"),
            timecallCenter: getField(application.fields, "5004"),
            timesaletCenter: getField(application.fields, "4999"),
            dateFirstContact: getField(application.fields, "4997"),
            phone: getField(application.fields, "5033"),
            url: getField(application.fields, "5032"),
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