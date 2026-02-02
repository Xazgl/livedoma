import * as XLSX from "xlsx";
import { PhoneColumnRef, PhoneWithType } from "../../../../../@types/dto";

/**
 * Нормализует телефон, оставляя только цифры и символ «+».
 * @param input Исходная строка с номером
 * @returns Нормализованный номер
 */
export function normalizePhone(input: any): string {
  const str = input != null ? String(input) : "";
  let cleaned = str.replace(/[^\d]/g, "");
  
  if (cleaned.length === 10) {
    return "+7" + cleaned;
  }
  if (cleaned.length === 11 && cleaned.startsWith("8")) {
    return "+7" + cleaned.slice(1);
  }
  if (cleaned.startsWith("7") && cleaned.length === 11) {
    return "+" + cleaned;
  }
  if (cleaned.startsWith("+7")) {
    return cleaned;
  }
  return "+" + cleaned;
}


/**
 * Ищет колонку с телефонами по правилам:
 * 1) точное имя "phone"
 * 2) заголовок, содержащий "телефон" (любой регистр)
 * @param headers Массив заголовков первой строки
 * @returns Ссылку на колонку по индексу или ключу, либо null
 */
export function findPhoneColumn(headers: any[]): PhoneColumnRef | null {
  const normalized = headers.map((h) => (typeof h === "string" ? h.trim() : h));

  let index = normalized.findIndex(
    (h) => typeof h === "string" && h.toLowerCase() === "phone"
  );
  if (index >= 0) return { byIndex: true, keyOrIndex: index };

  index = normalized.findIndex(
    (h) => typeof h === "string" && h.toLowerCase().includes("телефон")
  );
  if (index >= 0) return { byIndex: true, keyOrIndex: index };

  for (const h of normalized) {
    if (typeof h !== "string") continue;
    const low = h.toLowerCase();
    if (low === "phone" || low.includes("телефон")) {
      return { byIndex: false, keyOrIndex: h };
    }
  }
  return null;
}

/**
 * Извлекает массив телефонов из файла Excel/CSV.
 * Требует наличия колонки "phone" или заголовка, содержащего "телефон" и колонку тип заявки с типом.
 * @param file Файл Excel/CSV
 * @returns Массив нормализованных телефонных номеров
 * @throws Если колонка не найдена или файл пуст
 */
export async function extractPhonesFromFile(file: File): Promise<PhoneWithType[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const asMatrix = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });
  const headers: any[] = asMatrix[0] || [];
  if (!headers.length) throw new Error("Пустой файл или нет заголовков.");

  const phoneCol = findPhoneColumn(headers);
  const typeColIndex = headers.findIndex(
    (h) => typeof h === "string" && h.toLowerCase().includes("тип заявки")
  );

  let result: PhoneWithType[] = [];

  for (let i = 1; i < asMatrix.length; i++) {
    const row = asMatrix[i];
    if (!row) continue;

    const phoneRaw =
      phoneCol && phoneCol.byIndex
        ? row[phoneCol.keyOrIndex as number]
        : undefined;
    const typeRaw = typeColIndex >= 0 ? row[typeColIndex] : undefined;

    const phoneNumber = normalizePhone(phoneRaw ?? "");
    if (!phoneNumber) continue;

    result.push({
      phoneNumber,
      type: typeRaw ? String(typeRaw).trim() : undefined,
    });
  }

  if (!result.length) {
    throw new Error("Не найдено ни одного валидного телефона.");
  }

  return result;
}
