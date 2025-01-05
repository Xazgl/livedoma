/**
 * Проверяет, является ли ID менеджера валидным
 * @param {string} managerId - ID менеджера для проверки
 * @param {number[]} existingManagerIds - Список существующих ID менеджеров
 * @returns {string | undefined} - Сообщение об ошибке, если ID некорректен, иначе undefined
 */
export const validateManagerId = (
  managerId: string,
  existingManagerIds: number[]
): string | undefined => {
  if (!managerId) {
    return "ID менеджера обязателен";
  }
  if (!/^\d+$/.test(managerId)) {
    return "ID менеджера должен содержать только цифры";
  }
  if (existingManagerIds.includes(Number(managerId))) {
    return "Этот ID уже есть в списке";
  }
  return undefined;
};

/**
 * Проверяет, является ли имя менеджера валидным
 * @param {string} name - Имя менеджера для проверки
 * @returns {string | undefined} - Сообщение об ошибке, если имя некорректно, иначе undefined
 */
export const validateManagerName = (name: string): string | undefined => {
  if (!name.trim()) {
    return "Имя обязательно";
  } else {
    if (!/^[A-Za-zА-Яа-яёЁ]+$/.test(name)) {
      return "ФИО может содержать только буквы";
    }
  }
  return undefined;
};

/**
 * Проверяет все поля нового менеджера
 * @param {Object} newManager - Новый менеджер
 * @param {number[]} existingManagerIds - Список существующих ID менеджеров
 * @returns {Object} - Объект с ошибками для каждого поля
 */
export const validateNewManager = (
  newManager: { manager_id: string; name: string },
  existingManagerIds: number[]
): { manager_id?: string; name?: string } => {
  return {
    manager_id: validateManagerId(newManager.manager_id, existingManagerIds),
    name: validateManagerName(newManager.name),
  };
};
