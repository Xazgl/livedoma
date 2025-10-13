import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

// Функция формирования для опросов из тильды
export async function generateSurveyExcel(surveys: any[]) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Опросы ОП");
  
    if (surveys.length === 0) {
      worksheet.addRow(["Нет данных за выбранный период"]);
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), "surveys_empty.xlsx");
      return;
    }
  
    const allColumns = new Set<string>();
    surveys.forEach((survey) => {
      Object.keys(survey).forEach((key) => {
        if (key !== "id" && key !== "error" && key !== "raw_name") {
          allColumns.add(key);
        }
      });
    });
  
    // Функция для форматирования заголовков
    const formatHeader = (key: string): string => {
      if (key === 'db_id') return '';
      if (key === 'created_at') return 'Создана';
      if (key === 'formid') return '';
      if (key === 'phone') return '';
      
      // Заменяем подчеркивания на пробелы и делаем первую букву заглавной
      return key
        .replace(/_/g, ' ')
        .replace(/^./, str => str.toUpperCase())
        .trim();
    };
  
    const headers = Array.from(allColumns)
      .map(formatHeader)
      .filter(header => header !== ''); 
  
    worksheet.addRow(headers);
  
    // Добавляем данные с обработкой разных типов
    surveys.forEach((survey) => {
      const row: any[] = [];
      Array.from(allColumns).forEach((header) => {
        // Пропускаем поля, которые убрали из заголовков
        if (['db_id', 'formid', 'phone'].includes(header)) {
          return;
        }
        
        const value = survey[header];
  

        if (value === null || value === undefined) {
          row.push("");
        } else if (Array.isArray(value)) {
          row.push(value.join(", "));
        } else if (typeof value === "object") {
          row.push(JSON.stringify(value));
        } else {
          row.push(String(value));
        }
      });
      worksheet.addRow(row);
    });
  
    const headerRow = worksheet.getRow(1);
    headerRow.font = { 
      bold: true, 
      size: 12 
    };
  
    // Автоподбор ширины колонок
    worksheet.columns = headers.map((header) => ({
      width: Math.min(Math.max(header.length * 1.3, 15), 50),
    }));
  
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: headers.length },
    };
  
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `опрос_ОП_${dayjs().format("YYYY-MM-DD")}.xlsx`;
    saveAs(new Blob([buffer]), fileName);
  }
