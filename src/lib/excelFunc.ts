import { columnsSets, columnsSetsApplication, titles, titlesApplication,titles2, columnsSets2} from '@/app/component/table/myFilter';
import { Sales, constructionApplications } from '@prisma/client';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { constructionApplicationsExcel } from '../../@types/dto';
import { formatDate, formatDateTime } from './dateStr';
import { comment } from 'postcss';

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

// export async function generateExcel2(applications: constructionApplications[]) {
//   const workbook = new ExcelJS.Workbook();

//   // Фильтрация данных по типу заявки
//   const applicationsByType: Record<string, constructionApplications[]> = {};
//   applications.forEach(application => {
//     const type = application.typeApplication || 'Unknown';
//     if (!applicationsByType[type]) {
//       applicationsByType[type] = [];
//     }
//     applicationsByType[type].push(application);
//   });

//   // Создание вкладок Excel для каждого типа заявки
//   Object.entries(applicationsByType).forEach(([type, data]) => {
//     const worksheet = workbook.addWorksheet(type);

//     // Добавление заголовков столбцов
//     const columns = columnsSetsApplication[type === 'Заявка' ? 0 : 1];
//     const russianColumns = columns.map(col => col.headerName);
//     worksheet.addRow(russianColumns);

//     // Добавление данных в таблицу
//     data.forEach(application => {
//       const row: Array<string | undefined> = [];
//       columns.forEach(col => {
//         const value = application[col.field as keyof constructionApplications];
//         row.push(value?.toString());
//       });
//       worksheet.addRow(row);
//     });
//   });

  

//   // Создание файла Excel
//   const buffer = await workbook.xlsx.writeBuffer();

//   // Сохранение файла на стороне клиента
//   saveAs(new Blob([buffer]), 'applications.xlsx');
// }

export async function generateExcel2(applications: constructionApplications[]) {
  const workbook = new ExcelJS.Workbook();

  const managers = [
    { name: "Политов", id: "391" },
    { name: "Максимова", id: "332" },
    { name: "Исаева", id: "39" },
    { name: "Трубачева", id: "1460" },
    { name: "Бородина", id: "353" },
  ];

  function  findManager(id: string) {
    const manager = managers.find(manager => manager.id === id);
    return  manager? manager.name : 'Нету';

  }
    

  const applicationsNew = applications.map((appl) => ({
    id: appl.id,
    idApplicationIntrum:appl.idApplicationIntrum,
    translator:appl.translator? appl.translator :'',
    responsibleMain:appl.responsibleMain ? findManager(appl.responsibleMain) : '',
    status:appl.status? appl.status : '',
    postMeetingStage:appl.postMeetingStage? appl.postMeetingStage : '',
    desc:appl.desc? appl.desc : '',
    typeApplication: appl.typeApplication? appl.typeApplication : '',
    contactedClient:appl.contactedClient == '1'? 'Да': 'Нет',
    campaignUtm: appl.campaignUtm?  appl.campaignUtm :'',
    termUtm: appl.termUtm? appl.termUtm : '',
    nextAction: appl.nextAction?  formatDate(appl.nextAction) :'',
    rejection:appl.rejection? appl.rejection : '',
    errorReejctionDone: appl.errorReejctionDone ==  true? 'Да' : 'Нет', // Ошибка исправлена?
    datecallCenter: appl.datecallCenter? appl.datecallCenter : '', //Дата обработки заявки колл центром String? //Дата обработки заявки колл центром
    timecallCenter:appl.timecallCenter? appl.timecallCenter: '',
    okCallCenter: appl.timecallCenter? appl.timecallCenter < '0.15' ? '✓' : '👎🏻' : '', // ОК КЦ
    timesaletCenter:appl.timesaletCenter? appl.timesaletCenter  :'' ,
    okSaleCenter: appl.timesaletCenter? appl.timesaletCenter < '0.15' ? '✓' : '👎🏻': '' , // ОК ОП
    dateFirstContact: appl.dateFirstContact? appl.dateFirstContact : '',
    phone:appl.phone? appl.phone : '',
    comment:appl.comment? appl.comment : [],
    url:appl.url? appl.url : `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${appl.idApplicationIntrum}#request`,
    createdAtCrm: appl.createdAtCrm ? appl.createdAtCrm : '', 
    createdAt: appl.createdAt ? formatDateTime(new Date(appl.createdAt)) : ''
  }));

  // Фильтрация данных по типу заявки
  let applicationsByType: Record<string, constructionApplicationsExcel[]> = {};
  applicationsNew.forEach(application => {
    const type = application.typeApplication || 'Заявка без типа';
    if (!applicationsByType[type]) {
      applicationsByType[type] = [];
    }
    applicationsByType[type].push(application);
  });
 


  // Создание вкладок Excel для каждого типа заявки
  // Создание вкладок Excel для каждого типа заявки
Object.entries(applicationsByType).forEach(([type, data]) => {
  if (type !== 'Заявка без типа') {
    const worksheet = workbook.addWorksheet(type);

    // Добавление заголовков столбцов
    let  columns = columnsSetsApplication[type === 'Заявка' ? 0 : 1];


    // Удаление колонок "campaignUtm" и "termUtm" на вкладках "Кампания" и "Звонок"
    if (type === 'WhatsApp' || type === 'Звонок') {
      columns = columns.filter(col => col.field !== 'campaignUtm' && col.field !== 'termUtm');
    }

    const russianColumns = columns.map(col => col.headerName);
    worksheet.addRow(russianColumns);

    

    // Добавление данных в таблицу
    data.forEach(application => {
      const row: Array<string | undefined> = [];
      columns.forEach(col => {
        const value = application[col.field as keyof  constructionApplicationsExcel];
        row.push(value?.toString());
      });
      worksheet.addRow(row);
    });

    // Управление стилями для колонки "URL"
    const postUrlColumn = columns.find(col => col.field === 'url');

    if (postUrlColumn) {
      const postUrlColumnIndex = columns.findIndex(col => col.field === 'url') + 1;
      worksheet.getColumn(postUrlColumnIndex).eachCell((cell) => {
        const cellValue = cell.text;
        if (cellValue) {
          cell.value = { text: cellValue, hyperlink: cellValue };
          cell.font = {
            underline: true,
            color: { argb: 'FF0000FF' },
          };
        }
      });
    }

     // Управление стилями для колонки "ОК ОП"
     const okSaleCenterColumn  = columns.find(col => col.field === 'okSaleCenter');

     if (okSaleCenterColumn) {
       const okSaleCenterColumnIndex = columns.findIndex(col => col.field === 'okSaleCenter') + 1;
       worksheet.getColumn(okSaleCenterColumnIndex).eachCell((cell) => {
         const cellValue = cell.text;
 
         switch (cellValue) {
           case '✓':
             cell.fill = {
               type: 'pattern',
               pattern: 'solid',
               fgColor: { argb: 'FF008000' }, //  зеленый
             };
             break;
           case '👎🏻':
             cell.fill = {
               type: 'pattern',
               pattern: 'solid',
               fgColor: { argb: 'FFFF0000' } // красный
             };
             break;
           default:
             // оставить по умолчанию
             break;
         }
       });
     }

     // Управление стилями для колонки "ОК КЦ"
     const okCallCenterColumn  = columns.find(col => col.field === 'okCallCenter');

     if (okCallCenterColumn) {
       const okCallCenterColumnIndex = columns.findIndex(col => col.field === 'okCallCenter') + 1;
       worksheet.getColumn(okCallCenterColumnIndex).eachCell((cell) => {
         const cellValue = cell.text;
 
         switch (cellValue) {
           case '✓':
             cell.fill = {
               type: 'pattern',
               pattern: 'solid',
               fgColor: { argb: 'FF008000' }, //  зеленый
             };
             break;
           case '👎🏻':
             cell.fill = {
               type: 'pattern',
               pattern: 'solid',
               fgColor: { argb: 'FFFF0000' } // красный
             };
             break;
           default:
             // оставить по умолчанию
             break;
         }
       });
     }

    // Управление стилями для колонки "Стадия после встречи"
    const postMeetingStageColumn = columns.find(col => col.field === 'postMeetingStage');

    if (postMeetingStageColumn) {
      const postMeetingStageColumnIndex = columns.findIndex(col => col.field === 'postMeetingStage') + 1;
      worksheet.getColumn(postMeetingStageColumnIndex).eachCell((cell) => {
        const cellValue = cell.text;

        switch (cellValue) {
          case 'Встреча не состоялась':
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFFFFF' }, // белый
            };
            break;
          case 'Думает':
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFA500' } // оранжевый
            };
            break;
          case 'Отказался':
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFF0000' } // красный
            };
            break;
          case 'Отправлен расчет':
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFFF00' } // желтый
            };
            break;
          case 'Подготовка расчета':
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF0000FF' } // синий
            };
            break;
          case 'Подписан договор':
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF008000' } // срдне  зеленый
            };
            case 'Подготовка проекта':
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF008000' } // слабо  зеленый
              };
              case 'Продажа':
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FF008000' } // ярко  зеленый
                };
            break;
          default:
            // оставить по умолчанию
            break;
        }
      });
    }
  }
});
  // Object.entries(applicationsByType).forEach(([type, data]) => {
  //   if (type !== 'Заявка без типа') {
  //   const worksheet = workbook.addWorksheet(type);

  //   // Добавление заголовков столбцов
  //   const columns = columnsSetsApplication[type === 'Заявка' ? 0 : 1];
  //   const russianColumns = columns.map(col => col.headerName);
  //   worksheet.addRow(russianColumns);

  //   // Добавление данных в таблицу
  //   data.forEach(application => {
  //     const row: Array<string | undefined> = [];
  //     columns.forEach(col => {
  //       const value = application[col.field as keyof  constructionApplicationsExcel];
  //       row.push(value?.toString());
  //     });
  //     worksheet.addRow(row);
  //   });

   
    
  //   // Управление стилями для колонки "Ссылка"
  //   const postUrlColumn = columns.find(col => col.field === 'url');
    
  //   if (postUrlColumn) {
  //     const postUrlColumnIndex = columns.findIndex(col => col.field === 'url') + 1;
  //     worksheet.getColumn(postUrlColumnIndex).eachCell((cell) => {
  //       const cellValue = cell.text;
  //       if (cellValue) {
  //         cell.value = { text: cellValue, hyperlink: cellValue };
  //         cell.font = {
  //           underline: true,
  //           color: { argb: 'FF0000FF' },
  //         };
  //       }
  //     });
  //   }

  //   // Управление стилями для колонки "Стадия после встречи"
  //   const postMeetingStageColumn = columns.find(col => col.field === 'postMeetingStage');
    
  //   if (postMeetingStageColumn) {
  //     const postMeetingStageColumnIndex = columns.findIndex(col => col.field === 'postMeetingStage') + 1;
  //     worksheet.getColumn(postMeetingStageColumnIndex).eachCell((cell) => {
  //       const cellValue = cell.text;
        
  //       switch (cellValue) {
  //         case 'Встреча не состоялась':
  //           cell.fill = {
  //             type: 'pattern',
  //             pattern: 'solid',
  //             fgColor: { argb: 'FFFFFFFF' }, // белый
  //           };
  //           break;
  //         case 'Думает':
  //           cell.fill = {
  //             type: 'pattern',
  //             pattern: 'solid',
  //             fgColor: { argb: 'FFFFA500' } // оранжевый
  //           };
  //           break;
  //         case 'Отказался':
  //           cell.fill = {
  //             type: 'pattern',
  //             pattern: 'solid',
  //             fgColor: { argb: 'FFFF0000' } // красный
  //           };
  //           break;
  //         case 'Отправлен расчет':
  //           cell.fill = {
  //             type: 'pattern',
  //             pattern: 'solid',
  //             fgColor: { argb: 'FFFFFF00' } // желтый
  //           };
  //           break;
  //         case 'Подготовка расчета':
  //           cell.fill = {
  //             type: 'pattern',
  //             pattern: 'solid',
  //             fgColor: { argb: 'FF0000FF' } // синий
  //           };
  //           break;
  //         case 'Договор':
  //           cell.fill = {
  //             type: 'pattern',
  //             pattern: 'solid',
  //             fgColor: { argb: 'FF008000' } // зеленый
  //           };
  //           break;
  //         default:
  //           // оставить по умолчанию
  //           break;
  //       }
  //     });
  //   }
  // }
  // });

  // Создание файла Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Сохранение файла на стороне клиента
  saveAs(new Blob([buffer]), 'applications.xlsx');
}






export async function generateExcel3(transactions: Sales[]) {
  const workbook = new ExcelJS.Workbook();  

  // Преобразование данных transactions
  const transactionsNew = transactions.map((transaction) => ({
    id: transaction.id,
    idSalesIntrum: transaction.idSalesIntrum,
    responsibleMain: transaction.responsibleMain,
    partCommissionSeller: (transaction.partCommissionSeller && parseFloat(transaction.partCommissionSeller).toFixed(0)) || null,
    sumCommissionBuyer: (transaction.sumCommissionBuyer && parseFloat(transaction.sumCommissionBuyer).toFixed(0)) || null,
    agentSellerName: transaction.agentSellerName ? transaction.agentSellerName.split(' ')[0] : '',
    agentSellerCommission: (transaction.agentSellerCommission && parseFloat(transaction.agentSellerCommission).toFixed(0)) || null,
    lawyerName: transaction.lawyerName ? transaction.lawyerName.split(' ')[0] : '',
    lawyerCommission: (transaction.lawyerCommission && parseFloat(transaction.lawyerCommission).toFixed(0)) || null,
    agentBuyerName: transaction.agentBuyerName ? transaction.agentBuyerName.split(' ')[0] : '',
    agentBuyerCommission: (transaction.agentBuyerCommission && parseFloat(transaction.agentBuyerCommission).toFixed(0)) || null,
    lawyerCommission2: (transaction.lawyerCommission2 && parseFloat(transaction.lawyerCommission2).toFixed(0)) || null,
    adress: transaction.adress,
    lawyerSalary: transaction.lawyerSalary? transaction.lawyerSalary : '',
    lawyerSumm: (transaction.lawyerSumm && parseFloat(transaction.lawyerSumm).toFixed(0)) || null,
    lawyerSumm1: (transaction.lawyerSumm1 && parseFloat(transaction.lawyerSumm1).toFixed(0)) || null,
    lawyerSalaryDone: transaction.lawyerSalaryDone === '1' ? 'Да' : 'Нет',
    lawyerFormula: transaction.lawyerFormula || '',
    agentBuyerFormul: transaction.agentBuyerFormul || '',
    agentBuyerSalaryDone: transaction.agentBuyerSalaryDone === '1' ? 'Да' : 'Нет',
    agentSellerFormula: transaction.agentSellerFormula || '',
    agentSellerSalaryDone: transaction.agentSellerSalaryDone === '1' ? 'Да' : 'Нет',
    mortageFormula:transaction.mortageFormula ? transaction.mortageFormula :'',
    mortageSumm1:transaction.mortageSumm1? transaction.mortageSumm1 :'',
    mortageOtdel:transaction.mortageOtdel?transaction.mortageOtdel : '',
    dateStage: transaction.dateStage,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt
  }));

  // Проходимся по каждому набору столбцов и создаем новый лист для каждого
  for (let index = 0; index < columnsSets2.length; index++) {
    const columns = columnsSets2[index];
    const worksheet = workbook.addWorksheet(titles2[index]);

    // Фильтр для текущей вкладки
    let filter: (item: Sales) => boolean;

    // Определяем фильтр в зависимости от выбранной вкладки
    switch (index) {
      case 0:
        filter = (item) => item.lawyerSalaryDone !== "Да";
        break;
      case 1:
        filter = (item) => item.agentSellerSalaryDone !== "Да";
        break;
      case 2:
        filter = (item) => item.agentBuyerSalaryDone !== "Да";
        break;
      case 3:
        filter = (item) => item.mortageOtdel == "да";
        break;
      default:
        filter = () => true; // Вернуть все записи, если вкладка не найдена
        break;
    }

    // Фильтруем транзакции в соответствии с текущей вкладкой
          //@ts-ignore
    const filteredTransactions = transactionsNew.filter(filter);

    // Добавление заголовков столбцов для текущего набора
    const russianColumns = columns.map((col) => col.headerName);
    worksheet.addRow(russianColumns);

    // Добавление данных из отфильтрованных транзакций в таблицу
    filteredTransactions.forEach((transaction) => {
      const row: Array<string | undefined> = [];
      columns.forEach((col) => {
        // Проверяем, существует ли свойство `col.field` в объекте `transaction`
        //@ts-ignore
        if (col.field in transaction) {
                //@ts-ignore
          row.push(transaction[col.field]);
        } else {
          row.push("");
        }
      });
      worksheet.addRow(row);
    });
  }

  // Создание файла Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Сохранение файла на стороне клиента
  saveAs(new Blob([buffer]), "salary.xlsx");
}


// export async function generateExcel3(transactions: Sales[]) {
//   const workbook = new ExcelJS.Workbook();

//   // Проходимся по каждому набору столбцов и создаем новый лист для каждого
//   columnsSets2.forEach((columns, index) => {
//     const worksheet = workbook.addWorksheet(titles2[index]);

//     // Английские названия колонок (используются для доступа к свойствам объекта transaction)
//     const columnFields = columns.map(col => col.field);

//     // Добавление заголовков столбцов для текущего набора
//     const russianColumns = columns.map(col => col.headerName);
//     worksheet.addRow(russianColumns);
     
//     const transactionsNew = transactions.map((transaction) => ({
//       id: transaction.id,
//       idSalesIntrum: transaction.idSalesIntrum,
//       responsibleMain: transaction.responsibleMain,
//       partCommissionSeller: transaction.partCommissionSeller == null || transaction.partCommissionSeller == '0' || transaction.partCommissionSeller == '' ? null : transaction.partCommissionSeller.split('.')[0],
//       sumCommissionBuyer: transaction.sumCommissionBuyer == null || transaction.sumCommissionBuyer == '0' || transaction.sumCommissionBuyer == '' ? null : transaction.sumCommissionBuyer.split('.')[0],
//       agentSellerName: transaction.agentSellerName ? transaction.agentSellerName.split(' ')[0] : '',
//       agentSellerCommission:  transaction.agentSellerCommission == '0' || transaction.agentSellerCommission == '' || transaction.agentSellerCommission == '0.00' ? null : transaction.agentSellerCommission ? transaction.agentSellerCommission.split('.')[0] : null,
     
//       lawyerName: transaction.lawyerName ? transaction.lawyerName.split(' ')[0] : '',
//       lawyerCommission:   transaction.lawyerCommission == '0' || transaction.lawyerCommission == ''|| transaction.lawyerCommission == '0.00' ? null : transaction.lawyerCommission? transaction.lawyerCommission.split('.')[0] : null,
      
//       agentBuyerName: transaction.agentBuyerName ? transaction.agentBuyerName.split(' ')[0] : '',
//       agentBuyerCommission:  transaction.agentBuyerCommission == '0' || transaction.agentBuyerCommission == '' || transaction.agentBuyerCommission == '0.00' ? null : transaction.agentBuyerCommission? transaction.agentBuyerCommission.split('.')[0] : null,
     
//       lawyerCommission2:   transaction.lawyerCommission2 == '0' || transaction.lawyerCommission2 == '' || transaction.lawyerCommission2 == '0.00' ? null : transaction.lawyerCommission2? transaction.lawyerCommission2.split('.')[0] : null,
//       adress: transaction.adress,
//       lawyerSumm: transaction.lawyerSumm == '0' || transaction.lawyerSumm == ''|| transaction.lawyerSumm == '0.00' ? null : transaction.lawyerSumm? transaction.lawyerSumm.split('.')[0] : null,
//       lawyerSumm1: transaction.lawyerSumm1 == '0' || transaction.lawyerSumm1 == ''|| transaction.lawyerSumm1 == '0.00' ? null : transaction.lawyerSumm1? transaction.lawyerSumm1.split('.')[0] : null,
//       lawyerSalaryDone: transaction.lawyerSalaryDone == '1' ? 'Да' : 'Нет',
//       lawyerFormula: transaction.lawyerFormula? transaction.lawyerFormula :'',

//       agentBuyerFormul: transaction.agentBuyerFormul? transaction.agentBuyerFormul   : '',
//       agentBuyerSalaryDone: transaction.agentBuyerSalaryDone == '1' ? 'Да' : 'Нет',

//       agentSellerFormula:transaction.agentSellerFormula? transaction.agentSellerFormula:'',
//       agentSellerSalaryDone:transaction.agentSellerSalaryDone == '1' ? 'Да' : 'Нет',

//       dateStage: transaction.dateStage,
//       createdAt: transaction.createdAt,
//       updatedAt: transaction.updatedAt
//     }));
        
//     // Добавление данных из transactions в таблицу для текущего набора
//     transactionsNew.forEach((transaction) => {
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
//   saveAs(new Blob([buffer]), 'salary.xlsx');
// }


