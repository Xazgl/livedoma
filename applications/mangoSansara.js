const axios = require('axios').default;
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();


const fetchAndProcessApplications = async () => {
    // Получаем текущую дату
    const currentDate = new Date();
    const prevDay = new Date(currentDate.getTime() - (14 * 24 * 60 * 60 * 1000)); // Вычитаем 14 дней

    // Преобразуем даты в формат Y-m-d
    const formattedPrevDate = prevDay.toISOString().split('T')[0];
    const formattedDateCurrent = currentDate.toISOString().split('T')[0];

    // Запрашиваем данные из БД
    const applications = await db.constructionApplications.findMany({
        where: {
            createdAtCrm: {
                lte: formattedDateCurrent,
                gte: formattedPrevDate,
            },
            typeApplicationCrm: 'Сансара',
            typeApplication: {
                contains: 'звонок',
            }
        },
        orderBy: {
            createdAt: 'asc',
        },
    });

    if (applications.length === 0) {
        console.log('Заявки в БД не найдены');
        return;
    }

    const url = `https://widgets-api.mango-office.ru/v1/calltracking/33769/calls.json?dateStart=${formattedPrevDate}T23:59Z&dateEnd=${formattedDateCurrent}T23:59Z&access_token=31c1f4a7633e7411430f9917c068b11a0d661cf6`;

    try {
        const response = await axios.get(url);
        const callData = response.data;
        console.log(callData);
        console.log(applications);

        // Обрабатываем данные и сверяем номера телефонов
        for (const application of applications) {
            // Проходим по каждому звонку из callData
            for (const call of callData) {
                // Сравниваем номера
                console.log(application.phone, call.callerNumber)
                if (String(application.phone) === String(call.callerNumber)) {
                   const translator =   application.utm_source !=='vk' || application.utm_source !=='TG' &&  call.utmSource || call.utmSource ||  call.utmCampaign ||  call.utmTerm?  'Лендинг Сансара' : application.translator

                    console.log('Совпадение найдено:', {
                        applicationPhone: application.phone,
                        callerPhone: call.callerNumber,
                        utmCampaign: call.utmCampaign,
                        utmTerm: call.utmTerm,
                    });

                    // Обновляем поля utmCampaign и utmTerm в базе данных
                    await db.constructionApplications.update({
                        where: {
                            id: application.id,
                        },
                        data: {
                            translator:translator,
                            sourceUtm: call.utmSource,
                            campaignUtm: call.utmCampaign,
                            termUtm: call.utmTerm,
                            mangoUtm: true
                        },
                    });
                }
            }
        }

        console.log('Данные успешно обновлены!');
    } catch (error) {
        console.error('Ошибка при запросе данных или обновлении БД:', error);
    }
};

// Вызов функции
fetchAndProcessApplications();
