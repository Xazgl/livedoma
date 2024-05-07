//@ts-check

const axios = require('axios').default
const { PrismaClient } = require("@prisma/client");
const { AxiosError } = require("axios");
const { foundName } = require("./lib");
const db = new PrismaClient()

async function start() {
  const currentDate = new Date(); // Получаем дату создания сообщения
  const nextDay = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000)); //за последние 30 дней
  const formattedDate = nextDay.toISOString().split('T')[0]; // Преобразуем в формат Y-m-d

  const params = new URLSearchParams();
  params.append("apikey", "b6623ccbb9e2e082c27e266e77102105");
  params.append("params[type][0]", "7");
  params.append("params[publish]", "1");
  params.append("params[fields][0][id]", "3398");
  params.append("params[fields][0][value]", `>=${formattedDate}`);
  //  params.append("params[fields][0][value]", `>=2024-04-27`);
  params.append("params[limit]", "499")

  try {                                
    const response = await axios.post('http://jivemdoma.intrumnet.com:81/sharedapi/sales/filter',
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
    const mappedData = await Promise.all(data.map(async sale => {
      const existingSale = await db.transactionSellingInsurance.findUnique({
        where: {
          idIntrum: sale.id,
        },
      });



      if (existingSale) {
        // Если сделка существует, обновляем ее поля
        return await db.transactionSellingInsurance.update({
          where: {
            id: existingSale.id,
          },
          data: {
            idIntrum: sale.id,
            responsibleMain: await foundName(sale.employee_id ? sale.employee_id.toString() : '0'),
            name: getField(sale.fields, "3313"),
            phone: getField(sale.fields, "3314"),
            agreement: getField(sale.fields, "3315"),
            titleBorrower: getField(sale.fields, "3316"),
            profession: getField(sale.fields, "3317"),
            bank: getField(sale.fields, "3318"),
            insuranceCompany: getField(sale.fields, "3448"),
            insuranceSum: getField(sale.fields, "3449"),
            mortageSum: getField(sale.fields, "3319"),
            commission: getField(sale.fields, "3413"),
            lawler: getField(sale.fields, "3320"),
            dateNextClientContact: getField(sale.fields, "3321"),//Дата следующего контакта с клиентом 3321
            stageWorkWithClient: getField(sale.fields, "3403"),
            nextAction: getField(sale.fields, "3376"),
            dateBirthday: getField(sale.fields, "3324"),//Дата рождения 3324
            address: getField(sale.fields, "3325"),
            clientInform: getField(sale.fields, "3326"),
            insuranceCalc: getField(sale.fields, "3374"),
            titleBorrowerPhone: getField(sale.fields, "3375"),
            extractInsurance: getField(sale.fields, "3378"),
            idTransitionSaleObject: getField(sale.fields, "3386"),
            numberCadastral: getField(sale.fields, "3388"),
            extract: getField(sale.fields, "3394"),
            dateTheStatusChanged: getField(sale.fields, "3398"),//Дата перехода статуса в "Оплата прошла" 3398
            source: getField(sale.fields, "3402"),
            theBuyerIMMEDIATELYRefusedInsurance: getField(sale.fields, "3488"),
            transactionStageInTheTransactionSALE: getField(sale.fields, "3489")
          },
        });
      } else {
        return await db.transactionSellingInsurance.create({
          data: {
            idIntrum: sale.id,
            responsibleMain: await foundName(sale.employee_id ? sale.employee_id.toString() : '0'),
            name: getField(sale.fields, "3313"),
            phone: getField(sale.fields, "3314"),
            agreement: getField(sale.fields, "3315"),
            titleBorrower: getField(sale.fields, "3316"),
            profession: getField(sale.fields, "3317"),
            bank: getField(sale.fields, "3318"),
            insuranceCompany: getField(sale.fields, "3448"),
            insuranceSum: getField(sale.fields, "3449"),
            mortageSum: getField(sale.fields, "3319"),
            commission: getField(sale.fields, "3413"),
            lawler: getField(sale.fields, "3320"),
            dateNextClientContact: getField(sale.fields, "3321"),//Дата следующего контакта с клиентом 3321
            stageWorkWithClient: getField(sale.fields, "3403"),
            nextAction: getField(sale.fields, "3376"),
            dateBirthday: getField(sale.fields, "3324"),//Дата рождения 3324
            address: getField(sale.fields, "3325"),
            clientInform: getField(sale.fields, "3326"),
            insuranceCalc: getField(sale.fields, "3374"),
            titleBorrowerPhone: getField(sale.fields, "3375"),
            extractInsurance: getField(sale.fields, "3378"),
            idTransitionSaleObject: getField(sale.fields, "3386"),
            numberCadastral: getField(sale.fields, "3388"),
            extract: getField(sale.fields, "3394"),
            dateTheStatusChanged: getField(sale.fields, "3398"),//Дата перехода статуса в "Оплата прошла" 3398
            source: getField(sale.fields, "3402"),
            theBuyerIMMEDIATELYRefusedInsurance: getField(sale.fields, "3488"),
            transactionStageInTheTransactionSALE: getField(sale.fields, "3489")
          },
        });
      }
    }));

    console.log(mappedData)
    return mappedData;

  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    throw error;
  }
}

start()