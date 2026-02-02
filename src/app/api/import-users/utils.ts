import { PhoneWithType } from "../../../../@types/dto";

/** Приводит номер к формату +7XXXXXXXXXX (если возможно), иначе возвращает пустую строку */
export function normalizeToRuE164(input: unknown): string {
  const digits = String(input ?? "").replace(/\D/g, "");

  if (/^7\d{10}$/.test(digits)) return `+${digits}`;
  if (/^8\d{10}$/.test(digits)) return `+7${digits.slice(1)}`;
  if (/^\d{10}$/.test(digits) && digits.startsWith("9")) return `+7${digits}`;
  if (/^\+7\d{10}$/.test(String(input))) return String(input);

  return "";
}

/** Проверяет формат строго как +7XXXXXXXXXX */
export function isRuE164(phone: string): boolean {
  return /^\+7\d{10}$/.test(phone);
}

/**
 * Формирует массив пар (phoneNumber, name) из сырых данных импорта
 * Нормализует каждый телефон до формата +7XXXXXXXXXX
 * Привязывает к нему имя из массива names по индексу (если есть)
 * Отбрасывает все записи, у которых номер не прошёл проверку isRuE164
 * @param phones Массив исходных телефонных значений
 * @param names  Дополнительный массив имён
 * @returns Массив объектов формата `{ phoneNumber: string; name: string | null }`
 * только с валидными номерами в формате +7XXXXXXXXXX
 */
export function buildPhonePairs(
  phones: PhoneWithType[],
  names?: (string | null | undefined)[]
) {
  const safeNames = Array.isArray(names) ? names : [];

  return phones
    .map((p, i) => {
      const phoneNumber = normalizeToRuE164(p.phoneNumber);
      if (!phoneNumber) {
        return null;
      }
      return {
        phoneNumber,
        name: safeNames[i] ?? null,
        type: (p as any).type,
      };
    })
    .filter(Boolean) as {
    phoneNumber: string;
    name: string | null;
    type?: string;
  }[];
}
