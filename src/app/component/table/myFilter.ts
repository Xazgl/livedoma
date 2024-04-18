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
