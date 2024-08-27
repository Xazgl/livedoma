export function formatDateTime(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`;
}


export function formatDateTimeToDDMMYYYYHHMMSS(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

export function formatISODate(isoDateString: Date) {
  // Создаем объект Date из строки
  const date = new Date(isoDateString);

  // Получаем компоненты даты и времени
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  // Форматируем в строку
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}



// export function formatDate(dateString: string): Date {
//   const [year, month, day] = dateString.split("-");
//   return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
// }
