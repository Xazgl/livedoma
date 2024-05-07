import { columnsSets, columnsSetsApplication, titles, titlesApplication,titles2, columnsSets2} from '@/app/component/table/myFilter';
import { Sales, constructionApplications } from '@prisma/client';
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
     
    const transactionsNew = transactions.map((transaction) => ({
      id: transaction.id,
      idSalesIntrum: transaction.idSalesIntrum,
      responsibleMain: transaction.responsibleMain,
      partCommissionSeller: transaction.partCommissionSeller == null || transaction.partCommissionSeller == '0' || transaction.partCommissionSeller == '' ? null : transaction.partCommissionSeller.split('.')[0],
      sumCommissionBuyer:transaction.sumCommissionBuyer == null || transaction.sumCommissionBuyer == '0' || transaction.sumCommissionBuyer == '' ? null : transaction.sumCommissionBuyer.split('.')[0],
      agentSellerName: transaction.agentSellerName ? transaction.agentSellerName.split(' ')[0] : '',
      agentSellerCommission:  transaction.agentSellerCommission == '0' || transaction.agentSellerCommission == '' || transaction.agentSellerCommission == '0.00' ? null : transaction.agentSellerCommission ? transaction.agentSellerCommission.split('.')[0] : null,
      lawyerName: transaction.lawyerName ? transaction.lawyerName.split(' ')[0] : '',
      lawyerCommission:   transaction.lawyerCommission == '0' || transaction.lawyerCommission == ''|| transaction.lawyerCommission == '0.00' ? null : transaction.lawyerCommission? transaction.lawyerCommission.split('.')[0] : null,
      agentBuyerName: transaction.agentBuyerName ? transaction.agentBuyerName.split(' ')[0] : '',
      agentBuyerCommission:  transaction.agentBuyerCommission == '0' || transaction.agentBuyerCommission == '' || transaction.agentBuyerCommission == '0.00' ? null : transaction.agentBuyerCommission? transaction.agentBuyerCommission.split('.')[0] : null,
      lawyerCommission2:   transaction.lawyerCommission2 == '0' || transaction.lawyerCommission2 == '' || transaction.lawyerCommission2 == '0.00' ? null : transaction.lawyerCommission2? transaction.lawyerCommission2.split('.')[0] : null,
      adress: transaction.adress,
      dateStage: transaction.dateStage,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    }));
        
    // Добавление данных из transactions в таблицу для текущего набора
    transactionsNew.forEach((transaction) => {
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

export async function generateExcel2(applications: constructionApplications[]) {
  const workbook = new ExcelJS.Workbook();

  // Фильтрация данных по типу заявки
  const applicationsByType: Record<string, constructionApplications[]> = {};
  applications.forEach(application => {
    const type = application.typeApplication || 'Unknown';
    if (!applicationsByType[type]) {
      applicationsByType[type] = [];
    }
    applicationsByType[type].push(application);
  });

  // Создание вкладок Excel для каждого типа заявки
  Object.entries(applicationsByType).forEach(([type, data]) => {
    const worksheet = workbook.addWorksheet(type);

    // Добавление заголовков столбцов
    const columns = columnsSetsApplication[type === 'Заявка' ? 0 : 1];
    const russianColumns = columns.map(col => col.headerName);
    worksheet.addRow(russianColumns);

    // Добавление данных в таблицу
    data.forEach(application => {
      const row: Array<string | undefined> = [];
      columns.forEach(col => {
        const value = application[col.field as keyof constructionApplications];
        row.push(value?.toString());
      });
      worksheet.addRow(row);
    });
  });

  // Создание файла Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Сохранение файла на стороне клиента
  saveAs(new Blob([buffer]), 'applications.xlsx');
}


export async function generateExcel3(transactions: Sales[]) {
  const workbook = new ExcelJS.Workbook();

  // Проходимся по каждому набору столбцов и создаем новый лист для каждого
  columnsSets2.forEach((columns, index) => {
    const worksheet = workbook.addWorksheet(titles2[index]);

    // Английские названия колонок (используются для доступа к свойствам объекта transaction)
    const columnFields = columns.map(col => col.field);

    // Добавление заголовков столбцов для текущего набора
    const russianColumns = columns.map(col => col.headerName);
    worksheet.addRow(russianColumns);
     
    const transactionsNew = transactions.map((transaction) => ({
      id: transaction.id,
      idSalesIntrum: transaction.idSalesIntrum,
      responsibleMain: transaction.responsibleMain,
      partCommissionSeller: transaction.partCommissionSeller == null || transaction.partCommissionSeller == '0' || transaction.partCommissionSeller == '' ? null : transaction.partCommissionSeller.split('.')[0],
      sumCommissionBuyer: transaction.sumCommissionBuyer == null || transaction.sumCommissionBuyer == '0' || transaction.sumCommissionBuyer == '' ? null : transaction.sumCommissionBuyer.split('.')[0],
      agentSellerName: transaction.agentSellerName ? transaction.agentSellerName.split(' ')[0] : '',
      agentSellerCommission:  transaction.agentSellerCommission == '0' || transaction.agentSellerCommission == '' || transaction.agentSellerCommission == '0.00' ? null : transaction.agentSellerCommission ? transaction.agentSellerCommission.split('.')[0] : null,
     
      lawyerName: transaction.lawyerName ? transaction.lawyerName.split(' ')[0] : '',
      lawyerCommission:   transaction.lawyerCommission == '0' || transaction.lawyerCommission == ''|| transaction.lawyerCommission == '0.00' ? null : transaction.lawyerCommission? transaction.lawyerCommission.split('.')[0] : null,
      
      agentBuyerName: transaction.agentBuyerName ? transaction.agentBuyerName.split(' ')[0] : '',
      agentBuyerCommission:  transaction.agentBuyerCommission == '0' || transaction.agentBuyerCommission == '' || transaction.agentBuyerCommission == '0.00' ? null : transaction.agentBuyerCommission? transaction.agentBuyerCommission.split('.')[0] : null,
     
      lawyerCommission2:   transaction.lawyerCommission2 == '0' || transaction.lawyerCommission2 == '' || transaction.lawyerCommission2 == '0.00' ? null : transaction.lawyerCommission2? transaction.lawyerCommission2.split('.')[0] : null,
      adress: transaction.adress,
      lawyerSumm: transaction.lawyerSumm == '0' || transaction.lawyerSumm == ''|| transaction.lawyerSumm == '0.00' ? null : transaction.lawyerSumm? transaction.lawyerSumm.split('.')[0] : null,
      lawyerSumm1: transaction.lawyerSumm1 == '0' || transaction.lawyerSumm1 == ''|| transaction.lawyerSumm1 == '0.00' ? null : transaction.lawyerSumm1? transaction.lawyerSumm1.split('.')[0] : null,
      lawyerSalaryDone: transaction.lawyerSalaryDone == '1' ? 'Да' : 'Нет',
      lawyerFormula: transaction.lawyerFormula? transaction.lawyerFormula :'',

      agentBuyerFormul: transaction.agentBuyerFormul? transaction.agentBuyerFormul   : '',
      agentBuyerSalaryDone: transaction.agentBuyerSalaryDone == '1' ? 'Да' : 'Нет',

      agentSellerFormula:transaction.agentSellerFormula? transaction.agentSellerFormula:'',
      agentSellerSalaryDone:transaction.agentSellerSalaryDone == '1' ? 'Да' : 'Нет',

      dateStage: transaction.dateStage,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    }));
        
    // Добавление данных из transactions в таблицу для текущего набора
    transactionsNew.forEach((transaction) => {
      const row: Array<string | undefined> = [];
      columnFields.forEach((field) => {
        //@ts-ignore
        row.push(transaction[field] || '');
      });
      worksheet.addRow(row);
    });
  });

  // Создание файла Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Сохранение файла на стороне клиента
  saveAs(new Blob([buffer]), 'salary.xlsx');
}
