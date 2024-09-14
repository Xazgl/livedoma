const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient()

const { Worker } = require("worker_threads");
// const consola = require("consola");

const os = require("os");
const path = require("path");
const xlsx = require("xlsx");

const nodemailer = require("nodemailer");
const { getInparseCategory, formatISODate } = require("./function");

// const { customAlphabet } = require('nanoid');
// const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 10);
// const uniqueIdentifier = nanoid();


function splitArrayIntoChunks(array, parts) {
  let result = [];
  for (let i = parts; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return result;
}

const cpuCount = os.cpus().length;

const headers = [
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

async function start() {
  try {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 1);

    const [allInparseObjects, allIntumAddresses] = await Promise.all([
      db.inparseObjects.findMany({
        where: {
          active:true,
          createdAt: {
            gte: fourteenDaysAgo,
          },
        },
      }),
      db.objectIntrum
        .findMany({
          select: { street: true },
        })
        .then((objects) => objects.map((obj) => obj.street)),
    ]);

    const chunks = splitArrayIntoChunks(allInparseObjects, cpuCount);
    const promises = chunks.map((chunk) => {
      return new Promise((resolve, reject) => {
        // const worker = new Worker(
        //   path.join(process.cwd(), "./worker/worker.js"),
        //   { workerData: { chunk, allIntumAddresses } }
        // );
        const worker = new Worker(
          path.join(__dirname, "worker.js"), 
          { workerData: { chunk, allIntumAddresses } }
        );
        worker.on("message", resolve);
        worker.on("error", reject);
        worker.on("exit", (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
            // consola.fail(code);
          }
        });
      });
    });

    const results = (await Promise.all(promises)).flat();

    function generateUniqueIdentifier() {
      const timestamp = Date.now().toString(36); // Текущее время в миллисекундах, преобразованное в строку в системе счисления 36
      const randomPart = Math.random().toString(36).substring(2, 12); // Случайное число, преобразованное в строку (без "0.")
      return timestamp + randomPart; // Склеиваем обе части
    }
    
    const uniqueIdentifier = generateUniqueIdentifier();

    if (results && results.length > 0) {
      //Добавляем в базу ссылку на объекты 
      await db.reviewLink.create({
        data: {
          identifier: uniqueIdentifier,
          objectIds: results.map(item => item.id),
        },
      });
    }

    // Создаем Excel файл
    const workbook = xlsx.utils.book_new();
    const worksheetData = [headers];

    // Заполняем данные для каждого объекта
    results.forEach((item) => {
      const row = [
        item.idInparse,
        getInparseCategory(item.categoryId),
        item.title,
        item.address,
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
        item.createdAt ? formatISODate(item.createdAt) : '',
      ];
      worksheetData.push(row); // Добавляем строку в данные листа
    });

    const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Объекты за 2 дня");

    const excelFilePath = path.join(process.cwd(), "results.xlsx");
    xlsx.writeFile(workbook, excelFilePath);

    // Настраиваем и отправляем письмо с вложением
    const transporter = nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: 465,
      secure: true,
      auth: {
        user: 'e-16757995@yandex.ru',
        pass: 'afwrhpankjlerydv',
      },
    });

    const link = `https://mls-vlg.ru/admin/results/${uniqueIdentifier}`;

    // const link = `http://localhost:3000/admin/results/${uniqueIdentifier}`;


    const dateTimeString = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });


    const mailOptions = {
      from: "e-16757995@yandex.ru",
      to: ["karpovichirina87@gmail.com",'ldomofon-sericel@rambler.ru'],
      subject: "Inparse уникальные объекты",
      text: `Сверьте объекты из файла во вложении к письму и занесите уникальные из них в Intrum. После добавления объекта в црм проставить кнопку в таблице по ссылке (создана ${dateTimeString}): ${link}`,
      // text: "Сверить объекты из файла во вложении к письму и занести уникальные из них в Intrum",
      attachments: [
        {
          filename: "results.xlsx",
          path: excelFilePath,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // consola.error("Error sending email:", error);
        console.log("Error sending email:", error);
      } else {
        // consola.success("Email sent: " + info.response);
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    // consola.error("Error processing request:", error);
    console.log("Error processing request:", error);
  }
}

start();
