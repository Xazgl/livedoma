/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://mls-vlg.ru',
    generateRobotsTxt: true,        // Генерация robots.txt вместе с sitemap
    sitemapSize: 5000,              // Максимальное количество URL в одном файле карты сайта
    outDir: './public',             // Директория, в которую будет сохранена карта сайта
  }