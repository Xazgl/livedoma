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
  const prevDay = new Date(currentDate.getTime() - (15 * 24 * 60 * 60 * 1000)); // Вычитаем 30 дней
  const formattedPrevDate = prevDay.toISOString().split('T')[0]; // Преобразуем в формат Y-m-d

  const day = new Date(currentDate.getTime());
  const formattedDateCurrent = day.toISOString().split('T')[0]; // Преобразуем в формат Y-m-d

  const params = new URLSearchParams();
  params.append("apikey", "9a75fc323d968db797ec0ab848572aad");
  params.append("params[types][0]", "14");
  params.append("params[publish]", "1");
  params.append("params[limit]", "499")
  params.append("params[date][from]", '2024-08-01');
  params.append("params[date][to]", '2024-08-15');
  //статусы
  params.append("params[statuses][0]", 'unselected');
  params.append("params[statuses][1]", 'processnow');
  params.append("params[statuses][2]", 'mustbeprocessed');
  params.append("params[statuses][3]", 'reprocess');
  params.append("params[statuses][4]", 'postponed');


  params.append("params[fields][0][id]", "1404");
  params.append("params[fields][0][value]", '0000-00-00');
  



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

    const newArr =[]
    // Перебор массива объектов с помощью метода map
    const mappedData = await Promise.all(data.map(async application => {
        if (
            //   params.append("params[fields][statuses][0]", 'unselected');
//   params.append("params[fields][statuses][1]", 'processnow');
//   params.append("params[fields][statuses][2]", 'mustbeprocessed');
//   params.append("params[fields][statuses][3]", 'reprocess');
//   params.append("params[fields][statuses][4]", 'postponed');
            (application.status !== 'cancelled' && application.status !== 'processed' && application.status !=='malformed') &&
            application.employee_id !== '2220' &&
            application.employee_id !== '2588' &&
            application.employee_id !== '309' && 
            application.employee_id !== '1584' && 
            application.employee_id !== '1693' &&  
            (getField(application.fields, "1404") == '0000-00-00' || getField(application.fields, "1404") == null )
          ) {
            newArr.push(application.id);

            // newArr.push({otv: application.employee_id, dateNext:getField(application.fields, "1404") ,  url: `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${application.id}#request`});
          }
    }))
    console.log(mappedData.length)
    console.log(newArr.length)
    // console.log(newArr)
    return newArr;


  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    throw error;
  }

  
}

start()


