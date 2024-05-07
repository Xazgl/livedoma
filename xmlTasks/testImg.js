
//@ts-check
const shell = require('shelljs');
const { AxiosError } = require("axios");
const fs = require('fs/promises');
const wait = require('timers/promises').setTimeout
const path = require("node:path");
const xml2js = require('xml2js')
const objectLinks = require('./links.json') || [] //массив ссылок на фиды
const axios = require('axios').default

const { PrismaClient } = require("@prisma/client");
const { exec } = require('child_process');
const util = require('node:util');
const execPromise = util.promisify(require('node:child_process').exec);

const db = new PrismaClient()

const parser = new xml2js.Parser()
shell.cd('./static/images')
if (shell.ls('./').includes('objects')) {
    shell.rm('-rf', './objects')
}
shell.mkdir('objects')

// Функция загрузки и сохранения изображений
async function downloadAndSaveImages(cleanLinks, folderPath) {
    const arr = []
    try {
        await fs.mkdir(folderPath, { recursive: true });
        shell.cd(folderPath)
        let command = `cd ${folderPath} && curl `
            + Array(cleanLinks.length).fill('-O').join(' ')
            + ' '
            + Array(cleanLinks.length).fill(null).map((_, i) => {
                return cleanLinks[i].split('?')[0]
            }).join(' ')
            + ' --parallel'

        for (let i = 0; i < cleanLinks.length; i++) {
            const imageUrl = cleanLinks[i].replace(/\?.*/, '');
            const imageFileName = path.basename(imageUrl);
            const imagePath = path.join(folderPath, imageFileName);
            console.log(`Изображение сохранено: ${imagePath}`);
            arr.push(imagePath.replace(/.*?static/, '/static').replace(/\\/g, '/'))
        }
        await execPromise(command, { timeout: 5000 })
        await Promise.allSettled(command)
        return arr;
    } catch (error) {
        console.error('Ошибка при загрузке и сохранении изображений:', error);
        return arr
    }
}

async function start() {


    const photoFolderPath = path.join(__dirname, '..', 'static', 'test', '9639497');

    const cleanLinksNew = await downloadAndSaveImages(['https://volgograd.vladis.ru/uploads/catalog/i/lbig/9639497.jpg'], photoFolderPath);

    const photoFolderPath2 = path.resolve(__dirname, '../static/test1', '9639497');
    const cleanLinksNew2 = await downloadAndSaveImages(['https://volgograd.vladis.ru/uploads/catalog/i/lbig/9639497.jpg'], photoFolderPath2);

    const photoFolderPath3 = path.join('/var/www/html/static', 'test2', '9639497');
    const cleanLinksNew3 = await downloadAndSaveImages(['https://volgograd.vladis.ru/uploads/catalog/i/lbig/9639497.jpg'], photoFolderPath3);

    const photoFolderPath4 = path.resolve('/var/www/html/static/test3', '9639497');
    const cleanLinksNew4 = await downloadAndSaveImages(['https://volgograd.vladis.ru/uploads/catalog/i/lbig/9639497.jpg'], photoFolderPath4);

    const photoFolderPath5 = path.join('/var', 'www', 'html', 'static', 'test4', '9639497');
    const cleanLinksNew5 = await downloadAndSaveImages(['https://volgograd.vladis.ru/uploads/catalog/i/lbig/9639497.jpg'], photoFolderPath5);

    const photoFolderPath6 = path.join('/var', 'www', 'html', 'static', 'test5', '9639497');
    const cleanLinksNew6 = await downloadAndSaveImages(['https://volgograd.vladis.ru/uploads/catalog/i/lbig/9639497.jpg'], photoFolderPath6);

    const photoFolderPath7 = path.join( 'static', 'test6', '9639497');
    const cleanLinksNew7 = await downloadAndSaveImages(['https://volgograd.vladis.ru/uploads/catalog/i/lbig/9639497.jpg'], photoFolderPath7);

    const photoFolderPath8 = path.join(__dirname,'/var', 'www', 'html', 'static', 'test7', '9639497');
    const cleanLinksNew8 = await downloadAndSaveImages(['https://volgograd.vladis.ru/uploads/catalog/i/lbig/9639497.jpg'], photoFolderPath8);

    const photoFolderPath9 = path.join(__dirname,'/var', 'www', 'html', 'static', 'test8', '9639497');
    const cleanLinksNew9 = await downloadAndSaveImages(['https://volgograd.vladis.ru/uploads/catalog/i/lbig/9639497.jpg'], photoFolderPath9);

    const photoFolderPath10 = path.join(__dirname,'var', 'www', 'html', 'static', 'test9', '9639497');
    const cleanLinksNew10 = await downloadAndSaveImages(['https://volgograd.vladis.ru/uploads/catalog/i/lbig/9639497.jpg'], photoFolderPath10);

}

start()