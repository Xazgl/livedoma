const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const managersJDD = [
  { name: "Максимова Людмила", id: "332", active: true },
  { name: "Петрухин*", id: "2417", active: true },
  { name: "Политов*", id: "391", active: false },
  { name: "Трофимов", id: "1140", active: false },
  { name: "Исаева", id: "39", active: false },
  { name: "Трубачева", id: "1460", active: false },
  { name: "Бородина", id: "353", active: false },
  { name: "Выходцева", id: "1944", active: false },
  { name: "Ломакин*", id: "2447", active: false },
];


const managersSansara = [
  { name: "Сторожук", id: "1385", active: true },
  { name: "Максимова Людмила", id: "332", active: true },
  { name: "Бочарникова", id: "1767", active: true },
  { name: "Трофимов", id: "1140", active: true },
  { name: "Бородина", id: "353", active: true },
  { name: "Выходцева", id: "1944", active: true },
  { name: "Грубляк*", id: "1829", active: false },
  { name: "Костенко Любовь", id: "1793", active: true },
  { name: "Мартынов", id: "214", active: true },
  { name: "Найданова", id: "190", active: true },
  { name: "Петрова Анна", id: "215", active: true },
  { name: "Попова", id: "1618", active: true },
  { name: "Рубан", id: "1857", active: true },
  { name: "Ткачева", id: "35", active: true },
  { name: "Чеботарева", id: "1232", active: true },
  { name: "Меньшова", id: "230", active: true },
];


async function start() {
    // Обрабатываем массив ЖДД
    for (const manager of managersJDD) {
      const existingManager = await db.activeManagers.findUnique({
        where: { manager_id: manager.id },
      });
  
      if (existingManager) {
        // Если менеджер уже существует, обновляем поле company_JDD_active
        await db.activeManagers.update({
          where: { manager_id: manager.id },
          data: { company_JDD_active: manager.active },
        });
      } else {
        // Если менеджер не найден, создаем новую запись с полем company_JDD_active
        await db.activeManagers.create({
          data: {
            manager_id: manager.id,
            name: manager.name,
            company_JDD_active: manager.active,
            company_Sansara_active:false
          },
        });
      }
    }
  
    // Обрабатываем массив Сансара
    for (const manager of managersSansara) {
      const existingManager = await db.activeManagers.findUnique({
        where: { manager_id: manager.id },
      });
  
      if (existingManager) {
        // Если менеджер уже существует, обновляем поле company_Sansara_active
        await db.activeManagers.update({
          where: { manager_id: manager.id },
          data: { company_Sansara_active: manager.active },
        });
      } else {
        // Если менеджер не найден, создаем новую запись с полем company_Sansara_active
        await db.activeManagers.create({
          data: {
            manager_id: manager.id,
            name: manager.name,
            company_JDD_active: false,
            company_Sansara_active: manager.active,
          },
        });
      }
    }
  
    console.log("Менеджеры были успешно добавлены и обновлены в базе данных.");
  }
  
  start().catch(e => {
    console.error(e);
    process.exit(1);
  });