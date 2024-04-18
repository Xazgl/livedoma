//@ts-check

const axios = require('axios').default
const { PrismaClient } = require("@prisma/client");
const { AxiosError } = require("axios");


async function foundName (id) {
  const params = new URLSearchParams();
  params.append("apikey", "b6623ccbb9e2e082c27e266e77102105");
  params.append("params[id][0]", id);

  try {
    const response = await axios.post('http://jivemdoma.intrumnet.com:81/sharedapi/worker/filter',
      params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
 
  // console.log(response.data.data)
  return response.data.data[id].surname

  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    throw error; // Пробрасываем ошибку выше для обработки
  }
}

module.exports = {
  foundName: foundName,
};