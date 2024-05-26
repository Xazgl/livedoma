
const axios = require('axios').default
const { AxiosError } = require("axios");


async function commentArr(id) {
    if (id !== '0' && id !== 0 && id !== undefined && id !== null) {
        const params = new URLSearchParams();
        params.append("apikey", "9a75fc323d968db797ec0ab848572aad");
        params.append("params[entity_id][0]", `${id}`);

        try {
            const response = await axios.post('http://jivemdoma.intrumnet.com:81/sharedapi/applications/comments',
                params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const comments = response.data.data[id]; // Получаем массив комментариев по id
            if (comments.length > 0) {
                const texts = comments.map(comment => comment.text); // Преобразуем в массив строк из поля "text"
                return texts;
            } else {
                return [''];
            }

        } catch (error) {
            console.error("Ошибка при получении комментариев:", error);
            return [''];
        }
    }
}


module.exports = {
    commentArr: commentArr,
};