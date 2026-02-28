import {
  columnsSets,
  columnsSetsApplication,
  titles,
  titles2,
  columnsSets2,
  columnsSetsApplicationSansara,
  columnsSetsApplicationRansom,
  columnsSetsApplicationNovodvinskaya,
} from "@/app/component/table/myFilter";
import { Sales, constructionApplications } from "@prisma/client";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { constructionApplicationsExcel } from "../../@types/dto";
import {
  formatDate,
  formatDateTime,
  formatDateTimeToDDMMYYYYHHMMSS,
} from "./dateStr";
import { getTranslatorJdd } from "@/shared/jdd/utils";
import { sharedCrmManagers } from "@/shared/constant/manager-constant/constant";

export async function generateExcel(transactions: Sales[]) {
  const workbook = new ExcelJS.Workbook();

  // Создаем массив для хранения всех данных для вкладки "Склейка"
  const mergedRows: Array<string[]> = [];

  // Проходимся по каждому набору столбцов и создаем новый лист для каждого
  columnsSets.forEach((columns, index) => {
    const worksheet = workbook.addWorksheet(titles[index]);

    // Английские названия колонок (используются для доступа к свойствам объекта transaction)
    const columnFields = columns.map((col) => col.field);

    // Добавление заголовков столбцов для текущего набора
    const russianColumns = columns.map((col) => col.headerName);
    worksheet.addRow(russianColumns);

    const transactionsNew = transactions.map((transaction) => ({
      id: transaction.id,
      idSalesIntrum: transaction.idSalesIntrum,
      responsibleMain: transaction.responsibleMain,
      partCommissionSeller:
        transaction.partCommissionSeller == null ||
        transaction.partCommissionSeller == "0" ||
        transaction.partCommissionSeller == ""
          ? null
          : transaction.partCommissionSeller.split(".")[0],
      sumCommissionBuyer:
        transaction.sumCommissionBuyer == null ||
        transaction.sumCommissionBuyer == "0" ||
        transaction.sumCommissionBuyer == ""
          ? null
          : transaction.sumCommissionBuyer.split(".")[0],
      agentSellerName: transaction.agentSellerName
        ? transaction.agentSellerName.split(" ")[0]
        : "",
      agentSellerCommission:
        transaction.agentSellerCommission == "0" ||
        transaction.agentSellerCommission == "" ||
        transaction.agentSellerCommission == "0.00"
          ? null
          : transaction.agentSellerCommission
          ? transaction.agentSellerCommission.split(".")[0]
          : null,
      lawyerName: transaction.lawyerName
        ? transaction.lawyerName.split(" ")[0]
        : "",
      lawyerCommission:
        transaction.lawyerCommission == "0" ||
        transaction.lawyerCommission == "" ||
        transaction.lawyerCommission == "0.00"
          ? null
          : transaction.lawyerCommission
          ? transaction.lawyerCommission.split(".")[0]
          : null,
      agentBuyerName: transaction.agentBuyerName
        ? transaction.agentBuyerName.split(" ")[0]
        : "",
      agentBuyerCommission:
        transaction.agentBuyerCommission == "0" ||
        transaction.agentBuyerCommission == "" ||
        transaction.agentBuyerCommission == "0.00"
          ? null
          : transaction.agentBuyerCommission
          ? transaction.agentBuyerCommission.split(".")[0]
          : null,
      lawyerCommission2:
        transaction.lawyerCommission2 == "0" ||
        transaction.lawyerCommission2 == "" ||
        transaction.lawyerCommission2 == "0.00"
          ? null
          : transaction.lawyerCommission2
          ? transaction.lawyerCommission2.split(".")[0]
          : null,
      adress: transaction.adress,
      dateStage: transaction.dateStage,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    }));

    // Добавление данных из transactions в таблицу для текущего набора
    transactionsNew.forEach((transaction) => {
      const row: Array<string | undefined> = [];
      columnFields.forEach((field) => {
        //@ts-ignore
        row.push(transaction[field] || "");
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
  const mergeWorksheet = workbook.addWorksheet("Склейка");

  // Добавляем скопированные данные из всех таблиц в столбцы на вкладке "Склейка"
  mergedRows.forEach((row, rowIndex) => {
    row.forEach((cellValue, cellIndex) => {
      mergeWorksheet.getCell(rowIndex + 1, cellIndex + 1).value = cellValue;
    });
  });

  // Создание файла Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Сохранение файла на стороне клиента
  saveAs(new Blob([buffer]), "transactions.xlsx");
}

export async function generateExcel2(applications: constructionApplications[]) {
  const workbook = new ExcelJS.Workbook();

  const managers = sharedCrmManagers;

  function findManager(id: string) {
    const manager = managers.find((manager) => manager.id === id);
    return manager ? manager.name : "";
  }

  const applicationsNew = applications.map((appl) => ({
    id: appl.id,
    idApplicationIntrum: appl.idApplicationIntrum,
    translator:  appl.translator || appl.sourceUtm || "Наш сайт",
    responsibleMain: appl.responsibleMain
      ? findManager(appl.responsibleMain)
      : "",
    status: appl.status ? appl.status : "",
    services: appl.services ? appl.services : "Строительство",
    postMeetingStage: appl.postMeetingStage ? appl.postMeetingStage : "",
    desc: appl.desc ? appl.desc : "",
    typeApplication: appl.typeApplication ?? "Заявка без типа",
    mailing: appl.mailing ? "Да" : "Нет",
    mailingCreatedAtCrm: appl?.mailingCreatedAtCrm ?? "",
    contactedClient: appl.contactedClient ? appl.contactedClient : "",
    sourceUtm: appl.sourceUtm ? appl.sourceUtm : "",
    campaignUtm: appl.campaignUtm ? appl.campaignUtm : "",
    termUtm: appl.termUtm ? appl.termUtm : "",
    prodinfo: appl.prodinfo ? appl.prodinfo : "",
    nextAction: appl.nextAction ? formatDate(appl.nextAction) : "",
    rejection: appl.rejection ? appl.rejection : "",
    errorReejctionDone: appl.errorReejctionDone == true ? "Да" : "Нет", // Ошибка исправлена?
    datecallCenter: appl.datecallCenter ? appl.datecallCenter : "", //Дата обработки заявки колл центром String? //Дата обработки заявки колл центром
    timecallCenter:
      appl.timecallCenter &&
      appl.timecallCenter !== "КЦ не проставил Статус =  на согласование"
        ? parseFloat(appl.timecallCenter).toLocaleString("ru-RU")
        : "КЦ не проставил Статус =  на согласование",
    okCallCenter: appl.timecallCenter
      ? appl.timecallCenter < "0.15"
        ? "✓"
        : "👎🏻"
      : "", // ОК КЦ
    timesaletCenter:
      appl.timesaletCenter &&
      appl.timesaletCenter !==
        "Специалист связался с клиентом_NEW не проставили ДА"
        ? parseFloat(appl.timesaletCenter).toLocaleString("ru-RU")
        : "Специалист связался с клиентом_NEW не проставили ДА", // время ОП
    okSaleCenter: appl.timesaletCenter
      ? appl.timesaletCenter < "0.15"
        ? "✓"
        : "👎🏻"
      : "", // ОК ОП
    dateFirstContact: appl.dateFirstContact ? appl.dateFirstContact : "",
    phone: appl.phone ? appl.phone : "",
    comment: appl.comment ? appl.comment : [],
    url: appl.url
      ? appl.url
      : `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${appl.idApplicationIntrum}#request`,
    createdAtCrm: appl.createdAtCrm
      ? formatDateTimeToDDMMYYYYHHMMSS(appl.createdAtCrm.replace(/-/g, "."))
      : "", // Дата в формате 2024-05-07 11:25:23 нужно убрать - на .
    createdAt: appl.createdAt ? formatDateTime(new Date(appl.createdAt)) : "",
  }));

  // Фильтрация данных по типу заявки
  let applicationsByType: Record<string, constructionApplicationsExcel[]> = {};
  applicationsNew.forEach((application) => {
    const typeApplication =
      application.typeApplication === "Заявка с VK"
        ? "Заявка"
        : application.typeApplication;
    const type = typeApplication || "Заявка без типа";
    if (
      application.services === "Бытовка" ||
      application.services === "Производство"
    ) {
      return;
    }
    if (!applicationsByType[type]) {
      applicationsByType[type] = [];
    }
    applicationsByType[type].push(application);
  });

  // Создание вкладок Excel для каждого типа заявки
  Object.entries(applicationsByType).forEach(([type, data]) => {
    if (type !== "Заявка без типа") {
      const worksheet = workbook.addWorksheet(type);

      // Добавление заголовков столбцов
      let columns = columnsSetsApplication[type === "Заявка" ? 0 : 1];

      // Удаление колонок "campaignUtm" и "termUtm" на вкладках "Кампания" и "Звонок"
      // if (type === "WhatsApp" || type === "Звонок") {
      // if (type === "WhatsApp") {
      //   columns = columns.filter(
      //     (col) =>
      //       col.field !== "campaignUtm" &&
      //       col.field !== "termUtm" &&
      //       col.field !== "sourceUtm"
      //   );
      // }

      // Удаление колонки рассылка и всех вкладок кроме вац апп и заявка
      if (type !== "Заявка" && type !== "WhatsApp") {
        columns = columns.filter((col) => col.field !== "mailing");
      }

      // if (type === "Звонок") {
      //   columns = columns.filter((col) => col.field !== "sourceUtm");
      // }

      const russianColumns = columns.map((col) => col.headerName);
      worksheet.addRow(russianColumns);

      // Добавление данных в таблицу
      data.forEach((application) => {
        const row: Array<string | undefined> = [];
        columns.forEach((col) => {
          const value =
            application[col.field as keyof constructionApplicationsExcel];
          row.push(value?.toString());
        });
        worksheet.addRow(row);
      });

      // Управление стилями для колонки "URL"
      const postUrlColumn = columns.find((col) => col.field === "url");

      if (postUrlColumn) {
        const postUrlColumnIndex =
          columns.findIndex((col) => col.field === "url") + 1;
        worksheet.getColumn(postUrlColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;
          if (cellValue) {
            cell.value = { text: cellValue, hyperlink: cellValue };
            cell.font = {
              underline: true,
              color: { argb: "FF0000FF" },
            };
          }
        });
      }

      // Управление стилями для колонки "ОК ОП"
      const okSaleCenterColumn = columns.find(
        (col) => col.field === "okSaleCenter"
      );

      if (okSaleCenterColumn) {
        const okSaleCenterColumnIndex =
          columns.findIndex((col) => col.field === "okSaleCenter") + 1;
        worksheet.getColumn(okSaleCenterColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "✓":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, //  зеленый
              };
              break;
            case "👎🏻":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            default:
              // оставить по умолчанию
              break;
          }
        });
      }

      // Управление стилями для колонки "ОК КЦ"
      const okCallCenterColumn = columns.find(
        (col) => col.field === "okCallCenter"
      );

      if (okCallCenterColumn) {
        const okCallCenterColumnIndex =
          columns.findIndex((col) => col.field === "okCallCenter") + 1;
        worksheet.getColumn(okCallCenterColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "✓":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, //  зеленый
              };
              break;
            case "👎🏻":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            default:
              // оставить по умолчанию
              break;
          }
        });
      }

      // Управление стилями для колонки "Стадия после встречи"
      const postMeetingStageColumn = columns.find(
        (col) => col.field === "postMeetingStage"
      );

      if (postMeetingStageColumn) {
        const postMeetingStageColumnIndex =
          columns.findIndex((col) => col.field === "postMeetingStage") + 1;
        worksheet.getColumn(postMeetingStageColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "Встреча не состоялась":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFFFFF" }, // белый
              };
              break;
            case "Думает":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFA500" }, // оранжевый
              };
              break;
            case "Отказался":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            case "Отправлен расчет":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFFF00" }, // желтый
              };
              break;
            case "Подготовка расчета":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF0000FF" }, // синий
              };
              break;
            case "Подписан договор":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, // срдне  зеленый
              };
            case "Подготовка проекта":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, // слабо  зеленый
              };
            case "Продажа":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, // ярко  зеленый
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

  // Фильтрация  по типу услуг
  let applicationsByService: Record<string, constructionApplicationsExcel[]> =
    {};
  applicationsNew.forEach((application) => {
    if (application.typeApplication === "WhatsApp") {
      return;
    }
    const service = application.services || "Услуга не указана";
    if (service === "Строительство") {
      return; // Пропускаем эту услугу
    }
    if (!applicationsByService[service]) {
      applicationsByService[service] = [];
    }
    applicationsByService[service].push(application);
  });

  // Создание вкладок Excel для каждого типа услуги
  Object.entries(applicationsByService).forEach(([service, data]) => {
    const worksheet = workbook.addWorksheet(service);

    // Добавление заголовков столбцов
    let columns = columnsSetsApplication[1];
    const russianColumns = columns.map((col) => col.headerName);
    worksheet.addRow(russianColumns);

    // Добавление данных в таблицу
    data.forEach((application) => {
      const row: Array<string | undefined> = [];
      columns.forEach((col) => {
        const value =
          application[col.field as keyof constructionApplicationsExcel];
        row.push(value?.toString());
      });
      worksheet.addRow(row);
    });
  });

  // Создание файла Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Сохранение файла на стороне клиента
  saveAs(new Blob([buffer]), "applications.xlsx");
}

export async function generateExcel3(transactions: Sales[]) {
  const workbook = new ExcelJS.Workbook();

  // Преобразование данных transactions
  const transactionsNew = transactions.map((transaction) => ({
    id: transaction.id,
    idSalesIntrum: transaction.idSalesIntrum,
    responsibleMain: transaction.responsibleMain,
    partCommissionSeller:
      (transaction.partCommissionSeller &&
        parseFloat(transaction.partCommissionSeller).toFixed(0)) ||
      null,
    sumCommissionBuyer:
      (transaction.sumCommissionBuyer &&
        parseFloat(transaction.sumCommissionBuyer).toFixed(0)) ||
      null,
    agentSellerName: transaction.agentSellerName
      ? transaction.agentSellerName.split(" ")[0]
      : "",
    agentSellerCommission:
      (transaction.agentSellerCommission &&
        parseFloat(transaction.agentSellerCommission).toFixed(0)) ||
      null,
    lawyerName: transaction.lawyerName
      ? transaction.lawyerName.split(" ")[0]
      : "",
    lawyerCommission:
      (transaction.lawyerCommission &&
        parseFloat(transaction.lawyerCommission).toFixed(0)) ||
      null,
    agentBuyerName: transaction.agentBuyerName
      ? transaction.agentBuyerName.split(" ")[0]
      : "",
    agentBuyerCommission:
      (transaction.agentBuyerCommission &&
        parseFloat(transaction.agentBuyerCommission).toFixed(0)) ||
      null,
    lawyerCommission2:
      (transaction.lawyerCommission2 &&
        parseFloat(transaction.lawyerCommission2).toFixed(0)) ||
      null,
    adress: transaction.adress,
    lawyerSalary: transaction.lawyerSalary ? transaction.lawyerSalary : "",
    lawyerSumm:
      (transaction.lawyerSumm &&
        parseFloat(transaction.lawyerSumm).toFixed(0)) ||
      null,
    lawyerSumm1:
      (transaction.lawyerSumm1 &&
        parseFloat(transaction.lawyerSumm1).toFixed(0)) ||
      null,
    lawyerSalaryDone: transaction.lawyerSalaryDone === "1" ? "Да" : "Нет",
    lawyerFormula: transaction.lawyerFormula || "",
    agentBuyerFormul: transaction.agentBuyerFormul || "",
    agentBuyerSalaryDone:
      transaction.agentBuyerSalaryDone === "1" ? "Да" : "Нет",
    agentSellerFormula: transaction.agentSellerFormula || "",
    agentSellerSalaryDone:
      transaction.agentSellerSalaryDone === "1" ? "Да" : "Нет",
    mortageFormula: transaction.mortageFormula
      ? transaction.mortageFormula
      : "",
    mortageSumm1: transaction.mortageSumm1 ? transaction.mortageSumm1 : "",
    mortageOtdel: transaction.mortageOtdel ? transaction.mortageOtdel : "",
    dateStage: transaction.dateStage,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
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

export async function generateExcel5(applications: constructionApplications[]) {
  const workbook = new ExcelJS.Workbook();

  const applicationsNew = applications.map((appl) => {
    return {
      id: appl.id,
      idApplicationIntrum: appl.idApplicationIntrum,
      translator:
        appl.translator === "Радио Сансара" ? "Радио" : appl.translator ?? "",
      responsibleMain: appl.responsibleMain,
      status: appl.status ? appl.status : "",
      services: "",
      postMeetingStage: appl.postMeetingStage ? appl.postMeetingStage : "",
      desc: appl.desc ? appl.desc : "",
      typeApplication: appl.typeApplication ? appl.typeApplication : "",
      mailing: appl?.mailing ? "Да" : "Нет",
      mailingCreatedAtCrm: appl?.mailingCreatedAtCrm ?? "",
      contactedClient: appl.contactedClient == "1" ? "Да" : "Нет",
      campaignUtm: appl.campaignUtm ? appl.campaignUtm : "",
      termUtm: appl.termUtm ? appl.termUtm : "",
      sourceUtm: appl.sourceUtm ? appl.sourceUtm : "",
      prodinfo: appl.prodinfo ? appl.prodinfo : "",
      nextAction: appl.nextAction ? formatDate(appl.nextAction) : "",
      rejection: appl.rejection ? appl.rejection : "",
      errorReejctionDone: appl.errorReejctionDone == true ? "Да" : "Нет", // Ошибка исправлена?
      datecallCenter: appl.datecallCenter ? appl.datecallCenter : "", //Дата обработки заявки колл центром String? //Дата обработки заявки колл центром
      timecallCenter: appl.timecallCenter
        ? parseFloat(appl.timecallCenter).toLocaleString("ru-RU")
        : "",
      okCallCenter: appl.timecallCenter
        ? appl.timecallCenter < "0.15"
          ? "✓"
          : "👎🏻"
        : "", // ОК КЦ
      timesaletCenter: appl.timesaletCenter
        ? parseFloat(appl.timesaletCenter).toLocaleString("ru-RU")
        : "", // время ОП
      okSaleCenter: appl.timesaletCenter
        ? appl.timesaletCenter < "0.15"
          ? "✓"
          : "👎🏻"
        : "", // ОК ОП
      dateFirstContact: appl.dateFirstContact ? appl.dateFirstContact : "",
      phone: appl.phone ? appl.phone : "",
      comment: appl.comment ? appl.comment : [],
      url: `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${appl.idApplicationIntrum}#request`,
      createdAtCrm: appl.createdAtCrm
        ? appl.createdAtCrm.replace(/-/g, ".")
        : "", // Дата в формате 2024-05-07 11:25:23 нужно убрать - на .
      createdAt: appl.createdAt ? formatDateTime(new Date(appl.createdAt)) : "",
    };
  });

  // Фильтрация данных по типу заявки
  let applicationsByType: Record<string, constructionApplicationsExcel[]> = {};
  applicationsNew.forEach((application) => {
    const type = application.typeApplication || "Заявка без типа";
    if (!applicationsByType[type]) {
      applicationsByType[type] = [];
    }
    applicationsByType[type].push(application);
  });

  //вкладка все заявки
  const allApplicationsSheet = workbook.addWorksheet("Все заявки");
  // Добавление заголовков столбцов для всех заявок
  const allColumns = columnsSetsApplicationSansara[0];
  const allRussianColumns = allColumns.map((col) => col.headerName);
  allApplicationsSheet.addRow(allRussianColumns);
  let columns = columnsSetsApplicationSansara[0];

  // Добавление всех данных в таблицу "Все заявки"
  applicationsNew.forEach((application) => {
    const row: Array<string | undefined> = [];
    allColumns.forEach((col) => {
      const value =
        application[col.field as keyof constructionApplicationsExcel];
      row.push(value?.toString());
    });

    allApplicationsSheet.addRow(row);
    const postUrlColumn = columns.find((col) => col.field === "url");

    if (postUrlColumn) {
      const postUrlColumnIndex =
        columns.findIndex((col) => col.field === "url") + 1;
      allApplicationsSheet.getColumn(postUrlColumnIndex).eachCell((cell) => {
        const cellValue = cell.text;
        if (cellValue) {
          cell.value = { text: cellValue, hyperlink: cellValue };
          cell.font = {
            underline: true,
            color: { argb: "FF0000FF" },
          };
        }
      });
    }

    // Управление стилями для колонки "ОК ОП"
    const okSaleCenterColumn = columns.find(
      (col) => col.field === "okSaleCenter"
    );

    if (okSaleCenterColumn) {
      const okSaleCenterColumnIndex =
        columns.findIndex((col) => col.field === "okSaleCenter") + 1;
      allApplicationsSheet
        .getColumn(okSaleCenterColumnIndex)
        .eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "✓":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, //  зеленый
              };
              break;
            case "👎🏻":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            default:
              // оставить по умолчанию
              break;
          }
        });
    }

    // Управление стилями для колонки "ОК КЦ"
    const okCallCenterColumn = columns.find(
      (col) => col.field === "okCallCenter"
    );

    if (okCallCenterColumn) {
      const okCallCenterColumnIndex =
        columns.findIndex((col) => col.field === "okCallCenter") + 1;
      allApplicationsSheet
        .getColumn(okCallCenterColumnIndex)
        .eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "✓":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, //  зеленый
              };
              break;
            case "👎🏻":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            default:
              // оставить по умолчанию
              break;
          }
        });
    }
  });

  // Создание вкладок Excel для каждого типа заявки
  Object.entries(applicationsByType).forEach(([type, data]) => {
    if (type !== "Заявка без типа" && type !== "Заявка с рассылки WhatsApp") {
      const worksheet = workbook.addWorksheet(type);

      // Добавление заголовков столбцов
      let columns = columnsSetsApplicationSansara[type === "Заявка" ? 0 : 1];

      // Удаление колонок "campaignUtm" и "termUtm" на вкладках "Кампания" и "Звонок"
      if (type === "Показ объекта по Сансаре") {
        columns = columns.filter(
          (col) =>
            col.field !== "campaignUtm" &&
            col.field !== "termUtm" &&
            col.field !== "rejection" &&
            col.field !== "errorReejctionDone"
        );
      }

      const russianColumns = columns.map((col) => col.headerName);
      worksheet.addRow(russianColumns);

      // Добавление данных в таблицу
      data.forEach((application) => {
        const row: Array<string | undefined> = [];
        columns.forEach((col) => {
          const value =
            application[col.field as keyof constructionApplicationsExcel];
          row.push(value?.toString());
        });
        worksheet.addRow(row);
      });

      // Управление стилями для колонки "URL"
      const postUrlColumn = columns.find((col) => col.field === "url");

      if (postUrlColumn) {
        const postUrlColumnIndex =
          columns.findIndex((col) => col.field === "url") + 1;
        worksheet.getColumn(postUrlColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;
          if (cellValue) {
            cell.value = { text: cellValue, hyperlink: cellValue };
            cell.font = {
              underline: true,
              color: { argb: "FF0000FF" },
            };
          }
        });
      }

      // Управление стилями для колонки "ОК ОП"
      const okSaleCenterColumn = columns.find(
        (col) => col.field === "okSaleCenter"
      );

      if (okSaleCenterColumn) {
        const okSaleCenterColumnIndex =
          columns.findIndex((col) => col.field === "okSaleCenter") + 1;
        worksheet.getColumn(okSaleCenterColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "✓":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, //  зеленый
              };
              break;
            case "👎🏻":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            default:
              // оставить по умолчанию
              break;
          }
        });
      }

      // Управление стилями для колонки "ОК КЦ"
      const okCallCenterColumn = columns.find(
        (col) => col.field === "okCallCenter"
      );

      if (okCallCenterColumn) {
        const okCallCenterColumnIndex =
          columns.findIndex((col) => col.field === "okCallCenter") + 1;
        worksheet.getColumn(okCallCenterColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "✓":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, //  зеленый
              };
              break;
            case "👎🏻":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            default:
              // оставить по умолчанию
              break;
          }
        });
      }

      // Управление стилями для колонки "Стадия после встречи"
      const postMeetingStageColumn = columns.find(
        (col) => col.field === "postMeetingStage"
      );

      if (postMeetingStageColumn) {
        const postMeetingStageColumnIndex =
          columns.findIndex((col) => col.field === "postMeetingStage") + 1;
        worksheet.getColumn(postMeetingStageColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "Встреча не состоялась":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFFFFF" }, // белый
              };
              break;
            case "Думает":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFA500" }, // оранжевый
              };
              break;
            case "Отказался":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            case "Отправлен расчет":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFFF00" }, // желтый
              };
              break;
            case "Подготовка расчета":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF0000FF" }, // синий
              };
              break;
            case "Подписан договор":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, // срдне  зеленый
              };
            case "Подготовка проекта":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, // слабо  зеленый
              };
            case "Продажа":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, // ярко  зеленый
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

  // Создание файла Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Сохранение файла на стороне клиента
  saveAs(new Blob([buffer]), "application.xlsx");
}

export async function generateExcel6(applications: constructionApplications[]) {
  const workbook = new ExcelJS.Workbook();
  const applicationsNew = applications.map((appl) => ({
    id: appl.id,
    idApplicationIntrum: appl.idApplicationIntrum,
    translator:
      appl.campaignUtm || appl.termUtm || appl.sourceUtm || appl.prodinfo
        ? "лендинг"
        : "наш сайт",
    responsibleMain: appl.responsibleMain,
    status: appl.status ? appl.status : "",
    services: "",
    postMeetingStage: appl.postMeetingStage ? appl.postMeetingStage : "",
    desc: appl.desc ? appl.desc : "",
    typeApplication: appl.typeApplication ? appl.typeApplication : "",
    contactedClient: appl.contactedClient == "1" ? "Да" : "Нет",
    campaignUtm: appl.campaignUtm ? appl.campaignUtm : "",
    termUtm: appl.termUtm ? appl.termUtm : "",
    prodinfo: appl.prodinfo ? appl.prodinfo : "",
    nextAction: appl.nextAction ? formatDate(appl.nextAction) : "",
    rejection: appl.rejection ? appl.rejection : "",
    errorReejctionDone: appl.errorReejctionDone == true ? "Да" : "Нет", // Ошибка исправлена?
    datecallCenter: appl.datecallCenter ? appl.datecallCenter : "", //Дата обработки заявки колл центром String? //Дата обработки заявки колл центром
    timecallCenter: appl.timecallCenter ? appl.timecallCenter : "", // Сколько заявка была в обработке у рекламы
    okCallCenter: appl.timecallCenter
      ? appl.timecallCenter < "0.15"
        ? "✓"
        : "👎🏻"
      : "", // ОК КЦ
    timesaletCenter: appl.timesaletCenter ? appl.timesaletCenter : "", //Время + дата размещения в реклам
    okSaleCenter: appl.timesaletCenter
      ? appl.timesaletCenter < "0.15"
        ? "✓"
        : "👎🏻"
      : "", // ОК ОП
    dateFirstContact: appl.dateFirstContact ? appl.dateFirstContact : "",
    phone: appl.phone ? appl.phone : "",
    comment: appl.comment ? appl.comment : [],
    url: `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${appl.idApplicationIntrum}#request`,
    createdAtCrm: appl.createdAtCrm ? appl.createdAtCrm.replace(/-/g, ".") : "", // Дата в формате 2024-05-07 11:25:23 нужно убрать - на .
    createdAt: appl.createdAt ? formatDateTime(new Date(appl.createdAt)) : "",
  }));
  // Фильтрация данных по типу заявки
  let applicationsByType: Record<string, constructionApplicationsExcel[]> = {};
  applicationsNew.forEach((application) => {
    const type = application.typeApplication || "Заявка без типа";
    if (!applicationsByType[type]) {
      applicationsByType[type] = [];
    }
    applicationsByType[type].push(application);
  });

  // Создание вкладок Excel для каждого типа заявки
  Object.entries(applicationsByType).forEach(([type, data]) => {
    if (type !== "Заявка без типа") {
      const worksheet = workbook.addWorksheet(type);
      // Добавление заголовков столбцов
      let columns = columnsSetsApplicationRansom[0];
      // Удаление колонок на вкладкe Прием объекта Срочный Выкуп
      if (type === "Прием объекта Срочный Выкуп") {
        columns = columns.filter(
          (col) =>
            // col.field !== "campaignUtm" &&
            // col.field !== "termUtm" &&
            col.field !== "rejection" &&
            col.field !== "postMeetingStage" &&
            col.field !== "desc" &&
            col.field !== "contactedClient" &&
            col.field !== "contactedClient" &&
            col.field !== "errorReejctionDone"
        );
      }

      const russianColumns = columns.map((col) => col.headerName);
      worksheet.addRow(russianColumns);
      // Добавление данных в таблицу
      data.forEach((application) => {
        const row: Array<string | undefined> = [];
        columns.forEach((col) => {
          const value =
            application[col.field as keyof constructionApplicationsExcel];
          row.push(value?.toString());
        });
        worksheet.addRow(row);
      });

      // Управление стилями для колонки "URL"
      const postUrlColumn = columns.find((col) => col.field === "url");
      if (postUrlColumn) {
        const postUrlColumnIndex =
          columns.findIndex((col) => col.field === "url") + 1;
        worksheet.getColumn(postUrlColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;
          if (cellValue) {
            cell.value = { text: cellValue, hyperlink: cellValue };
            cell.font = {
              underline: true,
              color: { argb: "FF0000FF" },
            };
          }
        });
      }
    }
  });

  // Создание файла Excel
  const buffer = await workbook.xlsx.writeBuffer();
  // Сохранение файла на стороне клиента
  saveAs(new Blob([buffer]), "ransom.xlsx");
}

export async function generateExcelNovodvinskaya(
  applications: constructionApplications[]
) {
  const workbook = new ExcelJS.Workbook();

  function getTranslatorNovodvinskaya(
    sourceUtm?: string | null,
    campaignUtm?: string | null,
    termUtm?: string | null,
    translator?: string | null
  ): string {
    if (campaignUtm == "(none)" || termUtm == "(none)") {
      return "Сайт «Дом на Новодвинской»";
    }
    if (
      translator &&
      translator !== "WhatsApp" &&
      translator !== "Avito" &&
      translator !== "Дом Клик" &&
      translator !== "yandex" &&
      translator !== "Циан" &&
      translator !== "VK" &&
      // translator !== "забор Сансары" &&
      // translator !== "Telegram Сансара" &&
      translator !== "Мир квартир" &&
      translator !== "М2 ВТБ" &&
      translator !== "jivem-doma.ru" &&
      translator !== "Сайт «Дом на Новодвинской»"
    ) {
      if (sourceUtm == "TG" || sourceUtm == "vk") {
        return "Сайт «Дом на Новодвинской»";
      } else {
        return (sourceUtm && sourceUtm !== "нету") ||
          (campaignUtm && campaignUtm !== "нету") ||
          (termUtm && termUtm !== "нету")
          ? "Лендинг дом на Новодвинской"
          : "Сайт «Дом на Новодвинской»";
      }
    }
    return translator ? translator : "";
  }

  const applicationsNew = applications.map((appl) => {
    const hasUtm =
      appl.campaignUtm || appl.termUtm || appl.sourceUtm || appl.prodinfo
        ? true
        : false;
    return {
      id: appl.id,
      idApplicationIntrum: appl.idApplicationIntrum,
      translator: getTranslatorNovodvinskaya(
        appl.sourceUtm,
        appl.campaignUtm,
        appl.termUtm,
        appl.translator
      ),
      responsibleMain: appl.responsibleMain,
      status: appl.status ? appl.status : "",
      services: "",
      postMeetingStage: appl.postMeetingStage ? appl.postMeetingStage : "",
      desc: appl.desc ? appl.desc : "",
      typeApplication: appl.typeApplication ? appl.typeApplication : "",
      contactedClient: appl.contactedClient == "1" ? "Да" : "Нет",
      campaignUtm: appl.campaignUtm ? appl.campaignUtm : "",
      termUtm: appl.termUtm ? appl.termUtm : "",
      sourceUtm: appl.sourceUtm ? appl.sourceUtm : "",
      prodinfo: appl.prodinfo ? appl.prodinfo : "",
      nextAction: appl.nextAction ? formatDate(appl.nextAction) : "",
      rejection: appl.rejection ? appl.rejection : "",
      errorReejctionDone: appl.errorReejctionDone == true ? "Да" : "Нет", // Ошибка исправлена?
      datecallCenter: appl.datecallCenter ? appl.datecallCenter : "", //Дата обработки заявки колл центром String? //Дата обработки заявки колл центром
      timecallCenter: appl.timecallCenter
        ? parseFloat(appl.timecallCenter).toLocaleString("ru-RU")
        : "",
      okCallCenter: appl.timecallCenter
        ? appl.timecallCenter < "0.15"
          ? "✓"
          : "👎🏻"
        : "", // ОК КЦ
      timesaletCenter: appl.timesaletCenter
        ? parseFloat(appl.timesaletCenter).toLocaleString("ru-RU")
        : "", // время ОП
      okSaleCenter: appl.timesaletCenter
        ? appl.timesaletCenter < "0.15"
          ? "✓"
          : "👎🏻"
        : "", // ОК ОП
      dateFirstContact: appl.dateFirstContact ? appl.dateFirstContact : "",
      phone: appl.phone ? appl.phone : "",
      comment: appl.comment ? appl.comment : [],
      url: `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${appl.idApplicationIntrum}#request`,
      createdAtCrm: appl.createdAtCrm
        ? appl.createdAtCrm.replace(/-/g, ".")
        : "", // Дата в формате 2024-05-07 11:25:23 нужно убрать - на .
      createdAt: appl.createdAt ? formatDateTime(new Date(appl.createdAt)) : "",
    };
  });

  // Фильтрация данных по типу заявки
  let applicationsByType: Record<string, constructionApplicationsExcel[]> = {};
  applicationsNew.forEach((application) => {
    const type = application.typeApplication || "Заявка без типа";
    if (!applicationsByType[type]) {
      applicationsByType[type] = [];
    }
    applicationsByType[type].push(application);
  });

  //вкладка все заявки
  const allApplicationsSheet = workbook.addWorksheet("Все заявки");
  // Добавление заголовков столбцов для всех заявок
  const allColumns = columnsSetsApplicationNovodvinskaya[0];
  const allRussianColumns = allColumns.map((col) => col.headerName);
  allApplicationsSheet.addRow(allRussianColumns);
  let columns = columnsSetsApplicationNovodvinskaya[0];

  // Добавление всех данных в таблицу "Все заявки"
  applicationsNew.forEach((application) => {
    const row: Array<string | undefined> = [];
    allColumns.forEach((col) => {
      const value =
        application[col.field as keyof constructionApplicationsExcel];
      row.push(value?.toString());
    });

    allApplicationsSheet.addRow(row);
    const postUrlColumn = columns.find((col) => col.field === "url");

    if (postUrlColumn) {
      const postUrlColumnIndex =
        columns.findIndex((col) => col.field === "url") + 1;
      allApplicationsSheet.getColumn(postUrlColumnIndex).eachCell((cell) => {
        const cellValue = cell.text;
        if (cellValue) {
          cell.value = { text: cellValue, hyperlink: cellValue };
          cell.font = {
            underline: true,
            color: { argb: "FF0000FF" },
          };
        }
      });
    }

    // Управление стилями для колонки "ОК ОП"
    const okSaleCenterColumn = columns.find(
      (col) => col.field === "okSaleCenter"
    );

    if (okSaleCenterColumn) {
      const okSaleCenterColumnIndex =
        columns.findIndex((col) => col.field === "okSaleCenter") + 1;
      allApplicationsSheet
        .getColumn(okSaleCenterColumnIndex)
        .eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "✓":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, //  зеленый
              };
              break;
            case "👎🏻":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            default:
              // оставить по умолчанию
              break;
          }
        });
    }

    // Управление стилями для колонки "ОК КЦ"
    const okCallCenterColumn = columns.find(
      (col) => col.field === "okCallCenter"
    );

    if (okCallCenterColumn) {
      const okCallCenterColumnIndex =
        columns.findIndex((col) => col.field === "okCallCenter") + 1;
      allApplicationsSheet
        .getColumn(okCallCenterColumnIndex)
        .eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "✓":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, //  зеленый
              };
              break;
            case "👎🏻":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            default:
              // оставить по умолчанию
              break;
          }
        });
    }
  });

  // Создание вкладок Excel для каждого типа заявки
  Object.entries(applicationsByType).forEach(([type, data]) => {
    if (type !== "Заявка без типа") {
      const worksheet = workbook.addWorksheet(type);

      // Добавление заголовков столбцов
      let columns =
        columnsSetsApplicationNovodvinskaya[type === "Заявка" ? 0 : 1];

      // Удаление колонок "campaignUtm" и "termUtm" на вкладках "Кампания" и "Звонок"
      if (type === "Показ объекта по Новодвинской") {
        columns = columns.filter(
          (col) =>
            col.field !== "campaignUtm" &&
            col.field !== "termUtm" &&
            col.field !== "rejection" &&
            col.field !== "errorReejctionDone"
        );
      }

      const russianColumns = columns.map((col) => col.headerName);
      worksheet.addRow(russianColumns);

      // Добавление данных в таблицу
      data.forEach((application) => {
        const row: Array<string | undefined> = [];
        columns.forEach((col) => {
          const value =
            application[col.field as keyof constructionApplicationsExcel];
          row.push(value?.toString());
        });
        worksheet.addRow(row);
      });

      // Управление стилями для колонки "URL"
      const postUrlColumn = columns.find((col) => col.field === "url");

      if (postUrlColumn) {
        const postUrlColumnIndex =
          columns.findIndex((col) => col.field === "url") + 1;
        worksheet.getColumn(postUrlColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;
          if (cellValue) {
            cell.value = { text: cellValue, hyperlink: cellValue };
            cell.font = {
              underline: true,
              color: { argb: "FF0000FF" },
            };
          }
        });
      }

      // Управление стилями для колонки "ОК ОП"
      const okSaleCenterColumn = columns.find(
        (col) => col.field === "okSaleCenter"
      );

      if (okSaleCenterColumn) {
        const okSaleCenterColumnIndex =
          columns.findIndex((col) => col.field === "okSaleCenter") + 1;
        worksheet.getColumn(okSaleCenterColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "✓":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, //  зеленый
              };
              break;
            case "👎🏻":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            default:
              // оставить по умолчанию
              break;
          }
        });
      }

      // Управление стилями для колонки "ОК КЦ"
      const okCallCenterColumn = columns.find(
        (col) => col.field === "okCallCenter"
      );

      if (okCallCenterColumn) {
        const okCallCenterColumnIndex =
          columns.findIndex((col) => col.field === "okCallCenter") + 1;
        worksheet.getColumn(okCallCenterColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "✓":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, //  зеленый
              };
              break;
            case "👎🏻":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            default:
              // оставить по умолчанию
              break;
          }
        });
      }

      // Управление стилями для колонки "Стадия после встречи"
      const postMeetingStageColumn = columns.find(
        (col) => col.field === "postMeetingStage"
      );

      if (postMeetingStageColumn) {
        const postMeetingStageColumnIndex =
          columns.findIndex((col) => col.field === "postMeetingStage") + 1;
        worksheet.getColumn(postMeetingStageColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "Встреча не состоялась":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFFFFF" }, // белый
              };
              break;
            case "Думает":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFA500" }, // оранжевый
              };
              break;
            case "Отказался":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            case "Отправлен расчет":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFFF00" }, // желтый
              };
              break;
            case "Подготовка расчета":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF0000FF" }, // синий
              };
              break;
            case "Подписан договор":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, // срдне  зеленый
              };
            case "Подготовка проекта":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, // слабо  зеленый
              };
            case "Продажа":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, // ярко  зеленый
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

  // Создание файла Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Сохранение файла на стороне клиента
  saveAs(new Blob([buffer]), "novodvinskaya.xlsx");
}

export async function generateExcelVictory(
  applications: constructionApplications[]
) {
  const workbook = new ExcelJS.Workbook();

  function getTranslatorVictory(
    sourceUtm?: string | null,
    campaignUtm?: string | null,
    termUtm?: string | null,
    translator?: string | null
  ): string {
    if (campaignUtm == "(none)" || termUtm == "(none)") {
      return "Сайт ЖК «Победа парк»";
    }
    if (
      translator &&
      translator !== "WhatsApp" &&
      translator !== "Avito" &&
      translator !== "Дом Клик" &&
      translator !== "yandex" &&
      translator !== "Циан" &&
      translator !== "VK" &&
      translator !== "Мир квартир" &&
      translator !== "М2 ВТБ" &&
      translator !== "jivem-doma.ru" &&
      translator !== "Сайт ЖК «Победа парк»"
    ) {
      if (sourceUtm == "TG" || sourceUtm == "vk") {
        return "Сайт ЖК «Победа парк»";
      } else {
        return (sourceUtm && sourceUtm !== "нету") ||
          (campaignUtm && campaignUtm !== "нету") ||
          (termUtm && termUtm !== "нету")
          ? "Лендинг ЖК «Победа парк»"
          : "Сайт ЖК «Победа парк»";
      }
    }
    return translator ? translator : "";
  }

  const applicationsNew = applications.map((appl) => {
    const hasUtm =
      appl.campaignUtm || appl.termUtm || appl.sourceUtm || appl.prodinfo
        ? true
        : false;
    return {
      id: appl.id,
      idApplicationIntrum: appl.idApplicationIntrum,
      translator: getTranslatorVictory(
        appl.sourceUtm,
        appl.campaignUtm,
        appl.termUtm,
        appl.translator
      ),
      responsibleMain: appl.responsibleMain,
      status: appl.status ? appl.status : "",
      services: "",
      postMeetingStage: appl.postMeetingStage ? appl.postMeetingStage : "",
      desc: appl.desc ? appl.desc : "",
      typeApplication: appl.typeApplication ? appl.typeApplication : "",
      contactedClient: appl.contactedClient == "1" ? "Да" : "Нет",
      campaignUtm: appl.campaignUtm ? appl.campaignUtm : "",
      termUtm: appl.termUtm ? appl.termUtm : "",
      sourceUtm: appl.sourceUtm ? appl.sourceUtm : "",
      prodinfo: appl.prodinfo ? appl.prodinfo : "",
      nextAction: appl.nextAction ? formatDate(appl.nextAction) : "",
      rejection: appl.rejection ? appl.rejection : "",
      errorReejctionDone: appl.errorReejctionDone == true ? "Да" : "Нет", // Ошибка исправлена?
      datecallCenter: appl.datecallCenter ? appl.datecallCenter : "", //Дата обработки заявки колл центром String? //Дата обработки заявки колл центром
      timecallCenter: appl.timecallCenter
        ? parseFloat(appl.timecallCenter).toLocaleString("ru-RU")
        : "",
      okCallCenter: appl.timecallCenter
        ? appl.timecallCenter < "0.15"
          ? "✓"
          : "👎🏻"
        : "", // ОК КЦ
      timesaletCenter: appl.timesaletCenter
        ? parseFloat(appl.timesaletCenter).toLocaleString("ru-RU")
        : "", // время ОП
      okSaleCenter: appl.timesaletCenter
        ? appl.timesaletCenter < "0.15"
          ? "✓"
          : "👎🏻"
        : "", // ОК ОП
      dateFirstContact: appl.dateFirstContact ? appl.dateFirstContact : "",
      phone: appl.phone ? appl.phone : "",
      comment: appl.comment ? appl.comment : [],
      url: `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${appl.idApplicationIntrum}#request`,
      createdAtCrm: appl.createdAtCrm
        ? appl.createdAtCrm.replace(/-/g, ".")
        : "", // Дата в формате 2024-05-07 11:25:23 нужно убрать - на .
      createdAt: appl.createdAt ? formatDateTime(new Date(appl.createdAt)) : "",
    };
  });

  // Фильтрация данных по типу заявки
  let applicationsByType: Record<string, constructionApplicationsExcel[]> = {};
  applicationsNew.forEach((application) => {
    const type = application.typeApplication || "Заявка без типа";
    if (!applicationsByType[type]) {
      applicationsByType[type] = [];
    }
    applicationsByType[type].push(application);
  });

  //вкладка все заявки
  const allApplicationsSheet = workbook.addWorksheet("Все заявки");
  // Добавление заголовков столбцов для всех заявок
  const allColumns = columnsSetsApplicationNovodvinskaya[0];
  const allRussianColumns = allColumns.map((col) => col.headerName);
  allApplicationsSheet.addRow(allRussianColumns);
  let columns = columnsSetsApplicationNovodvinskaya[0];

  // Добавление всех данных в таблицу "Все заявки"
  applicationsNew.forEach((application) => {
    const row: Array<string | undefined> = [];
    allColumns.forEach((col) => {
      const value =
        application[col.field as keyof constructionApplicationsExcel];
      row.push(value?.toString());
    });

    allApplicationsSheet.addRow(row);
    const postUrlColumn = columns.find((col) => col.field === "url");

    if (postUrlColumn) {
      const postUrlColumnIndex =
        columns.findIndex((col) => col.field === "url") + 1;
      allApplicationsSheet.getColumn(postUrlColumnIndex).eachCell((cell) => {
        const cellValue = cell.text;
        if (cellValue) {
          cell.value = { text: cellValue, hyperlink: cellValue };
          cell.font = {
            underline: true,
            color: { argb: "FF0000FF" },
          };
        }
      });
    }

    // Управление стилями для колонки "ОК ОП"
    const okSaleCenterColumn = columns.find(
      (col) => col.field === "okSaleCenter"
    );

    if (okSaleCenterColumn) {
      const okSaleCenterColumnIndex =
        columns.findIndex((col) => col.field === "okSaleCenter") + 1;
      allApplicationsSheet
        .getColumn(okSaleCenterColumnIndex)
        .eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "✓":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, //  зеленый
              };
              break;
            case "👎🏻":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            default:
              // оставить по умолчанию
              break;
          }
        });
    }

    // Управление стилями для колонки "ОК КЦ"
    const okCallCenterColumn = columns.find(
      (col) => col.field === "okCallCenter"
    );

    if (okCallCenterColumn) {
      const okCallCenterColumnIndex =
        columns.findIndex((col) => col.field === "okCallCenter") + 1;
      allApplicationsSheet
        .getColumn(okCallCenterColumnIndex)
        .eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "✓":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, //  зеленый
              };
              break;
            case "👎🏻":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            default:
              // оставить по умолчанию
              break;
          }
        });
    }
  });

  // Создание вкладок Excel для каждого типа заявки
  Object.entries(applicationsByType).forEach(([type, data]) => {
    if (type !== "Заявка без типа") {
      const worksheet = workbook.addWorksheet(type);

      // Добавление заголовков столбцов
      let columns =
        columnsSetsApplicationNovodvinskaya[type === "Заявка" ? 0 : 1];

      // Удаление колонок "campaignUtm" и "termUtm" на вкладках "Кампания" и "Звонок"
      if (type === "Показ объекта по Победе") {
        columns = columns.filter(
          (col) =>
            col.field !== "campaignUtm" &&
            col.field !== "termUtm" &&
            col.field !== "rejection" &&
            col.field !== "errorReejctionDone"
        );
      }

      const russianColumns = columns.map((col) => col.headerName);
      worksheet.addRow(russianColumns);

      // Добавление данных в таблицу
      data.forEach((application) => {
        const row: Array<string | undefined> = [];
        columns.forEach((col) => {
          const value =
            application[col.field as keyof constructionApplicationsExcel];
          row.push(value?.toString());
        });
        worksheet.addRow(row);
      });

      // Управление стилями для колонки "URL"
      const postUrlColumn = columns.find((col) => col.field === "url");

      if (postUrlColumn) {
        const postUrlColumnIndex =
          columns.findIndex((col) => col.field === "url") + 1;
        worksheet.getColumn(postUrlColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;
          if (cellValue) {
            cell.value = { text: cellValue, hyperlink: cellValue };
            cell.font = {
              underline: true,
              color: { argb: "FF0000FF" },
            };
          }
        });
      }

      // Управление стилями для колонки "ОК ОП"
      const okSaleCenterColumn = columns.find(
        (col) => col.field === "okSaleCenter"
      );

      if (okSaleCenterColumn) {
        const okSaleCenterColumnIndex =
          columns.findIndex((col) => col.field === "okSaleCenter") + 1;
        worksheet.getColumn(okSaleCenterColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "✓":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, //  зеленый
              };
              break;
            case "👎🏻":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            default:
              // оставить по умолчанию
              break;
          }
        });
      }

      // Управление стилями для колонки "ОК КЦ"
      const okCallCenterColumn = columns.find(
        (col) => col.field === "okCallCenter"
      );

      if (okCallCenterColumn) {
        const okCallCenterColumnIndex =
          columns.findIndex((col) => col.field === "okCallCenter") + 1;
        worksheet.getColumn(okCallCenterColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "✓":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, //  зеленый
              };
              break;
            case "👎🏻":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            default:
              // оставить по умолчанию
              break;
          }
        });
      }

      // Управление стилями для колонки "Стадия после встречи"
      const postMeetingStageColumn = columns.find(
        (col) => col.field === "postMeetingStage"
      );

      if (postMeetingStageColumn) {
        const postMeetingStageColumnIndex =
          columns.findIndex((col) => col.field === "postMeetingStage") + 1;
        worksheet.getColumn(postMeetingStageColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "Встреча не состоялась":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFFFFF" }, // белый
              };
              break;
            case "Думает":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFA500" }, // оранжевый
              };
              break;
            case "Отказался":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            case "Отправлен расчет":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFFF00" }, // желтый
              };
              break;
            case "Подготовка расчета":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF0000FF" }, // синий
              };
              break;
            case "Подписан договор":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, // срдне  зеленый
              };
            case "Подготовка проекта":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, // слабо  зеленый
              };
            case "Продажа":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, // ярко  зеленый
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

  // Создание файла Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Сохранение файла на стороне клиента
  saveAs(new Blob([buffer]), "жк_парк_победы.xlsx");
}

export async function generateExcelFivePeaks(
  applications: constructionApplications[]
) {
  const workbook = new ExcelJS.Workbook();

  function getTranslatorFivePeaks(
    sourceUtm?: string | null,
    campaignUtm?: string | null,
    termUtm?: string | null,
    translator?: string | null
  ): string {
    if (campaignUtm == "(none)" || termUtm == "(none)") {
      return "Сайт ЖК «5 вершин»";
    }
    if (
      translator &&
      translator !== "WhatsApp" &&
      translator !== "Avito" &&
      translator !== "Дом Клик" &&
      translator !== "yandex" &&
      translator !== "Циан" &&
      translator !== "VK" &&
      // translator !== "забор Сансары" &&
      // translator !== "Telegram Сансара" &&
      translator !== "Мир квартир" &&
      translator !== "М2 ВТБ" &&
      translator !== "jivem-doma.ru" &&
      translator !== "Сайт ЖК «5 вершин»"
    ) {
      if (sourceUtm == "TG" || sourceUtm == "vk") {
        return "Сайт ЖК «5 вершин»";
      } else {
        return (sourceUtm && sourceUtm !== "нету") ||
          (campaignUtm && campaignUtm !== "нету") ||
          (termUtm && termUtm !== "нету")
          ? "Лендинг ЖК «5 вершин»"
          : "Сайт ЖК «5 вершин»";
      }
    }
    return translator ? translator : "";
  }

  const applicationsNew = applications.map((appl) => {
    const hasUtm =
      appl.campaignUtm || appl.termUtm || appl.sourceUtm || appl.prodinfo
        ? true
        : false;
    return {
      id: appl.id,
      idApplicationIntrum: appl.idApplicationIntrum,
      translator: getTranslatorFivePeaks(
        appl.sourceUtm,
        appl.campaignUtm,
        appl.termUtm,
        appl.translator
      ),
      responsibleMain: appl.responsibleMain,
      status: appl.status ? appl.status : "",
      services: "",
      postMeetingStage: appl.postMeetingStage ? appl.postMeetingStage : "",
      desc: appl.desc ? appl.desc : "",
      typeApplication: appl.typeApplication ? appl.typeApplication : "",
      contactedClient: appl.contactedClient == "1" ? "Да" : "Нет",
      campaignUtm: appl.campaignUtm ? appl.campaignUtm : "",
      termUtm: appl.termUtm ? appl.termUtm : "",
      sourceUtm: appl.sourceUtm ? appl.sourceUtm : "",
      prodinfo: appl.prodinfo ? appl.prodinfo : "",
      nextAction: appl.nextAction ? formatDate(appl.nextAction) : "",
      rejection: appl.rejection ? appl.rejection : "",
      errorReejctionDone: appl.errorReejctionDone == true ? "Да" : "Нет", // Ошибка исправлена?
      datecallCenter: appl.datecallCenter ? appl.datecallCenter : "", //Дата обработки заявки колл центром String? //Дата обработки заявки колл центром
      timecallCenter: appl.timecallCenter
        ? parseFloat(appl.timecallCenter).toLocaleString("ru-RU")
        : "",
      okCallCenter: appl.timecallCenter
        ? appl.timecallCenter < "0.15"
          ? "✓"
          : "👎🏻"
        : "", // ОК КЦ
      timesaletCenter: appl.timesaletCenter
        ? parseFloat(appl.timesaletCenter).toLocaleString("ru-RU")
        : "", // время ОП
      okSaleCenter: appl.timesaletCenter
        ? appl.timesaletCenter < "0.15"
          ? "✓"
          : "👎🏻"
        : "", // ОК ОП
      dateFirstContact: appl.dateFirstContact ? appl.dateFirstContact : "",
      phone: appl.phone ? appl.phone : "",
      comment: appl.comment ? appl.comment : [],
      url: `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${appl.idApplicationIntrum}#request`,
      createdAtCrm: appl.createdAtCrm
        ? appl.createdAtCrm.replace(/-/g, ".")
        : "", // Дата в формате 2024-05-07 11:25:23 нужно убрать - на .
      createdAt: appl.createdAt ? formatDateTime(new Date(appl.createdAt)) : "",
    };
  });

  // Фильтрация данных по типу заявки
  let applicationsByType: Record<string, constructionApplicationsExcel[]> = {};
  applicationsNew.forEach((application) => {
    const type = application.typeApplication || "Заявка без типа";
    if (!applicationsByType[type]) {
      applicationsByType[type] = [];
    }
    applicationsByType[type].push(application);
  });

  //вкладка все заявки
  const allApplicationsSheet = workbook.addWorksheet("Все заявки");
  // Добавление заголовков столбцов для всех заявок
  const allColumns = columnsSetsApplicationNovodvinskaya[0];
  const allRussianColumns = allColumns.map((col) => col.headerName);
  allApplicationsSheet.addRow(allRussianColumns);
  let columns = columnsSetsApplicationNovodvinskaya[0];

  // Добавление всех данных в таблицу "Все заявки"
  applicationsNew.forEach((application) => {
    const row: Array<string | undefined> = [];
    allColumns.forEach((col) => {
      const value =
        application[col.field as keyof constructionApplicationsExcel];
      row.push(value?.toString());
    });

    allApplicationsSheet.addRow(row);
    const postUrlColumn = columns.find((col) => col.field === "url");

    if (postUrlColumn) {
      const postUrlColumnIndex =
        columns.findIndex((col) => col.field === "url") + 1;
      allApplicationsSheet.getColumn(postUrlColumnIndex).eachCell((cell) => {
        const cellValue = cell.text;
        if (cellValue) {
          cell.value = { text: cellValue, hyperlink: cellValue };
          cell.font = {
            underline: true,
            color: { argb: "FF0000FF" },
          };
        }
      });
    }

    // Управление стилями для колонки "ОК ОП"
    const okSaleCenterColumn = columns.find(
      (col) => col.field === "okSaleCenter"
    );

    if (okSaleCenterColumn) {
      const okSaleCenterColumnIndex =
        columns.findIndex((col) => col.field === "okSaleCenter") + 1;
      allApplicationsSheet
        .getColumn(okSaleCenterColumnIndex)
        .eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "✓":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, //  зеленый
              };
              break;
            case "👎🏻":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            default:
              // оставить по умолчанию
              break;
          }
        });
    }

    // Управление стилями для колонки "ОК КЦ"
    const okCallCenterColumn = columns.find(
      (col) => col.field === "okCallCenter"
    );

    if (okCallCenterColumn) {
      const okCallCenterColumnIndex =
        columns.findIndex((col) => col.field === "okCallCenter") + 1;
      allApplicationsSheet
        .getColumn(okCallCenterColumnIndex)
        .eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "✓":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, //  зеленый
              };
              break;
            case "👎🏻":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            default:
              // оставить по умолчанию
              break;
          }
        });
    }
  });

  // Создание вкладок Excel для каждого типа заявки
  Object.entries(applicationsByType).forEach(([type, data]) => {
    if (type !== "Заявка без типа") {
      const worksheet = workbook.addWorksheet(type);

      // Добавление заголовков столбцов
      let columns =
        columnsSetsApplicationNovodvinskaya[type === "Заявка" ? 0 : 1];

      // Удаление колонок "campaignUtm" и "termUtm" на вкладках "Кампания" и "Звонок"
      if (type === "Показ объекта по ЖК «5 вершин»") {
        columns = columns.filter(
          (col) =>
            col.field !== "campaignUtm" &&
            col.field !== "termUtm" &&
            col.field !== "rejection" &&
            col.field !== "errorReejctionDone"
        );
      }

      const russianColumns = columns.map((col) => col.headerName);
      worksheet.addRow(russianColumns);

      // Добавление данных в таблицу
      data.forEach((application) => {
        const row: Array<string | undefined> = [];
        columns.forEach((col) => {
          const value =
            application[col.field as keyof constructionApplicationsExcel];
          row.push(value?.toString());
        });
        worksheet.addRow(row);
      });

      // Управление стилями для колонки "URL"
      const postUrlColumn = columns.find((col) => col.field === "url");

      if (postUrlColumn) {
        const postUrlColumnIndex =
          columns.findIndex((col) => col.field === "url") + 1;
        worksheet.getColumn(postUrlColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;
          if (cellValue) {
            cell.value = { text: cellValue, hyperlink: cellValue };
            cell.font = {
              underline: true,
              color: { argb: "FF0000FF" },
            };
          }
        });
      }

      // Управление стилями для колонки "ОК ОП"
      const okSaleCenterColumn = columns.find(
        (col) => col.field === "okSaleCenter"
      );

      if (okSaleCenterColumn) {
        const okSaleCenterColumnIndex =
          columns.findIndex((col) => col.field === "okSaleCenter") + 1;
        worksheet.getColumn(okSaleCenterColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "✓":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, //  зеленый
              };
              break;
            case "👎🏻":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            default:
              // оставить по умолчанию
              break;
          }
        });
      }

      // Управление стилями для колонки "ОК КЦ"
      const okCallCenterColumn = columns.find(
        (col) => col.field === "okCallCenter"
      );

      if (okCallCenterColumn) {
        const okCallCenterColumnIndex =
          columns.findIndex((col) => col.field === "okCallCenter") + 1;
        worksheet.getColumn(okCallCenterColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "✓":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, //  зеленый
              };
              break;
            case "👎🏻":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            default:
              // оставить по умолчанию
              break;
          }
        });
      }

      // Управление стилями для колонки "Стадия после встречи"
      const postMeetingStageColumn = columns.find(
        (col) => col.field === "postMeetingStage"
      );

      if (postMeetingStageColumn) {
        const postMeetingStageColumnIndex =
          columns.findIndex((col) => col.field === "postMeetingStage") + 1;
        worksheet.getColumn(postMeetingStageColumnIndex).eachCell((cell) => {
          const cellValue = cell.text;

          switch (cellValue) {
            case "Встреча не состоялась":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFFFFF" }, // белый
              };
              break;
            case "Думает":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFA500" }, // оранжевый
              };
              break;
            case "Отказался":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" }, // красный
              };
              break;
            case "Отправлен расчет":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFFF00" }, // желтый
              };
              break;
            case "Подготовка расчета":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF0000FF" }, // синий
              };
              break;
            case "Подписан договор":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, // срдне  зеленый
              };
            case "Подготовка проекта":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, // слабо  зеленый
              };
            case "Продажа":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF008000" }, // ярко  зеленый
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

  // Создание файла Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Сохранение файла на стороне клиента
  saveAs(new Blob([buffer]), "5_вершин.xlsx");
}
