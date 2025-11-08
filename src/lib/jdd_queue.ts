import db from "../../prisma";
import { oldManagerFind } from "./intrumCrm";
import { subDays } from "date-fns";

/**
 * Распределение заявок по «дефицитному» алгоритму в окне последних PERIOD_DAYS дней
 * Правила:
 *  - Никто не может получать две заявки подряд (если есть альтернатива)
 *  - Важность: Орлова (2753) ×3, Шепилов (44) ×2, остальные ×1
 *  - Окно баланса: 7 дней (оптимально при 25–30 заявках/неделю)
 *  - Исключаемые типы из рассчета: ["VK ЖДД", "Wazzup", "Marquiz Сансара", "whatsapp"]
 */
export async function managerFindNew(): Promise<string> {
  try {
    const EXCLUDED_TYPES = ["VK ЖДД", "Wazzup", "Marquiz Сансара", "whatsapp"];
    const PERIOD_DAYS = 7;

    // Веса: Орлова×3, Шепилов×2, остальные×1
    const WEIGHTS: Record<string, number> = {
      // "2753": 3, // Орлова
      //  "44": 2, // Шепилов

      //TODO:временное решение
      "353": 2, // Бородина
      "1140": 2, // Трофимов
      "332": 2, //	Максимова
    };
    const weightOf = (id: string) => WEIGHTS[id] ?? 1;

    const periodStart = subDays(new Date(), PERIOD_DAYS);

    // Активные менеджеры
    const managers = await db.activeManagers.findMany({
      where: { company_JDD_active: true },
      select: { manager_id: true },
    });
    if (!managers || managers.length === 0) {
     return await oldManagerFind() ?? '';
    }

    const allIds = managers.map((m) => String(m.manager_id));

    // Последний назначенный (для запрета «две подряд»)
    const last = await db.managerQueue.findFirst({
      where: { type: { notIn: EXCLUDED_TYPES } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: { managerId: true },
    });
    const lastId: string | null = last ? String(last.managerId) : null;

    // Счётчики за окно
    const grouped = await db.managerQueue.groupBy({
      by: ["managerId"],
      where: {
        createdAt: { gte: periodStart },
        type: { notIn: EXCLUDED_TYPES },
        managerId: { in: allIds },
      },
      _count: { managerId: true },
    });

    const assignedCount: Record<string, number> = {};
    let totalInWindow = 0;
    for (const row of grouped) {
      const id = String(row.managerId);
      const c = row._count.managerId;
      assignedCount[id] = c;
      totalInWindow += c;
    }

    // Последние времена за окно — для тай-брейка
    const lastTimesRows = await db.managerQueue.groupBy({
      by: ["managerId"],
      where: {
        createdAt: { gte: periodStart },
        type: { notIn: EXCLUDED_TYPES },
        managerId: { in: allIds },
      },
      _max: { createdAt: true },
    });
    const lastTimeMap: Record<string, Date | null> = {};
    for (const r of lastTimesRows) {
      lastTimeMap[String(r.managerId)] = (r as any)._max?.createdAt ?? null;
    }

    // Кандидаты (учитываем запрет «две подряд», если есть альтернатива)
    let candidates = allIds.slice();
    if (lastId) {
      const withoutLast = candidates.filter((id) => id !== lastId);
      if (withoutLast.length > 0) candidates = withoutLast;
    }
    if (candidates.length === 0) {
      return await oldManagerFind() ?? '';
    }

    // Сумма весов активных менеджеров (для долей)
    const sumWeights = allIds.reduce((acc, id) => acc + weightOf(id), 0) || 1;

    // Выбор по максимальному nextDef_i
    let bestId = candidates[0];
    let bestNextDef = -Infinity;
    let bestLastTime: Date | null = null;
    let bestCnt = Number.POSITIVE_INFINITY;

    for (const id of candidates) {
      const w = weightOf(id);
      const p = w / sumWeights;
      const cnt = assignedCount[id] ?? 0;

      // дефицит после гипотетической выдачи
      const nextDef = (totalInWindow + 1) * p - (cnt + 1);

      const lt = lastTimeMap[id] ?? null; 

      let better = false;
      if (nextDef > bestNextDef) {
        better = true;
      } else if (nextDef === bestNextDef) {
        //  последнее назначение 
        if (bestLastTime === null && lt !== null) {
        } else if (bestLastTime !== null && lt === null) {
          better = true;
        } else if (bestLastTime !== null && lt !== null && lt < bestLastTime) {
          better = true;
        } else if (bestLastTime === null && lt === null) {
          // меньший фактический cnt за окно
          if (cnt < bestCnt) {
            better = true;
          } else if (cnt === bestCnt) {
            // детерминизм: меньший id
            if (id < bestId) better = true;
          }
        }
      }

      if (better) {
        bestId = id;
        bestNextDef = nextDef;
        bestLastTime = lt;
        bestCnt = cnt;
      }
    }

    return bestId || (await oldManagerFind() ?? '');
  } catch (e) {
    console.error("Error in managerFindNew:", e);
    return await oldManagerFind() ?? '';
  }
}

// export async function managerFindNew() {
//   try {
//     // Параметры балансировки
//     const EXCLUDED_TYPES = ["VK ЖДД", "Wazzup", 'Marquiz Сансара', 'whatsapp']; // не учитываем в расчётах
//     const PERIOD_DAYS = 15;
//     const ANTI_PINGPONG_WINDOW = 15; // глубина окна последних назначений
//     const MAX_CONSECUTIVE = 1;      // не более 1 подряд одному и тому же

//     const periodStart = subDays(new Date(), PERIOD_DAYS);

//     // Список активных JDD-менеджеров
//     const managers = await db.activeManagers.findMany({
//       where: { company_JDD_active: true },
//       select: { manager_id: true },
//     });
//     if (!managers || managers.length === 0) {
//       return await oldManagerFind();
//     }
//     const allIds = managers.map((m) => m.manager_id);

//     // Нагрузка за период (исключает "VK ЖДД" и "Wazzup")
//     const counts = await db.managerQueue.groupBy({
//       by: ["managerId"],
//       where: {
//         createdAt: { gte: periodStart },
//         type: { notIn: EXCLUDED_TYPES },
//       },
//       _count: { managerId: true },
//     });
//     const assignedCount: Record<string, number> = {};
//     for (const { managerId, _count } of counts) {
//       assignedCount[managerId] = _count.managerId;
//     }

//     // Последние назначения  тоже без исключённых типов
//     const lastAssigned = await db.managerQueue.findMany({
//       select: { managerId: true },
//       where: {
//         createdAt: { gte: periodStart },
//         type: { notIn: EXCLUDED_TYPES },
//       },
//       orderBy: [{ createdAt: "desc" }, { id: "desc" }],
//       take: Math.max(ANTI_PINGPONG_WINDOW, 2),
//     });

//     // consecutive-защита
//     let lastManagerId: string | null = null;
//     let consCount = 0;
//     if (lastAssigned.length > 0) {
//       lastManagerId = lastAssigned[0].managerId;
//       for (const { managerId } of lastAssigned) {
//         if (managerId === lastManagerId) consCount++;
//         else break;
//       }
//     }

//     // частоты менеджеров в окне
//     const freq = new Map<string, number>();
//     for (const { managerId } of lastAssigned) {
//       freq.set(managerId, (freq.get(managerId) ?? 0) + 1);
//     }
//     // самый частый в окне
//     const worst = [...freq.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

//     // последнее время назначения по каждому менеджеру (для tie-break)
//     const lastTimes = await db.managerQueue.groupBy({
//       by: ["managerId"],
//       where: {
//         createdAt: { gte: periodStart },
//         type: { notIn: EXCLUDED_TYPES },
//       },
//       _max: { createdAt: true },
//     });
//     const lastTimeMap: Record<string, Date | null> = {};
//     for (const row of lastTimes) {
//       lastTimeMap[row.managerId] = (row as any)._max?.createdAt ?? null;
//     }

//     let candidates = allIds.slice();

//     // a) не даём одному и тому же > MAX_CONSECUTIVE раз подряд
//     if (lastManagerId && consCount >= MAX_CONSECUTIVE) {
//       candidates = candidates.filter((id) => id !== lastManagerId);
//       if (candidates.length === 0) candidates = allIds.slice();
//     }

//     // b) убираем «самого частого» в последних N, если есть альтернатива
//     if (worst && candidates.length > 1) {
//       const withoutWorst = candidates.filter((id) => id !== worst);
//       if (withoutWorst.length > 0) {
//         candidates = withoutWorst;
//       }
//     }

//     // выбор по минимальной нагрузке, затем по давности последнего назначения
//     let bestId = candidates[0];
//     let bestScore = Number.POSITIVE_INFINITY;
//     let bestLastTime: Date | null = null;

//     for (const id of candidates) {
//       const cnt = assignedCount[id] ?? 0;
//       const score = cnt; // равные квоты => просто по количеству
//       const lt = lastTimeMap[id] ?? null; // null = очень давно/никогда — приоритетнее

//       let better = false;
//       if (score < bestScore) {
//         better = true;
//       } else if (score === bestScore) {
//         // tie-break: у кого более старое последнее назначение (null приоритетнее)
//         if (bestLastTime === null && lt !== null) {
//           // уже лучший — ничего
//         } else if (bestLastTime !== null && lt === null) {
//           better = true;
//         } else if (bestLastTime !== null && lt !== null && lt < bestLastTime) {
//           better = true;
//         } else if (bestLastTime === null && lt === null) {
//           // оба null — ещё один tie-break по id, чтобы был детерминизм
//           if (id < bestId) better = true;
//         }
//       }

//       if (better) {
//         bestId = id;
//         bestScore = score;
//         bestLastTime = lt;
//       }
//     }

//     if (!bestId) return await oldManagerFind();
//     return bestId;
//   } catch (error) {
//     console.error("Error in managerFindNew:", error);
//     return await oldManagerFind();
//   }
// }

// export async function managerFindNew() {
//   try {
//     // Период для учёта заявок (последние 15 дней)
//     const periodStart = subDays(new Date(), 15);

//     // Список активных менеджеров
//     const managers = await db.activeManagers.findMany({
//       where: { company_JDD_active: true },
//       select: { manager_id: true },
//     });

//     if (managers.length === 0) {
//       return await oldManagerFind();
//     }

//     // Задаём квоты для нагрузки и ограничения подряд
//     const quotaLoad: Record<string, number> = {};
//     const maxInRow: Record<string, number> = {};

//     for (const { manager_id } of managers) {
//       if (manager_id === "2753") {
//         quotaLoad[manager_id] = 3;
//         maxInRow[manager_id] = 1;
//       } else if (manager_id === "44") {
//         quotaLoad[manager_id] = 3;
//         maxInRow[manager_id] = 1;
//       } else {
//         quotaLoad[manager_id] = 1;
//         maxInRow[manager_id] = 1;
//       }
//     }

//     // Считаем заявки только за последний период
//     const counts = await db.managerQueue.groupBy({
//       by: ["managerId"],
//       where: {
//         createdAt: { gte: periodStart }
//       },
//       _count: { managerId: true },
//     });

//     const assignedCount: Record<string, number> = {};
//     for (const { managerId, _count } of counts) {
//       assignedCount[managerId] = _count.managerId;
//     }

//     // Проверяем последние назначения (только актуальные)
//     const lastAssigned = await db.managerQueue.findMany({
//       select: { managerId: true },
//       where: {
//         createdAt: { gte: periodStart }
//       },
//       orderBy: [{ createdAt: "desc" }, { id: "desc" }],
//       take: Math.max(10, ...Object.values(maxInRow)), // Берем больше записей для надежности
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

//     // Формируем список кандидатов
//     const allIds = managers.map(m => m.manager_id);
//     const eligible = allIds.filter(
//       id => !(id === lastManagerId && consCount >= maxInRow[id])
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
