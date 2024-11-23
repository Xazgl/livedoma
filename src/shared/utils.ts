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
