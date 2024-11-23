import { checkTheme } from "@/shared/utils";

/**
 * Генерирует классы для элемента на основе темы.
 *
 * @param {string} theme - Текущая тема, например "dark" или "light".
 * @returns {string} - Сгенерированные классы.
 */
export function getClassFilterBox(theme: string): string {
  return `
      flex flex-col p-9 rounded-[20px] h-[300px] w-[90%] mt-[15px]
      ${checkTheme(
        theme,
        "bg-[#3a3f4635]", // Класс для тёмной темы
        "bg-gradient-to-r from-[rgb(227,247,255)] to-[rgb(244,238,254)]" // Класс для светлой темы
      )}
    `.trim();
}

export function calculateFilterWidth(filterCount: number): string {
  if (filterCount === 3) {
    return "33%";
  } else if (filterCount === 2) {
    return "49%";
  } else {
    return "100%";
  }
}
