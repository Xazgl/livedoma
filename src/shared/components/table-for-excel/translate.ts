import { GridLocaleText } from "@mui/x-data-grid";

export const ruRU: Partial<GridLocaleText> = {
  // Пагинация
  MuiTablePagination: {
    labelRowsPerPage: "Строк на странице:",
    labelDisplayedRows: ({ from, to, count }) =>
      `${from}–${to} из ${count !== -1 ? count : `более чем ${to}`}`,
    getItemAriaLabel: (type) => {
      switch (type) {
        case "first":
          return "Первая страница";
        case "last":
          return "Последняя страница";
        case "next":
          return "Следующая страница";
        case "previous":
          return "Предыдущая страница";
        default:
          return "";
      }
    },
  },

  // Сортировка
  columnMenuSortAsc: "Сортировать по возрастанию",
  columnMenuSortDesc: "Сортировать по убыванию",
  columnMenuUnsort: "Сбросить сортировку",

  // Фильтры
  columnMenuFilter: "Фильтры",
  columnMenuHideColumn: "Скрыть колонку",
  columnMenuManageColumns: "Управление колонками",
  filterPanelColumns: "Колонки",
  filterPanelInputLabel: "Значение",
  filterPanelInputPlaceholder: "Введите значение",
};
