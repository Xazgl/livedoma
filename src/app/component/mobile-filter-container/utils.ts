/**
 * Фильтрует массив опций, удаляя пустые строки и строки, состоящие только из пробелов.
 * @param {string[]} options - Массив строк, которые необходимо отфильтровать.
 * @returns {string[]} Новый массив, содержащий только непустые строки.
 */
export const filterNonEmptyOptions = (options: string[]): string[] => {
  return options.filter((option) => option.trim() !== "");
};
