import { GridColDef } from "@mui/x-data-grid";
import { Sales } from "@prisma/client";



type FilterUserOptions = {
  dateStage: string[];
};

export function dateStageFilter(sale: Sales, currentFilter: FilterUserOptions) {
  if (currentFilter.dateStage?.length) {
    return currentFilter.dateStage.includes(
      sale.dateStage ? sale.dateStage : ""
    );
  }
  return true;
}

export const columnsSets: GridColDef[][] = [
  [
    { field: "lawyerName", headerName: "Юрист", width: 200 },
    { field: "adress", headerName: "Адрес", width: 400 },
    { field: "dateStage", headerName: "Дата смены стадии", width: 200 },
    { field: "lawyerCommission", headerName: "Комиссия юриста", width: 200 },
    { field: "idSalesIntrum", headerName: "Сделка", width: 200 },
  ],
  [
    { field: "agentSellerName", headerName: "Агент", width: 200 },
    { field: "adress", headerName: "Адрес", width: 400 },
    { field: "dateStage", headerName: "Дата смены стадии", width: 200 },
    {
      field: "agentSellerCommission",
      headerName: "Агент продавца",
      width: 200,
    },
    { field: "idSalesIntrum", headerName: "Сделка", width: 200 },
  ],
  [
    { field: "agentBuyerName", headerName: "Агент", width: 200 },
    { field: "adress", headerName: "Адрес", width: 400 },
    { field: "dateStage", headerName: "Дата смены стадии", width: 200 },
    {field: "agentBuyerCommission",headerName: "Агент покупателя",width: 200,},
    { field: "idSalesIntrum", headerName: "Сделка", width: 200 },
  ],
  [
    { field: "lawyerName", headerName: "Юрист", width: 200 },
    { field: "adress", headerName: "Адрес", width: 400 },
    { field: "dateStage", headerName: "Дата смены стадии", width: 200 },
    { field: "lawyerCommission2", headerName: "Юрист сумма", width: 200 },
    { field: "idSalesIntrum", headerName: "Сделка", width: 200 },
  ],
  [
    { field: "responsibleMain", headerName: "рек_прод", width: 200 },
    { field: "adress", headerName: "Адрес", width: 400 },
    { field: "dateStage", headerName: "Дата смены стадии", width: 200 },
    {
      field: "partCommissionSeller",
      headerName: "Часть комиссии, которую отдаем с комиссии продавца",
      width: 200,
    },
    { field: "idSalesIntrum", headerName: "Сделка", width: 200 },
  ],
  [
    { field: "responsibleMain", headerName: "рек_прод", width: 200 },
    { field: "adress", headerName: "Адрес", width: 400 },
    { field: "dateStage", headerName: "Дата смены стадии", width: 200 },
    {
      field: "sumCommissionBuyer",
      headerName: "Сумма которую отдаем с комиссии покупателя",
      width: 200,
    },
    { field: "idSalesIntrum", headerName: "Сделка", width: 200 },
  ],
];

export const titles: string[] = [
  "Эл_комис поля",
  "Агент продавца 1",
  "Агент покупателя",
  "Юрист",
  "Рек-прод",
  "Рек-покупателя"
];


export const titlesApplication: string[] = [
  "Лендинг",
  "WhatsApp"
];



export const columnsSetsApplication: GridColDef[][] = [
  [
    // { field: "createdAt", headerName: "Дата", width: 200 },
    { field: "createdAtCrm", headerName: "Дата", width: 200 },
    { field: "url", headerName: "Ссылка на заявку", width: 300 },
    { field: "phone", headerName: "Номер", width: 200 },
    { field: "translator", headerName: "Источник", width: 100 },
    { field: "campaignUtm", headerName: "Кампания", width: 200 },
    { field: "termUtm", headerName: "Запрос", width: 200 },
    { field: "responsibleMain", headerName: "Менеджер", width: 200 },
    { field: "timecallCenter", headerName: "Время обработки КЦ", width: 200 },
    { field: "okCallCenter", headerName: "ОК КЦ", width: 200 },
    { field: "timesaletCenter", headerName: "Время  обработки ОП", width: 200 },
    { field: "okSaleCenter", headerName: "ОК ОП", width: 200 },
    { field: "status", headerName: "Статус из crm", width: 200 },
    { field: "postMeetingStage", headerName: "Стадия после встречи", width: 200 },
    { field: "contactedClient", headerName: "Спец связался с клиентом?", width: 200 },
    { field: "rejection", headerName: "Отклонение от работы с заявкой", width: 200 },
    { field: "nextAction", headerName: "Дата след шага", width: 200 },
    { field: "errorReejctionDone",headerName: "Исправлена ошибка?", width: 200,},
    { field: "comment",headerName: "Комментарии", width: 200,},
  ],  [
    // { field: "createdAt", headerName: "Дата", width: 200 },
    { field: "createdAtCrm", headerName: "Дата", width: 200 },
    { field: "url", headerName: "Ссылка на заявку", width: 300 },
    { field: "phone", headerName: "Номер", width: 200 },
    { field: "translator", headerName: "Источник", width: 200 },
    { field: "campaignUtm", headerName: "Кампания", width: 200 },
    { field: "termUtm", headerName: "Запрос", width: 200 },
    { field: "responsibleMain", headerName: "Менеджер", width: 200 },
    { field: "timecallCenter", headerName: "Время обработки КЦ", width: 200 },
    { field: "okCallCenter", headerName: "ОК КЦ", width: 200 },
    { field: "timesaletCenter", headerName: "Время  обработки ОП", width: 200 },
    { field: "okSaleCenter", headerName: "ОК ОП", width: 200 },
    { field: "status", headerName: "Статус из crm", width: 200 },
    { field: "postMeetingStage", headerName: "Стадия после встречи", width: 200 },
    { field: "contactedClient", headerName: "Спец связался с клиентом?", width: 200 },
    { field: "rejection", headerName: "Отклонение от работы с заявкой", width: 200 },
    { field: "nextAction", headerName: "Дата след шага", width: 200 },
    { field: "errorReejctionDone",headerName: "Исправлена ошибка?", width: 200,},
    { field: "comment",headerName: "Комментарии", width: 200,},
  ]
 
];





export const columnsSets2: GridColDef[][] = [
  [
    { field: "lawyerSalary", headerName: "Юрист(зп)", width: 200 },
    { field: "lawyerFormula", headerName: "Формула Юрист", width: 400 },
    { field: "dateStage", headerName: "Дата смены стадии", width: 200 },
    { field: "lawyerSumm", headerName: "Юрист Сумма к выдаче", width: 200 },
    { field: "lawyerSumm1", headerName: "Юрист Сумма к выдаче 1", width: 150 },
    { field: "lawyerSalaryDone", headerName: "Юрист Выдана зп?", width: 150 },

  ],
  [
    { field: "agentSellerName", headerName: "Агент продав", width: 200 },
    { field: "agentSellerFormula", headerName: "Агент продавца формула", width: 400 },
    { field: "agentSellerCommission", headerName: "Агент продавца сумма 1 ", width: 200 },
    {field: "agentSellerSalaryDone",headerName: "Агент продавца выдана зп?",width: 200,}
  ],
  [
    { field: "agentBuyerName", headerName: "Агент покупателя", width: 200 },
    { field: "agentBuyerFormul", headerName: "Агент покупателя формула", width: 550 },
    { field: "agentBuyerCommission", headerName: "Агент покупателя сумма 1", width: 250 },
    { field: "agentBuyerSalaryDone", headerName: "Агент покупателя была выдача?", width: 150 },
  ],
  [
    { field: "idSalesIntrum", headerName: "Сделка", width: 200 },
    { field: "responsibleMain", headerName: "Отвественный", width: 400 },
    { field: "agentBuyerCommission", headerName: "Комиссия (от покупателя)", width: 200 },
    { field: "lawyerName", headerName: "Юрист", width: 200 },
    { field: "mortageFormula", headerName: "Ипотека формула", width: 200 },
    { field: "mortageSumm1", headerName: "Ипотека сумма 1", width: 200 },
    { field: "mortageOtdel", headerName: "Привлечение ипотечного отдела", width: 200 }

  ],
  
];

export const titles2: string[] = [
  "Юрист НЕТ",
  "Агент продавца НЕТ",
  "Агент покупателя НЕТ",
  "Ипотека"
];
