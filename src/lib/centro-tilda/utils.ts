import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import { excludedKeys } from "./constant";

/**
 * Преобразует ключ объекта опроса в читаемый заголовок для Excel файла
 * Правила:
 * - created_at → "Создана"
 * - заменяет "_" на пробелы
 * - делает первую букву заглавной
 * @param key - исходный ключ объекта из Тильды
 * @returns Отформатированный заголовок
 */
export function formatSurveyHeader(key: string): string {
  if (key === "created_at") return "Создана";

  return key
    .replace(/_/g, " ")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Приводит значение поля к формату,
 * пригодному для записи в Excel.
 */
export function normalizeCellValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

/**
 * Строит Excel-лист на основе массива опросов.
 * Функция:
 * - автоматически формирует список колонок
 * - исключает служебные поля
 * - форматирует заголовки (заменяет "_" на пробелы)
 * - добавляет строки с данными
 * - включает автофильтр
 * - настраивает ширину колонок
 * @param worksheet - Экземпляр листа ExcelJS
 * @param surveysData - Массив плоских объектов опросов
 */
export function buildSurveySheet(
  worksheet: ExcelJS.Worksheet,
  surveysData: Record<string, any>[]
): void {
  if (!surveysData.length) {
    worksheet.addRow(["Нет данных"]);
    return;
  }

  const allColumns = new Set<string>();

  surveysData.forEach((survey) => {
    Object.keys(survey).forEach((key) => {
      if (!excludedKeys.has(key)) {
        allColumns.add(key);
      }
    });
  });

  const columnsArray = Array.from(allColumns);
  const headers = columnsArray.map(formatSurveyHeader);
  worksheet.addRow(headers);

  surveysData.forEach((survey) => {
    const row: any[] = [];
    columnsArray.forEach((key) => {
      const value = survey[key];
      row.push(normalizeCellValue(value));
    });
  
    worksheet.addRow(row);
  });

  worksheet.getRow(1).font = { bold: true, size: 12 };

  worksheet.columns = headers.map((header) => ({
    width: Math.min(Math.max(header.length * 1.3, 15), 50),
  }));

  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: headers.length },
  };
}

// Функция формирования для опросов из тильды
export async function generateSurveyExcel(surveys: any[]) {
  const workbook = new ExcelJS.Workbook();

  if (surveys.length === 0) {
    const worksheet = workbook.addWorksheet("Опросы ОП");
    worksheet.addRow(["Нет данных за выбранный период"]);
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "surveys_empty.xlsx");
    return;
  }

  const part1 = surveys.filter(
    (survey) => survey.typeSend === "Tilda Опрос ОП часть 1"
  );
  const part2 = surveys.filter(
    (survey) => survey.typeSend === "Tilda Опрос ОП часть 2"
  );

  const worksheet1 = workbook.addWorksheet("Опрос ОП часть 1");
  const worksheet2 = workbook.addWorksheet("Опрос ОП часть 2");

  buildSurveySheet(worksheet1, part1);
  buildSurveySheet(worksheet2, part2);

  const buffer = await workbook.xlsx.writeBuffer();
  const fileName = `опрос_ОП_${dayjs().format("YYYY-MM-DD")}.xlsx`;
  saveAs(new Blob([buffer]), fileName);
}
