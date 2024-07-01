// Функция для очистки и нормализации строки адреса с учетом сокращений и объединения цифр с буквами
function cleanAddress(address: string) {
  let cleanedAddress = address.toLowerCase().trim();
  // Объединение цифр с последующими буквами
  cleanedAddress = cleanedAddress.replace(/(\d)\s*([a-zA-Zа-яА-Я])/g, "$1$2");
  // Удаление лишних символов
  cleanedAddress = cleanedAddress.replace(/[^a-zA-Zа-яА-Я0-9\s]/g, "").trim();
  return cleanedAddress;
}

// Функция для проверки совпадения адресов
export async function isExactMatchTwo(address1: string, searchAddress: string) {
  const cleanedAddress1 = cleanAddress(address1);
  const cleanedAddress2 = cleanAddress(searchAddress);
  // Разделение на части для точного сравнения
  const parts1 = cleanedAddress1.split(/\s+/);
  const parts2 = cleanedAddress2.split(/\s+/);

  // Проверка наличия всех частей searchAddress в address1
  let match = true;
  for (let part of parts2) {
    if (!parts1.includes(part)) {
      match = false;
      break;
    }
  }

  // Проверка точного совпадения номеров домов с буквенными суффиксами
  const numberParts1 = cleanedAddress1.match(/\d+[a-zA-Zа-яА-Я]?/g) || [];
  const numberParts2 = cleanedAddress2.match(/\d+[a-zA-Zа-яА-Я]?/g) || [];

  for (let part of numberParts2) {
    //@ts-ignore
    if (!numberParts1.includes(part)) {
      match = false;
      break;
    }
  }
  return match;
}





async function cleanAddressNew(address:string) {
  let cleanedAddress = address.toLowerCase().trim();
  // Замена сокращений и объединение цифр с последующими буквами
  const replacements = {
      '\\bул\\.?\\b': 'улица',
      '\\bобл\\.?\\b': 'область',
      '\\bг\\.?\\b': 'город',
      '\\bр\\.?\\b': 'район',
      '\\bпросп\\.?\\b': 'проспект',
      '\\bпер\\.?\\b': 'переулок'
  };
  
  for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(key, 'g');
      cleanedAddress = cleanedAddress.replace(regex, value);
  }
  
  // Объединение цифр с последующими буквами
  cleanedAddress = cleanedAddress.replace(/(\d)\s*([a-zа-я])/g, "$1$2");
  // Удаление лишних символов
  cleanedAddress = cleanedAddress.replace(/[^a-zа-я0-9\s]/g, "").trim();
  // Удаление несущественных слов
  const stopWords = ['область', 'город', 'республика', 'район'];
  cleanedAddress = cleanedAddress.split(' ').filter(word => !stopWords.includes(word)).join(' ');
  return cleanedAddress;
}




// Функция для проверки совпадения адресов
export async function isExactMatchThree(address1:string,searchAddress:string ) {

  const cleanedAddress1 = await cleanAddressNew(address1);
  const cleanedAddress2 = await cleanAddressNew(searchAddress);
  
  // console.log('Cleaned Address 1:', cleanedAddress1);
  // console.log('Cleaned Address 2:', cleanedAddress2);
  
  // Извлечение номеров домов с суффиксами
  const numberPart1 = cleanedAddress1.match(/\d+[a-zа-я]?/g) || [];
  const numberPart2 = cleanedAddress2.match(/\d+[a-zа-я]?/g) || [];
  
  // console.log('Number Part 1:', numberPart1);
  // console.log('Number Part 2:', numberPart2);
  
  // Проверка совпадения номеров домов с суффиксами
  if (numberPart1.length > 0 && numberPart2.length > 0) {
      if (numberPart1[0] !== numberPart2[0]) {
          return false;
      }
  } else if (numberPart1.length !== numberPart2.length) {
      return false;
  }
  
  // Удаление номеров домов из адресов
  const addressWithoutNumbers1 = cleanedAddress1.replace(numberPart1[0] || '', '').trim();
  const addressWithoutNumbers2 = cleanedAddress2.replace(numberPart2[0] || '', '').trim();
  
  // console.log('Address Without Numbers 1:', addressWithoutNumbers1);
  // console.log('Address Without Numbers 2:', addressWithoutNumbers2);
  
  // Разделение на части для точного сравнения
  const parts1 = addressWithoutNumbers1.split(/\s+/);
  const parts2 = addressWithoutNumbers2.split(/\s+/);
  
  // console.log('Parts 1:', parts1);
  // console.log('Parts 2:', parts2);
  
  // Проверка наличия хотя бы одной части searchAddress в address1
  for (let part of parts2) {
      if (parts1.includes(part)) {
          return true;
      }
  }
  
  return false;
}


export function funcCity(input:string) {
  const cityArr = [
      { name: "Волгоград" },
      { name: "Волжский" },
      { name: "Фролово" },
      { name: "Среднеахтубинский" },
      { name: "Елань" },
      { name: "Михайловка" },
      { name: "Урюпинск" },
      { name: "Калач-на-Дону" }
  ];

  // Проверяем, есть ли значение в массиве городов
  const cityExists = cityArr.some(city => city.name === input);

  if (cityExists) {
      return input;
  }

  if (input !== 'Не указан') {
      return '';
  }

  return input;
}




// // Функция для очистки и нормализации строки адреса с учетом сокращений и объединения цифр с буквами
// function cleanAddress(address:string) {

//     let cleanedAddress = address.toLowerCase().trim();

//     // Объединение цифр с последующими буквами
//     cleanedAddress = cleanedAddress.replace(/(\d)\s*([a-zA-Zа-яА-Я])/g, '$1$2');

//     // Удаление лишних символов
//     cleanedAddress = cleanedAddress.replace(/[^a-zA-Zа-яА-Я0-9\s]/g, '').trim();

//     // // Логирование промежуточного результата
//     // console.log(`Normalized address: ${cleanedAddress}`);

//     return cleanedAddress;
// }

// // Функция для проверки совпадения адресов
// export async function isExactMatchTwo(address1:string, searchAddress:string) {
//     console.log({address1: address1 ,searchAddress:searchAddress}  );

//     const cleanedAddress1 = cleanAddress(address1);

//     const cleanedAddress2 = cleanAddress(searchAddress)

//     // Проверка, что все части cleanedAddress2 присутствуют в cleanedAddress1
//     return cleanedAddress2.split(/\s+/).every(part => cleanedAddress1.includes(part));
// }
