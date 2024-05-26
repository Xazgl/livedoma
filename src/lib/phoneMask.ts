export async function normalizePhoneNumber(phone: string) {
  // Извлекаем только цифры из строки
  const digitsOnly = phone.replace(/\D/g, "");
  // Если номер начинается с "7", заменяем его на "+7"
  if (digitsOnly.startsWith("7")) {
    return `+${digitsOnly}`;
  }
  // Если номер начинается с "8", заменяем его на "+7"
  if (digitsOnly.startsWith("8")) {
    return `+7${digitsOnly.slice(1)}`;
  }
  // Если номер не начинается с "7" или "8", добавляем "+7" в начало
  return `+7${digitsOnly}`;
}


export async function normalizeWazzupNumber(phone:string) {
  if (phone!== "Admin") {
    if (!phone.startsWith('+')) {
      return `+${phone}`;
    }
  }
  return phone;
}