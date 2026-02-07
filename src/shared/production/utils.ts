import db from "../../../prisma";
import { sharedConstantManagers } from "../constant/manager-constant/constant";
import { SaveProductionQueueParams } from "./type";

/**
 * Возвращает следующего менеджера по производству по принципу очереди
 * Правила:
 * - Если в очереди еще нет заявок — возвращается Орлова
 * - Если последняя заявка была у Орловой — возвращается Шепилов
 * - Если последняя заявка была у Шепилова — возвращается Орлова
 * Очередь формируется на основе последней записи в ManagerQueue
 */
export async function getNextProductionManager(): Promise<string> {
  const { orlova, shepilov } = sharedConstantManagers.productionManagers;

  const lastQueueItem = await db.managerProductionQueue.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!lastQueueItem) {
    return orlova;
  }

  if (lastQueueItem.managerId === orlova) {
    return shepilov;
  }

  return orlova;
}



/**
 * Сохраняет заявку в очередь менеджеров по производству
 * после успешной отправки в CRM.
 * Используется для формирования очереди
 */
export async function saveProductionQueue({
    managerId,
    requestId,
    type,
  }: SaveProductionQueueParams): Promise<void> {
    if (!managerId || managerId === '') {
      throw new Error('managerId is required for production queue');
    }
  
    await db.managerProductionQueue.create({
      data: {
        managerId,
        url:  `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${requestId.toString()}#request`,
        type,
      },
    });
  }