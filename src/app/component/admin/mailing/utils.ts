import * as XLSX from "xlsx";
import { PhoneColumnRef } from "../../../../../@types/dto";

/**
 * Нормализует телефон, оставляя только цифры и символ «+».
 * @param input Исходная строка с номером
 * @returns Нормализованный номер
 */
export function normalizePhone(input: string): string {
  return input.replace(/[^\d+]/g, "");
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
 * Требует наличия колонки "phone" или заголовка, содержащего "телефон".
 * @param file Файл Excel/CSV
 * @returns Массив нормализованных телефонных номеров
 * @throws Если колонка не найдена или файл пуст
 */
export async function extractPhonesFromFile(file: File): Promise<string[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const asMatrix = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });
  const headers: any[] = asMatrix[0] || [];
  if (!headers.length) throw new Error("Пустой файл или нет заголовков.");

  const columnRef = findPhoneColumn(headers);
  let phones: string[] = [];

  if (columnRef && columnRef.byIndex) {
    phones = asMatrix
      .slice(1)
      .map((row) => (row ? row[columnRef.keyOrIndex as number] : undefined))
      .map((v) => (v == null ? "" : String(v).trim()))
      .filter(Boolean);
  } else {
    const asObjects = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, {
      defval: "",
    });
    if (!asObjects.length) throw new Error("Пустой файл.");
    const keys = Object.keys(asObjects[0]);
    const fallbackRef = findPhoneColumn(keys);
    if (!fallbackRef) {
      throw new Error('Не найдена колонка "phone" или содержащая "телефон".');
    }
    const key = fallbackRef.keyOrIndex as string;
    phones = asObjects
      .map((row) => (row?.[key] == null ? "" : String(row[key]).trim()))
      .filter(Boolean);
  }

  const normalized = phones.map(normalizePhone).filter(Boolean);
  if (!normalized.length) {
    throw new Error("В колонке с телефонами не найдено ни одного номера.");
  }
  return normalized;
}
