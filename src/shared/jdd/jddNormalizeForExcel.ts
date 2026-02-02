/**
 *  функция определения типа для рассылок в ЖДД  отчетах
 * @param type - тип из црм
 * @returns тип из црм или измененнный для рассылок
 */
export function getJddTypeForExcel(type: string | null): string {
  const isMailing = type === "Рассылка";
  return isMailing ? "WhatsApp" : type ?? "";
}

/**
 *  функция определения рассылка или нет в отчетах ЖДДА
 * @param type - тип из црм
 * @returns 1 или 0
 */
export function getJddMailingForExcel(type: string | null): string {
  const isMailing = type === "Рассылка";
  return isMailing ? "Да" : "Нет";
}
