export type ProjectType = "ЖДД" | "ЖД" | "Не определено";

/**
 * Определяет тип проекта на основе текста сообщения
 * @param text - Текст сообщения для анализа
 * @returns Тип проекта: "ЖДД", "ЖД" или "Не определено"
 */
export async function determineProjectType(text: string): Promise<ProjectType> {
  if (/ТОП-10 проектов|ТОП-10 Домов/i.test(text)) {
    return "ЖДД";
  } else if (/консультац/i.test(text)) {
    return "ЖД";
  }
  return "Не определено";
}