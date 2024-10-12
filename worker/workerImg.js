const { parentPort, workerData } = require("worker_threads");
const path = require("path");
const fs = require("fs/promises");
const wait = require('timers/promises').setTimeout
const util = require('node:util');
const { exec } = require('node:child_process')
const execPromise = util.promisify(require('node:child_process').exec);
const shell = require('shelljs');

// Функция для сохранения изображения
const downloadAndSaveImage = async (image) => {

    // shell.cd('./static/images')
    // if (shell.ls('./').includes('sendImages')) {
    //     shell.rm('-rf', './sendImages')
    // }
    // shell.mkdir('sendImages')

    const folderPath = path.join(__dirname, '..', 'static', 'images', 'sendImages');
    await fs.mkdir(folderPath, { recursive: true });
    
    // const fileName = `${Date.now()}-${image.name}`;
    const fileName = `${image.name}`;
    const filePath = path.join(folderPath, fileName);

    try {
        const fileBuffer = Buffer.from(await image.arrayBuffer());
        await fs.writeFile(filePath, fileBuffer);

        const savedImage = filePath.replace(/\\+/g, "/").replace(/.*?static/, "/static");
         console.log(savedImage )
        return { full: savedImage };
    } catch (error) {
        console.error("Ошибка при сохранении изображения:", error);
        return { error: error.message };
    }
};

// Получаем данные для работы из workerData
const { image, folderPath } = workerData;

// Выполняем работу
downloadAndSaveImage(image, folderPath)
    .then((result) => {
        parentPort.postMessage(result); // Возвращаем результат в основной поток
    })
    .catch((error) => {
        parentPort.postMessage({ error: error.message });
    });
