//@ts-check

const axios = require('axios').default


async function sendEmail(email, link,  emailWithError, maxAttempts = 3) {
    let attempt = 0;
    let success = false;

    while (attempt < maxAttempts && !success) {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const response = await axios.get(`${link}&email=${email}`);
            console.log(`Email ${email} успешно отправлен на курс.`);
            console.log(response.data);
            success = true;
        } catch (error) {
            console.error(`Ошибка при отправке email ${email}: ${error}`);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            attempt++;
        }
    }

    if (!success) {
        console.error(`Достигнут предельный лимит попыток для отправки email ${email}`);
        emailWithError.push(email); // Добавляем email в массив ошибочных писем
    }
}


module.exports = {
    sendEmail: sendEmail,
};