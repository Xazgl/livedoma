import { SurveyData } from "../../../../@types/dto";
import { Tilda } from "../../../../prisma";


export const formatHeaderName = (key: string): string => {
  return key
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export const createColumns = (data: any[]) => {
  if (data.length === 0) return [];

  // Собираем все уникальные ключи из данных
  const allKeys = new Set<string>();
  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (key !== "id" && key !== "error") {
        allKeys.add(key);
      }
    });
  });

  // Преобразуем в колонки для DataGrid
  return Array.from(allKeys).map((key) => ({
    field: key,
    headerName: formatHeaderName(key),
    width: 200,
    flex: 1,
  }));
};

// Функция для парсинга JSON из поля name и преобразования в плоскую структуру
export const parseSurveyData = (applications: Tilda[]) => {
  return applications.map((app, index) => {
    try {
      const surveyData = app.name ? (JSON.parse(app.name) as SurveyData) : {};

      // Создает плоский объект для DataGrid
      const flatData: any = {
        id: app.id,
        db_id: app.id,
        created_at: app.createdAt
          ? new Date(app.createdAt).toLocaleDateString("ru-RU")
          : "",
        formid: app.formid,
        phone: app.phone,
        typeSend: app.typeSend, 
        ...surveyData,
      };

      return flatData;
    } catch (error) {
      console.error("Error parsing survey data:", error);
      return {
        id: app.id,
        db_id: app.id,
        created_at: app.createdAt
          ? new Date(app.createdAt).toLocaleDateString("ru-RU")
          : "",
        formid: app.formid,
        phone: app.phone,
        error: "Invalid JSON data",
      };
    }
  });
};
