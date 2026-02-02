import { Tilda } from "@prisma/client";

/**
 * Проверяет, относится ли форма к категории "Ремонты"
 * @param {string} formName - Название формы
 * @param {{ Tilda }} [message] - Объект с информацией о сообщении, может содержать formid.
 * @returns {boolean} - true, если форма относится к "Ремонты"
 */
export function isRepairForm(formName: string, message: Tilda) {
  if (
    formName === "Ремонты-бесплатный замер" ||
    message?.formid === "form714887068" ||
    message?.formid === "form716183792" ||
    formName === "Ремонты-консультация" ||
    formName === "Ремонты - заказать 3д" ||
    formName?.includes("Ремонт")
  ) {
    return true;
  }
  return false;
}
