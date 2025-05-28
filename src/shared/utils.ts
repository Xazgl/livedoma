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
