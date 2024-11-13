const axios = require('axios').default;
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function start() {
  try {
    const applicationsMango = await db.constructionApplications.findMany({
      where: {
        typeApplicationCrm: "Сансара",
        mangoUtm: true
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Отправляем каждый элемент массива в sendIntrumCrmTilda с помощью Promise.all
    await Promise.all(applicationsMango.map(sendIntrumCrmTilda));
    
    console.log("Все заявки успешно отправлены в Intrum.");
  } catch (error) {
    console.error("Ошибка при обработке заявок:", error);
  }
}

start();

async function sendIntrumCrmTilda(application) {
  const params = new URLSearchParams();
  
  params.append("apikey", "9a75fc323d968db797ec0ab848572aad");
  params.append("params[request][id]", `${application.idApplicationIntrum}`);
  params.append("params[request][fields][1][id]", "5147");
  params.append("params[request][fields][1][value]", application.campaignUtm || "");
  params.append("params[request][fields][2][id]", "5148");
  params.append("params[request][fields][2][value]", application.termUtm || "");
  params.append("params[request][fields][3][id]", "5185");
  params.append("params[request][fields][3][value]", application.sourceUtm || "");

  try {
    const postResponse = await axios.post(
      "http://jivemdoma.intrumnet.com:81/sharedapi/applications/update",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log(`Заявка ${application.idApplicationIntrum} обновлена`);
    return postResponse.data;
  } catch (error) {
    console.error(`Ошибка при отправке заявки ${application.idApplicationIntrum}:`, error.message);
    return `Запрос в Intrum не выполнен ошибка ${error.message}`;
  }
}
