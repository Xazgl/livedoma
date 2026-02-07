import { crmAnswer, MarquizRansom } from "../../@types/dto";

/**
 * Возвращает значение, соответствующее теме (тёмной или светлой).
 * @param {string} theme - Текущая тема, например "dark" или "light".
 * @param {string} darkValue - Значение, которое нужно вернуть для тёмной темы.
 * @param {string} lightValue - Значение, которое нужно вернуть для светлой темы.
 * @returns {string} - Значение, соответствующее текущей теме.
 */
export function checkTheme(
  theme: string,
  darkValue: string,
  lightValue: string
) {
  return theme === "dark" ? darkValue : lightValue;
}

/**
 * Проверяет формат изображения
 * @param {string} url - Текущая ссылка на изображение
 */
export const isImage = (url: string): boolean => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"];
  const urlWithoutParams = url.split("?")[0]; // Убираем параметры из URL
  return imageExtensions.some((ext) =>
    urlWithoutParams.toLowerCase().endsWith(ext)
  );
};

/**
 * Создает дефолтный ответ CRM
 * Используется как начальное состояние перед отправкой
 */
export function createDefaultCrmAnswer(): crmAnswer {
  return {
    status: "no",
    data: {
      customer: "",
      request: "",
    },
  };
}


/**
 * Формирует строку из вопросов и ответов Marquiz
 * @param {Marquiz | MarquizRansomAnswer} answer - объект с массивом вопросов и ответов
 * @returns {string} строка вида "Вопрос1 'Ответ1', Вопрос2 'Ответ2', ..."
 */
export function formatQuestionsAndAnswers(answer: MarquizRansom) {
  let resultString = "";
  answer.answers.forEach((answer) => {
    // Добавление вопроса и ответа к результату
    resultString += `${answer.q} '${answer.a}'`;
    // Добавление пробела после каждой связки вопроса и ответа
    resultString += ", ";
  });
  // Удаление лишнего пробела в конце строки
  resultString = resultString.trim();
  return resultString;
}
