import { columnsSets, titles } from '@/app/component/table/myFilter';
import { Sales } from '@prisma/client';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export async function generateExcel(transactions: Sales[]) {
  const workbook = new ExcelJS.Workbook();

  // Создаем массив для хранения всех данных для вкладки "Склейка"
  const mergedRows: Array<string[]> = [];

  // Проходимся по каждому набору столбцов и создаем новый лист для каждого
  columnsSets.forEach((columns, index) => {
    const worksheet = workbook.addWorksheet(titles[index]);

    // Английские названия колонок (используются для доступа к свойствам объекта transaction)
    const columnFields = columns.map(col => col.field);

    // Добавление заголовков столбцов для текущего набора
    const russianColumns = columns.map(col => col.headerName);
    worksheet.addRow(russianColumns);

    // Добавление данных из transactions в таблицу для текущего набора
    transactions.forEach((transaction) => {
      const row: Array<string | undefined> = [];
      columnFields.forEach((field) => {
        //@ts-ignore
        row.push(transaction[field] || '');
      });
      worksheet.addRow(row);

      
      // Добавляем скопированные строки в массив для вкладки "Склейка"
      //@ts-ignore
      mergedRows.push(row);
    });

    // Добавляем пустую строку между таблицами на вкладке "Склейка"
    if (index < columnsSets.length - 1) {
      mergedRows.push([]);
    }
  });

  // Добавляем вкладку "Склейка"
  const mergeWorksheet = workbook.addWorksheet('Склейка');

  // Добавляем скопированные данные из всех таблиц в столбцы на вкладке "Склейка"
  mergedRows.forEach((row, rowIndex) => {
    row.forEach((cellValue, cellIndex) => {
      mergeWorksheet.getCell(rowIndex + 1, cellIndex + 1).value = cellValue;
    });
  });

  // Создание файла Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Сохранение файла на стороне клиента
  saveAs(new Blob([buffer]), 'transactions.xlsx');
}


// import { columnsSets, titles } from '@/app/component/table/myFilter';
// import { Sales } from '@prisma/client';
// import ExcelJS from 'exceljs';
// import { saveAs } from 'file-saver';

// export async function generateExcel(transactions: Sales[]) {
//   const workbook = new ExcelJS.Workbook();

//   // Проходимся по каждому набору столбцов и создаем новый лист для каждого
//   columnsSets.forEach((columns, index) => {
//     const worksheet = workbook.addWorksheet(titles[index]);

//     // Русские названия колонок для текущего набора
//     const russianColumns = columns.map(col => col.headerName);

//     // Английские названия колонок (используются для доступа к свойствам объекта transaction)
//     const columnFields = columns.map(col => col.field);

//     // Добавление заголовков столбцов для текущего набора
//     worksheet.addRow(russianColumns);

//     // Добавление данных из transactions в таблицу для текущего набора
//     transactions.forEach((transaction) => {
//       const row: Array<string | undefined> = [];
//       columnFields.forEach((field) => {
//         //@ts-ignore
//         row.push(transaction[field] || '');
//       });
//       worksheet.addRow(row);
//     });
//   });

//   // Создание файла Excel
//   const buffer = await workbook.xlsx.writeBuffer();

//   // Сохранение файла на стороне клиента
//   saveAs(new Blob([buffer]), 'transactions.xlsx');
// }










