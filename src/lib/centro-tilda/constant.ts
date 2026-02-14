// Поля, которые не должны выводиться в Excel отчеты по Опросам ОП
export const excludedKeys = new Set([
  "id",
  "error",
  "raw_name",
  "typeSend",
  "db_id",
  "formid",
  "phone",
]);
