import db from "../../prisma";
import { oldManagerFind } from "./intrumCrm";
import { subDays } from "date-fns";

export async function managerFindNew() {
  try {
    // Период для учёта заявок (последние 15 дней)
    const periodStart = subDays(new Date(), 15);
    
    // Список активных менеджеров
    const managers = await db.activeManagers.findMany({
      where: { company_JDD_active: true },
      select: { manager_id: true },
    });
    
    if (managers.length === 0) {
      return await oldManagerFind();
    }

    // Задаём квоты для нагрузки и ограничения подряд
    const quotaLoad: Record<string, number> = {};
    const maxInRow: Record<string, number> = {};
    
    for (const { manager_id } of managers) {
      if (manager_id === "2753") {
        quotaLoad[manager_id] = 3;
        maxInRow[manager_id] = 1;
      } else if (manager_id === "44") {
        quotaLoad[manager_id] = 3;
        maxInRow[manager_id] = 1;
      } else {
        quotaLoad[manager_id] = 1;
        maxInRow[manager_id] = 1;
      }
    }

    // Считаем заявки только за последний период
    const counts = await db.managerQueue.groupBy({
      by: ["managerId"],
      where: {
        createdAt: { gte: periodStart }
      },
      _count: { managerId: true },
    });
    
    const assignedCount: Record<string, number> = {};
    for (const { managerId, _count } of counts) {
      assignedCount[managerId] = _count.managerId;
    }

    // Проверяем последние назначения (только актуальные)
    const lastAssigned = await db.managerQueue.findMany({
      select: { managerId: true },
      where: {
        createdAt: { gte: periodStart }
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: Math.max(10, ...Object.values(maxInRow)), // Берем больше записей для надежности
    });

    let lastManagerId: string | null = null;
    let consCount = 0;
    
    if (lastAssigned.length > 0) {
      lastManagerId = lastAssigned[0].managerId;
      for (const { managerId } of lastAssigned) {
        if (managerId === lastManagerId) consCount++;
        else break;
      }
    }

    // Формируем список кандидатов
    const allIds = managers.map(m => m.manager_id);
    const eligible = allIds.filter(
      id => !(id === lastManagerId && consCount >= maxInRow[id])
    );
    
    const candidates = eligible.length > 0 ? eligible : allIds;

    // Выбираем менеджера с минимальной нагрузкой
    let bestId = candidates[0];
    let bestScore = Infinity;
    
    for (const id of candidates) {
      const cnt = assignedCount[id] ?? 0;
      const score = cnt / quotaLoad[id];
      
      if (score < bestScore) {
        bestScore = score;
        bestId = id;
      }
    }

    return bestId;
  } catch (error) {
    console.error("Error in managerFind:", error);
    return await oldManagerFind();
  }
}
// export async function managerFindNew() {
//   try {
//     // Список активных менеджеров
//     const managers = await db.activeManagers.findMany({
//       where: { company_JDD_active: true },
//       select: { manager_id: true },
//     });
    
//     if (managers.length === 0) {
//       await oldManagerFind();
//     }

//     // Задаём квоты для нагрузки и ограничения подряд
//     const quotaLoad: Record<string, number> = {};
//     const maxInRow: Record<string, number> = {};
    
//     for (const { manager_id } of managers) {
//       // Орлова: квота 3, но не более 1 подряд
//       if (manager_id === "2753") {
//         quotaLoad[manager_id] = 3;
//         maxInRow[manager_id] = 1;
//       } 
//       // Шепилов: квота 2, но не более 1 подряд
//       else if (manager_id === "44") {
//         quotaLoad[manager_id] = 2;
//         maxInRow[manager_id] = 1;
//       } 
//       // Остальные: квота 1 и не более 1 подряд
//       else {
//         quotaLoad[manager_id] = 1;
//         maxInRow[manager_id] = 1;
//       }
//     }

//     // Считаем общее количество назначенных заявок
//     const counts = await db.managerQueue.groupBy({
//       by: ["managerId"],
//       _count: { managerId: true },
//     });
    
//     const assignedCount: Record<string, number> = {};
//     for (const { managerId, _count } of counts) {
//       assignedCount[managerId] = _count.managerId;
//     }

//     // Проверяем последние назначения
//     const maxAllowedInRow = Math.max(...Object.values(maxInRow));
//     const lastAssigned = await db.managerQueue.findMany({
//       select: { managerId: true },
//       orderBy: [{ createdAt: "desc" }, { id: "desc" }],
//       take: maxAllowedInRow,
//     });

//     let lastManagerId: string | null = null;
//     let consCount = 0;
    
//     if (lastAssigned.length > 0) {
//       lastManagerId = lastAssigned[0].managerId;
//       for (const { managerId } of lastAssigned) {
//         if (managerId === lastManagerId) consCount++;
//         else break;
//       }
//     }

//     // Формируем список кандидатов с учетом ограничений подряд
//     const allIds = managers.map((m) => m.manager_id);
//     const eligible = allIds.filter(
//       (id) => !(id === lastManagerId && consCount >= maxInRow[id])
//     );
    
//     const candidates = eligible.length > 0 ? eligible : allIds;

//     // Выбираем менеджера с минимальной нагрузкой
//     let bestId = candidates[0];
//     let bestScore = Infinity;
    
//     for (const id of candidates) {
//       const cnt = assignedCount[id] ?? 0;
//       const score = cnt / quotaLoad[id];
      
//       if (score < bestScore) {
//         bestScore = score;
//         bestId = id;
//       }
//     }

//     return bestId;
//   } catch (error) {
//     console.error("Error in managerFind:", error);
//     return await oldManagerFind();
//   }
// }

// export async function managerFindNew() {
//   try {
//     //Список активных менеджеров
//     const managers = await db.activeManagers.findMany({
//       where: { company_JDD_active: true },
//       select: { manager_id: true },
//     });
//     if (managers.length === 0) {
//       await oldManagerFind();
//     }

//     // Задаём квоты
//     const quotas: Record<string, number> = {};
//     for (const { manager_id } of managers) {
//       quotas[manager_id] =
//         manager_id === "2753" ? 3 : manager_id === "44" ? 2 : 1;
//     }

//     // Считаем, сколько заявок уже отдали каждому менеджеру
//     const counts = await db.managerQueue.groupBy({
//       by: ["managerId"],
//       _count: { managerId: true },
//     });
//     const assignedCount: Record<string, number> = {};
//     for (const { managerId, _count } of counts) {
//       assignedCount[managerId] = _count.managerId;
//     }

//     // Определяем, сколько подряд в конце получил последний менеджер
//     const maxQuota = Math.max(...Object.values(quotas));
//     const lastAssigned = await db.managerQueue.findMany({
//       select: { managerId: true },
//       orderBy: [{ createdAt: "desc" }, { id: "desc" }],
//       take: maxQuota,
//     });

//     let lastManagerId: string | null = null;
//     let consCount = 0;
//     if (lastAssigned.length > 0) {
//       lastManagerId = lastAssigned[0].managerId;
//       for (const { managerId } of lastAssigned) {
//         if (managerId === lastManagerId) consCount++;
//         else break;
//       }
//     }

//     // 5) Фильтруем тех, кто уже получил свою квоту подряд
//     const allIds = managers.map((m) => m.manager_id);
//     const eligible = allIds.filter(
//       (id) => !(id === lastManagerId && consCount >= quotas[id])
//     );
//     const candidates = eligible.length > 0 ? eligible : allIds;

//     // 6) Выбираем менеджера с минимальным отношением (выдано / квота)
//     let bestId = candidates[0];
//     let bestScore = Infinity;
//     for (const id of candidates) {
//       const cnt = assignedCount[id] ?? 0;
//       const score = cnt / quotas[id];
//       if (score < bestScore) {
//         bestScore = score;
//         bestId = id;
//       }
//     }

//     return bestId;
//   } catch (error) {
//     console.error("Error in managerFind:", error);
//     await oldManagerFind();
//   }
// }
