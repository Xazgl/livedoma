//@ts-check

const axios = require('axios').default
const { PrismaClient } = require("@prisma/client");
const { AxiosError } = require("axios");
const { foundName } = require("./lib");
const db = new PrismaClient()

async function start() {
  const currentDate = new Date(); // Получаем дату создания сообщения
  const nextDay = new Date(currentDate.getTime() - (24 * 24 * 60 * 60 * 1000)); //за последние 15 дней
  const formattedDate = nextDay.toISOString().split('T')[0]; // Преобразуем в формат Y-m-d

  const params = new URLSearchParams();
  params.append("apikey", "b6623ccbb9e2e082c27e266e77102105");
  params.append("params[type][0]", "1");
  params.append("params[publish]", "1");
  params.append("params[fields][0][id]", "3415");
  params.append("params[fields][0][value]", `>=${formattedDate}`);
  //  params.append("params[fields][0][value]", `>=2024-04-27`);
  params.append("params[fields][1][id]", "3379");
  params.append("params[fields][1][value]", "1"); //сделка проверяна = Да
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
      const existingSale = await db.sales.findUnique({
        where: {
          idSalesIntrum: sale.id,
        },
      });



      if (existingSale) {
        // Если сделка существует, обновляем ее поля
        // return await db.sales.update({
        //   where: {
        //     id: existingSale.id,
        //   },
        //   data: {
        //     idSalesIntrum: sale.id,
        //     responsibleMain: await foundName(sale.employee_id ? sale.employee_id.toString() : '0'),
        //     partCommissionSeller: getField(sale.fields, "1383"),
        //     sumCommissionBuyer: getField(sale.fields, "3187"),
        //     agentSellerName: getField(sale.fields, "3190"),
        //     agentSellerFormula: getField(sale.fields, "3333"),  
        //     agentSellerCommission: getField(sale.fields, "3364"),
        //     agentSellerSalaryDone:getField(sale.fields, "3335"),

        //     lawyerName: getField(sale.fields, "3096"),
        //     lawyerCommission: getField(sale.fields, "4616"),
        //     lawyerFormula: getField(sale.fields, "3329"),
        //     lawyerSumm: getField(sale.fields, "3330"),
        //     lawyerSumm1: getField(sale.fields, "3363"),
        //     lawyerSalaryDone: getField(sale.fields, "3331"),
        //     lawyerSalary: getField(sale.fields, "3352"),

        //     agentBuyerName: getField(sale.fields, "3350"),
        //     agentBuyerFormul:getField(sale.fields, "3337"),
        //     agentBuyerCommission: getField(sale.fields, "3365"),
        //     agentBuyerSalaryDone:getField(sale.fields, "3339"),
 
        //     mortageFormula:getField(sale.fields, "3359"),
        //     mortageSumm1:getField(sale.fields, "3367"),   
        //     mortageOtdel:getField(sale.fields, "1203"),   


        //     lawyerCommission2: getField(sale.fields, "3363"),
        //     adress: getField(sale.fields, "1321"),
        //     dateStage: getField(sale.fields, "3415"),
        //   },
        // });
      } else {
        return await db.sales.create({
          data: {
            idSalesIntrum: sale.id,
            responsibleMain: await foundName(sale.employee_id ? sale.employee_id.toString() : '0')?  await foundName(sale.employee_id ? sale.employee_id.toString() : '0') : sale.employee_id,
            partCommissionSeller: getField(sale.fields, "1383"),
            sumCommissionBuyer: getField(sale.fields, "3187"),
            agentSellerName: getField(sale.fields, "3190"),
            agentSellerFormula: getField(sale.fields, "3333"),  
            agentSellerCommission: getField(sale.fields, "3364"),
            agentSellerSalaryDone:getField(sale.fields, "3335"),

            lawyerName: getField(sale.fields, "3096"),
            lawyerCommission: getField(sale.fields, "4616"),
            lawyerFormula: getField(sale.fields, "3329"),
            lawyerSumm: getField(sale.fields, "3330"),
            lawyerSumm1: getField(sale.fields, "3363"),
            lawyerSalaryDone: getField(sale.fields, "3331"),
            lawyerSalary: getField(sale.fields, "3352"),

            agentBuyerName: getField(sale.fields, "3350"),
            agentBuyerFormul:getField(sale.fields, "3337"),
            agentBuyerCommission: getField(sale.fields, "3365"),
            agentBuyerSalaryDone:getField(sale.fields, "3339"),
 
            mortageFormula:getField(sale.fields, "3359"),
            mortageSumm1:getField(sale.fields, "3367"),    


            lawyerCommission2: getField(sale.fields, "3363"),
            adress: getField(sale.fields, "1321"),
            dateStage: getField(sale.fields, "3415"),
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