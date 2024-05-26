//@ts-check

const axios = require('axios').default
const { AxiosError } = require("axios");


async function start() {

  try {                             
    const postResponse = await axios.post(
      `https://inpars.ru/api/v2/estate?sortBy=updated_asc&regionId=34&access-token=_aPxqTB4ch1YHWR3q72bcNLTgMYMC-Iv&latFrom=48.783657&lngFrom=44.557372&lngTo=44.565583&latTo=48.789083`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

   

    return postResponse ;

  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    throw error;
  }
}

start()