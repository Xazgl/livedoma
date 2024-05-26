import * as XLSX from "xlsx";
import { InparseObjects } from "@prisma/client";
import { InparseAnswer } from "../../@types/dto";
import JSZip from "jszip";
import FileSaver from "file-saver";
// import { mkdir, writeFile } from "node:fs/promises";
// import { cwd } from 'node:process';
// import path from "node:path";

export async function createArchive(objectsInparse: InparseAnswer[]) {
    // const currentDate = new Date().toLocaleDateString().replaceAll('.', '') + new Date().toLocaleTimeString().replaceAll(':', '')
    // const rootDir = cwd()
    // const archiveFolder = path.join(rootDir, 'static/files', currentDate)
    // await mkdir(archiveFolder, {recursive: true})
    const zip = new JSZip();

    for (const item of objectsInparse) {
        const address = item.address;
        const folder = zip.folder(address); // Создать папку в архиве
        for (const obj of item.objects) {
            
            // Создать HTML страницу для объекта
            const htmlContent = `<html><head><title>${obj.title}</title></head><body><h1>${obj.title}</h1><p>Phones: ${obj.phones.join(', ')}</p><p>Price: ${obj.price}</p><p>Source: ${obj.source}</p><p>URL: <a href="${obj.url}">${obj.url}</a></p></body></html>`;
            //сохраняем файл по адресу с контентом
            // zip.file(`${obj.title}.html`,htmlContent);
            folder?.file(`${obj.title? obj.title.replaceAll('/', '-'): obj.address}.html`, htmlContent, {binary: false}) ;
        }
    }
    zip.generateAsync({ type: 'blob' }).then((content) => {
        console.log(content);
        
        FileSaver.saveAs(content, 'objects_archive.zip'); // Сохранить архив
    });
}

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
