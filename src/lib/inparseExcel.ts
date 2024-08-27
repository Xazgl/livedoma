import * as XLSX from "xlsx";
import { InparseAnswer } from "../../@types/dto";
import JSZip from "jszip";
import FileSaver from "file-saver";
import { isExactMatchTwo } from "./foundAdress";
import { InparseObjects, SmartAgentObjects } from "@prisma/client";
import {formatISODate } from "./dateStr";
import { getInparseCategory } from "./inparseCategoryFind";

type GroupedByManager = {
  manager: string;
  addresses: InparseAnswer[];
};


export async function createArchiveNew(objectsInparse: InparseAnswer[]) {

  function groupByManager(data: InparseAnswer[]): GroupedByManager[] {
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.manager]) {
        acc[item.manager] = [];
      }
      acc[item.manager].push(item);
      return acc;
    }, {} as { [key: string]: InparseAnswer[] });

    return Object.keys(grouped).map(manager => ({
      manager,
      addresses: grouped[manager]
    }));
  }

  const zip = new JSZip();
  const groupedData = groupByManager(objectsInparse);

  for (const item of groupedData) {
    const manager = item.manager;
    const managerLastName = manager.split(' ')[0]; // Фамилия менеджера
    let htmlContent = `<html><head><title>Объекты менеджера ${manager}</title></head><body><h1>Объекты менеджера ${manager}</h1>`;

    for (const addressObj of item.addresses) {
      for (const obj of addressObj.objects) {
        const images = obj.images.length > 0 ? obj.images.map(url => `<img src="${url}" alt="Image"  style="width:200px;height:200px;" />`).join('') : '';
        const objHtmlContent = `<div><h2>${obj.title}</h2><p>Телефон: ${obj.phones.join(', ')}</p><p>Адрес с Inparse: ${obj.address}</p><p>Cравниваем его с нашим объектом по адресу: ${addressObj.address}</p><p><h3>Цена площадки: ${obj.price} Цена наша: ${addressObj.price}</h3></p><p>Площадка: ${obj.source}</p><p>Ссылка: <a href="${obj.url}">${obj.url}</a></p><p>Ссылка в intrum на наш объект с которым сравниваем: <a href="https://jivemdoma.intrumnet.com/crm/tools/exec/stock/${addressObj.idIntrum}#stock">https://jivemdoma.intrumnet.com/crm/tools/exec/stock/${addressObj.idIntrum}#stock</a></p><div style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 5px;">${images}</div></div><hr />`;

        // Проверка совпадения адресов
        const isExactMatchTwoNew = await isExactMatchTwo(obj.address, addressObj.address);
        
        if (isExactMatchTwoNew) {
          htmlContent += objHtmlContent;
        }
      }
    }

    htmlContent += `</body></html>`;
    zip.file(`${managerLastName}.html`, htmlContent, { binary: false });
  }

  zip.generateAsync({ type: 'blob' }).then((content) => {
    FileSaver.saveAs(content, 'objects_archive.zip'); // Сохранить архив
  }).catch(error => {
    console.error("Error generating zip:", error);
  });
}


export async function createArchive(objectsInparse: InparseAnswer[]) {

  function groupByManager(data: InparseAnswer[]): GroupedByManager[] {
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.manager]) {
        acc[item.manager] = [];
      }
      acc[item.manager].push(item);
      return acc;
    }, {} as { [key: string]: InparseAnswer[] });
  
    return Object.keys(grouped).map(manager => ({
      manager,
      addresses: grouped[manager]
    }));
  }

  const zip = new JSZip();
  const groupedData = groupByManager(objectsInparse);
  // console.log({groupedData:groupedData})
  
  for (const item of groupedData) {
      const manager = item.manager;
      const managerFolder = zip.folder(manager.split(' ')[0]);// Создать папку в архиве c менеджером
      for (const addressObj of item.addresses) {
        const addressFolder = managerFolder?.folder(addressObj.address); // Создать папку в архиве c адресом
        for (const obj of addressObj.objects) {
          //cоздать HTML  для объекта
          const images = obj.images.length > 0?  obj.images.map(url => `<img src="${url}" alt="Image" />`).join('') : '';
          const htmlContent = `<html><head><title>${obj.title}</title></head><body><h1>${obj.title}</h1><p>Телефон: ${obj.phones.join(', ')}</p><p>Адрес с Inparse: ${obj.address}</p><p>Cравниваем его с нашим объектом адресу:  ${addressObj.address} </p><p><h3>Цена площадки: ${obj.price} Цена наша: ${addressObj.price}</h3> </p> <p>Площадка: ${obj.source}</p><p>Ссылка: <a href="${obj.url}">${obj.url}</a></p> <p>Ссылка в intrum на наш объект с которым сравниваем:<a href="https://jivemdoma.intrumnet.com/crm/tools/exec/stock/${addressObj.idIntrum}#stock">https://jivemdoma.intrumnet.com/crm/tools/exec/stock/${addressObj.idIntrum}#stock</a></p>${images}</body></html>`;

          //функция для проверки совпадения адресов
          const isExactMatchTwoNew =  await isExactMatchTwo(obj.address, addressObj.address)
          
           if(isExactMatchTwoNew) {
            addressFolder?.file(`${obj.idInparse? obj.idInparse.replaceAll('/', '-') : obj.idInparse}.html`, htmlContent, { binary: false });
            
            // const coincidence  = addressFolder?.folder('Текущий_адрес_объекты'); 
            // if (coincidence) {
            //   //сохраняем файл 
            //   coincidence.file(`${obj.idInparse? obj.idInparse.replaceAll('/', '-') : obj.idInparse}.html`, htmlContent, { binary: false });
            //  } else {
            //  console.error(`Failed to create folder for address: ${addressObj.address}`);
            // }
          } else {
            // const coincidenceNot  = addressFolder?.folder('Соседние_адреса'); 
            // if (coincidenceNot) {
            //   //сохраняем файл 
            //   coincidenceNot.file(`${obj.idInparse? obj.idInparse.replaceAll('/', '-') : obj.idInparse}.html`, htmlContent, { binary: false });
           
            // } else {
            // //  console.error(`Failed to create folder for address: ${addressObj.address}`);
            // }
          }
      }
    }
  }

  zip.generateAsync({ type: 'blob' }).then((content) => {
    FileSaver.saveAs(content, 'objects_archive.zip'); // Сохранить архив
  }).catch(error => {
    console.error("Error generating zip:", error);
  });
}






// export async function createArchive(objectsInparse: InparseAnswer[]) {
//     // const currentDate = new Date().toLocaleDateString().replaceAll('.', '') + new Date().toLocaleTimeString().replaceAll(':', '')
//     // const rootDir = cwd()
//     // const archiveFolder = path.join(rootDir, 'static/files', currentDate)
//     // await mkdir(archiveFolder, {recursive: true})
//     const zip = new JSZip();

//     for (const item of objectsInparse) {
//         const address = item.address;
//         const folder = zip.folder(address); // Создать папку в архиве
//         for (const obj of item.objects) {
            
//             // Создать HTML страницу для объекта
//             const htmlContent = `<html><head><title>${obj.title}</title></head><body><h1>${obj.title}</h1><p>Phones: ${obj.phones.join(', ')}</p><p>Price: ${obj.price}</p><p>Source: ${obj.source}</p><p>URL: <a href="${obj.url}">${obj.url}</a></p></body></html>`;
//             //сохраняем файл по адресу с контентом
//             // zip.file(`${obj.title}.html`,htmlContent);
//             folder?.file(`${obj.title? obj.title.replaceAll('/', '-'): obj.address}.html`, htmlContent, {binary: false}) ;
//         }
//     }
//     zip.generateAsync({ type: 'blob' }).then((content) => {
//         console.log(content);
        
//         FileSaver.saveAs(content, 'objects_archive.zip'); // Сохранить архив
//     });
// }




export async function createExcel(objectsInparse: InparseAnswer[]) {
  // Создаем новый workbook
  const workbook = XLSX.utils.book_new();

  // Создаем новый worksheet с заголовками столбцов
  const headers = [
    "Главный адрес",
    "Объект 1",
    "Объект 2",
    "Объект 3",
    "Объект 4",
    "Объект 5",
  ];
  const worksheetData: any[][] = [headers];

  // Заполняем данные для каждого адреса и объектов
  objectsInparse.forEach((item) => {
    const address = item.address;
    const row: any[] = [address]; // Начинаем с адреса

    // Заполняем данные объектов
    item.objects.forEach((obj, objIndex) => {
      const objData = [
        obj.title,
        obj.phones.join(", "),
        obj.price,
        obj.source,
        obj.url,
      ];

      row.push(objData); // Добавляем данные объекта в строку
    });

    // Заполняем пропущенные объекты, если их меньше 5
    const emptyObjCount = 5 - item.objects.length;
    for (let i = 0; i < emptyObjCount; i++) {
      row.push(["", "", "", "", ""]); // Пустые данные объекта
    }

    worksheetData.push(row.flat()); // Добавляем строку в данные листа
  });

  // Создаем рабочий лист из массива данных
  const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Добавляем worksheet в workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Преобразуем workbook в бинарный формат
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "buffer",
  });

  // Создаем Blob из буфера
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  // Создаем ссылку на Blob
  const url = URL.createObjectURL(blob);

  // Создаем ссылку для скачивания файла
  const link = document.createElement("a");
  link.href = url;
  link.download = "objects.xlsx";

  // Добавляем ссылку на страницу и эмулируем клик по ней
  document.body.appendChild(link);
  link.click();

  // Очищаем ссылку
  URL.revokeObjectURL(url);
}


export async function createExcelUniqObj(objectsInparse: InparseObjects[]) {
    // Создаем новый workbook
    const workbook = XLSX.utils.book_new();
  
    // Заголовки столбцов на русском языке
    const headers: string[] = [
      "ID Inparse",
      "ID Категории",
      "Название",
      "Адрес",
      "Этаж",
      "Этажей",
      "Площадь",
      "Площадь земли",
      "Цена",
      "Описание",
      "Фото",
      "ФИО",
      "Телефон",
      "Ссылка",
      "Продавец",
      "Источник",
      "Дата добавления"
    ];
    const worksheetData: any[][] = [headers];
  
    // Заполняем данные для каждого объекта
    objectsInparse.forEach((item) => {
      const row: any[] = [
        item.idInparse,
        getInparseCategory(item.categoryId),
        item.title,
        item.address ,
        item.floor || '',
        item.floors || '',
        item.sq || '',
        item.sqLand || '',
        item.price || '',
        item.description || '',
        item.images.join(', '), // Преобразуем массив изображений в строку
        item.name,
        item.phones.join(', '), // Преобразуем массив телефонов в строку
        item.url,
        item.agent || '',
        item.source || '',
        item.createdAt? formatISODate(item.createdAt) : '',
      ];
      worksheetData.push(row); // Добавляем строку в данные листа
    });
  
    // Создаем рабочий лист из массива данных
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
    // Добавляем worksheet в workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Объекты за 2 дня");
  
    // Преобразуем workbook в бинарный формат
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });
  
    // Создаем Blob из буфера
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  
    // Создаем ссылку на Blob
    const url = URL.createObjectURL(blob);
  
    // Создаем ссылку для скачивания файла
    const link = document.createElement("a");
    link.href = url;
    link.download = "objects.xlsx";
  
    // Добавляем ссылку на страницу и эмулируем клик по ней
    document.body.appendChild(link);
    link.click();
  
    // Удаляем ссылку из документа
    document.body.removeChild(link);
    // Очищаем ссылку
    URL.revokeObjectURL(url);
}


export async function createExcelUniqObjTwo(objectsInparse: SmartAgentObjects[]) {
  // Создаем новый workbook
  const workbook = XLSX.utils.book_new();

  // Заголовки столбцов на русском языке
  const headers: string[] = [
    "ID Смартагент",
    "Адрес",
    "Фото",
    "Фото источника",
    "Телефоны",
    "Ссылка на источник"
  ];
  const worksheetData: any[][] = [headers];

  // Заполняем данные для каждого объекта
  objectsInparse.forEach((item) => {
    const row: any[] = [
      item.idSmartAgent,
      item.street_cache,
      item.images.join(', '), // Преобразуем массив изображений в строку
      item.images_source.join(', '), 
      item.phone.join(', '),
      item.source_url
    ];
    worksheetData.push(row); // Добавляем строку в данные листа
  });

  // Создаем рабочий лист из массива данных
  const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Добавляем worksheet в workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Преобразуем workbook в бинарный формат
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "buffer",
  });

  // Создаем Blob из буфера
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  // Создаем ссылку на Blob
  const url = URL.createObjectURL(blob);

  // Создаем ссылку для скачивания файла
  const link = document.createElement("a");
  link.href = url;
  link.download = "objects.xlsx";

  // Добавляем ссылку на страницу и эмулируем клик по ней
  document.body.appendChild(link);
  link.click();

  // Удаляем ссылку из документа
  document.body.removeChild(link);
  // Очищаем ссылку
  URL.revokeObjectURL(url);
}



export function normalizeAddressApi(address: string): string {
  // Пример функции нормализации адреса. Модифицируйте по необходимости
  return address.toLowerCase().replace(/\s+/g, "");
}