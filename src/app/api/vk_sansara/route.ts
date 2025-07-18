import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";
import { VKLeadFormEvent, crmAnswer } from "../../../../@types/dto";
import { managerFindSansara } from "@/lib/intrumSansaraCrm";
import { doubleFindVK } from "@/lib/doubleFind";
import {
  formatVkQuestionsAndAnswers,
  sendIntrumCrmVKSansara,
} from "@/lib/intrumCrmVk";
import { sendVKLeadNotification } from "@/lib/mail";

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method == "POST") {
    try {
      const answer: VKLeadFormEvent = await req.json();
      console.log(answer);

      // Если тестовый запрос
      //@ts-ignore
      if (answer?.type === "confirmation" && answer?.group_id === 226332949) {
        return new Response(`0244c303`, { status: 200 });
      }

      // Сразу отправляем "ok" VK
      const okResponse = new Response("ok", { status: 200 });

      const secret = "f32fd109dc6dfb3aa2a382362af8ce31cb846d0a227364";

      if (answer.object && answer.secret === secret) {
        // Запускаем обработку в фоне
        processSansaraApplicationAsync(answer).catch(console.error);
        sendEmailNotificationAsync(answer).catch(console.error);
      }

      return okResponse;
    } catch (error) {
      console.error(error);
      // В случае ошибки все равно отправляем "ok"
      return new Response("ok", { status: 200 });
    }
  } else {
    return NextResponse.json("Only POST requests allowed", { status: 405 });
  }
}

// функция для обработки заявки Сансары
async function processSansaraApplicationAsync(answer: VKLeadFormEvent) {
  try {
    const manager = await managerFindSansara();
    const userVkID = answer.object.user_id.toString();
    const name = userVkID ? `https://vk.com/id${userVkID}` : "Нету";
    const phone = "Нету заявка с VK";
    const formid = answer.object.form_id;
    const utm_medium = "";
    const utm_campaign = "";
    const utm_content = "";
    const utm_term = "";
    const utm_source = "";
    const formName = answer?.object.form_name.trim() ?? "";
    const typeSend = "VK Сансара";
    const answers = formatVkQuestionsAndAnswers(answer);

    // Проверка дубля перед основной обработкой
    const recentDuplicate = await db.vkApplication.findFirst({
      where: {
        name: name,
        typeSend: typeSend,
        formid: formid,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // Проверяем дубли за последние 5 минут
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (recentDuplicate) {
      console.log("Обнаружен недавний дубль заявки:", recentDuplicate.id);
      return;
    }

    let double = await doubleFindVK(name, typeSend);

    const newContact = await db.vkApplication.create({
      data: {
        name: name,
        phone: phone,
        formid: formid,
        typeSend: typeSend,
        utm_source: utm_source,
        utm_medium: utm_medium,
        utm_campaign: utm_campaign,
        answers: answers ?? null,
        utm_content: utm_content,
        utm_term: utm_term,
        sendCrm: false,
        managerId:
          manager && manager !== "" ? manager : "Ошибка в выборе менеджера",
      },
    });

    if (double.within24Hours == false) {
      const crmAnswer = await sendIntrumCrmVKSansara(
        newContact,
        double.isDuplicate,
        formName
      );

      if (crmAnswer.status == "success") {
        await db.vkApplication.update({
          where: {
            id: newContact.id,
          },
          data: {
            sendCrm: true,
            intrumId: crmAnswer.data.request.toString(),
            intrumUrl: `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${crmAnswer.data.request.toString()}#request`,
          },
        });

        if (double.isDuplicate == false) {
          await db.managerQueue.create({
            data: {
              managerId:
                manager && manager !== ""
                  ? manager
                  : "Ошибка в выборе менеджера",
              url: `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${crmAnswer.data.request.toString()}#request`,
              type: typeSend,
            },
          });
        }

        // Создаем записи в очередях параллельно
        await Promise.all([
          db.wazzup.create({
            data: {
              name: "",
              phone: "",
              text: "",
              typeSend: "Очередь",
              sendCrm: false,
              managerId:
                manager && manager !== ""
                  ? manager
                  : "Ошибка в выборе менеджера",
            },
          }),
          db.tilda.create({
            data: {
              name: "",
              phone: "",
              formid: "",
              typeSend: "Очередь",
              utm_medium: "",
              utm_campaign: "",
              utm_content: "",
              utm_term: "",
              sendCrm: false,
              managerId:
                manager && manager !== ""
                  ? manager
                  : "Ошибка в выборе менеджера",
            },
          }),
        ]);
      }
    }
  } catch (error) {
    console.error("Ошибка при обработке заявки Сансара:", error);
  }
}

// функция для отправки на почту
async function sendEmailNotificationAsync(answer: VKLeadFormEvent) {
  try {
    const managerEmail = "info@jivem-doma.ru";
    const additionalEmails = ["ldomofon-sericel@rambler.ru"];
    const type = "VK Сансара"; 

    await sendVKLeadNotification(answer, type, managerEmail, additionalEmails);
  } catch (error) {
    console.error("Ошибка при отправке email уведомления:", error);
  }
}

//вариант 2
// export async function POST(req: NextRequest, res: NextResponse) {
//   if (req.method == "POST") {
//     try {
//       let crmAnswer: crmAnswer = {
//         status: "no",
//         data: {
//           customer: "",
//           request: "",
//         },
//       };
//       const answer: VKLeadFormEvent = await req.json();
//       console.log(answer);

//       // Если тестовый запрос
//       //@ts-ignore
//       if (answer?.type === "confirmation" && answer?.group_id === 226332949) {
//         return new Response(`0244c303`, {
//           status: 200,
//         });
//       }
//       const secret = "f32fd109dc6dfb3aa2a382362af8ce31cb846d0a227364";

//       //@ts-ignore
//       if (answer.lead_id == null && answer.secret === secret) {
//         const manager = await managerFindSansara();
//         const userVkID = answer.object.user_id.toString();
//         const name = userVkID ? `https://vk.com/id${userVkID}` : "Нету";
//         const phone = "Нету заявка с VK";
//         const formid = answer.object.form_id;
//         const utm_medium = "";
//         const utm_campaign = "";
//         const utm_content = "";
//         const utm_term = "";
//         const utm_source = "";
//         const formName = answer?.object.form_name.trim() ?? "";
//         const typeSend = "VK Сансара";
//         const answers = formatVkQuestionsAndAnswers(answer);

//         // Добавленная проверка дубля перед основной обработкой
//         // const recentDuplicate = await db.vkApplication.findFirst({
//         //   where: {
//         //     name: name,
//         //     typeSend: typeSend,
//         //     formid: formid,
//         //     createdAt: {
//         //       gte: new Date(Date.now() - 5 * 60 * 1000), // Проверяем дубли за последние 5 минут
//         //     },
//         //   },
//         //   orderBy: {
//         //     createdAt: "desc",
//         //   },
//         // });

//         // if (recentDuplicate) {
//         //   console.log("Обнаружен недавний дубль заявки:", recentDuplicate.id);
//         //   return NextResponse.json(
//         //     { answer: "Повторный дубль, отправленный подряд" },
//         //     { status: 200 }
//         //   );
//         // }

//         try {
//           let double = await doubleFindVK(name, typeSend);

//           const newContact = await db.vkApplication.create({
//             data: {
//               name: name,
//               phone: phone,
//               formid: formid,
//               typeSend: typeSend,
//               utm_source: utm_source,
//               utm_medium: utm_medium,
//               utm_campaign: utm_campaign,
//               answers: answers ?? null,
//               utm_content: utm_content,
//               utm_term: utm_term,
//               sendCrm: false,
//               managerId:
//                 manager && manager !== ""
//                   ? manager
//                   : "Ошибка в выборе менеджера",
//             },
//           });

//           if (double.within24Hours == false) {
//             crmAnswer = await sendIntrumCrmVKSansara(
//               newContact,
//               double.isDuplicate,
//               formName
//             );

//             if (crmAnswer.status == "success") {
//               const updateStatus = await db.vkApplication.update({
//                 where: {
//                   id: newContact.id,
//                 },
//                 data: {
//                   sendCrm: true,
//                   intrumId: crmAnswer.data.request.toString(),
//                   intrumUrl: `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${crmAnswer.data.request.toString()}#request`,
//                 },
//               });

//               if (double.isDuplicate == false) {
//                 await db.managerQueue.create({
//                   data: {
//                     managerId:
//                       manager && manager !== ""
//                         ? manager
//                         : "Ошибка в выборе менеджера",
//                     url: `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${crmAnswer.data.request.toString()}#request`,
//                     type: typeSend,
//                   },
//                 });
//               }

//               const queue = await db.wazzup.create({
//                 data: {
//                   name: "",
//                   phone: "",
//                   text: "",
//                   typeSend: "Очередь",
//                   sendCrm: false,
//                   managerId:
//                     manager && manager !== ""
//                       ? manager
//                       : "Ошибка в выборе менеджера",
//                 },
//               });

//               const queueTwo = await db.tilda.create({
//                 data: {
//                   name: "",
//                   phone: "",
//                   formid: "",
//                   typeSend: "Очередь",
//                   utm_medium: "",
//                   utm_campaign: "",
//                   utm_content: "",
//                   utm_term: "",
//                   sendCrm: false,
//                   managerId:
//                     manager && manager !== ""
//                       ? manager
//                       : "Ошибка в выборе менеджера",
//                 },
//               });
//             }
//             return NextResponse.json(
//               "ok",
//               // { crmStatus: crmAnswer, contacts: newContact },
//               { status: 200 }
//             );
//           } else {
//             return NextResponse.json(
//               "ok",
//               // { answer: "Повторный дубль, отправленый подряд" },
//               { status: 200 }
//             );
//           }
//         } catch (error) {
//           return new Response(`Ошибка создания контакта ${phone}`, {
//             status: 400,
//           });
//         }
//       } else {
//         return new Response("ok", {
//           status: 200,
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       return new Response("'Запрос не может быть выполнен'", { status: 500 });
//     }
//   } else {
//     return NextResponse.json("Only POST requests allowed", { status: 405 });
//   }
// }

//вариант 1
// export async function POST(req: NextRequest, res: NextResponse) {
//   if (req.method == "POST") {
//     try {
//       let crmAnswer: crmAnswer = {
//         status: "no",
//         data: {
//           customer: "",
//           request: "",
//         },
//       };
//       const answer: VKLeadFormEvent = await req.json();
//       console.log(answer);

//       // Если тестовый запрос
//       //@ts-ignore
//       if (answer?.type === "confirmation" && answer?.group_id === 226332949) {
//         return new Response(`0244c303`, {
//           status: 200,
//         });
//       }
//       const secret = "f32fd109dc6dfb3aa2a382362af8ce31cb846d0a227364";

//       //@ts-ignore
//       if (answer.lead_id == null && answer.secret === secret) {
//         const manager = await managerFindSansara();
//         const userVkID = answer.object.user_id.toString();
//         const name = userVkID ? `https://vk.com/id${userVkID}` : "Нету";
//         const phone = "Нету заявка с VK";
//         const formid = answer.object.form_id;
//         const utm_medium = "";
//         const utm_campaign = "";
//         const utm_content = "";
//         const utm_term = "";
//         const utm_source = "";
//         const formName = answer?.object.form_name.trim() ?? "";
//         const typeSend = "VK Сансара";

//         try {
//           let double = await doubleFindVK(name, typeSend);

//           const newContact = await db.vkApplication.create({
//             data: {
//               name: name,
//               phone: phone,
//               formid: formid,
//               typeSend: typeSend,
//               utm_source: utm_source,
//               utm_medium: utm_medium,
//               utm_campaign: utm_campaign,
//               utm_content: utm_content,
//               utm_term: utm_term,
//               sendCrm: false,
//               managerId:
//                 manager && manager !== ""
//                   ? manager
//                   : "Ошибка в выборе менеджера",
//             },
//           });

//           if (double.within24Hours == false) {
//             crmAnswer = await sendIntrumCrmVKSansara(
//               newContact,
//               double.isDuplicate,
//               formName
//             );

//             if (crmAnswer.status == "success") {
//               const updateStatus = await db.vkApplication.update({
//                 where: {
//                   id: newContact.id,
//                 },
//                 data: {
//                   sendCrm: true,
//                   intrumId: crmAnswer.data.request.toString(),
//                   intrumUrl: `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${crmAnswer.data.request.toString()}#request`,
//                 },
//               });

//               if (double.isDuplicate == false) {
//                 await db.managerQueue.create({
//                   data: {
//                     managerId:
//                       manager && manager !== ""
//                         ? manager
//                         : "Ошибка в выборе менеджера",
//                     url: `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${crmAnswer.data.request.toString()}#request`,
//                     type: typeSend,
//                   },
//                 });
//               }

//               const queue = await db.wazzup.create({
//                 data: {
//                   name: "",
//                   phone: "",
//                   text: "",
//                   typeSend: "Очередь",
//                   sendCrm: false,
//                   managerId:
//                     manager && manager !== ""
//                       ? manager
//                       : "Ошибка в выборе менеджера",
//                 },
//               });

//               const queueTwo = await db.tilda.create({
//                 data: {
//                   name: "",
//                   phone: "",
//                   formid: "",
//                   typeSend: "Очередь",
//                   utm_medium: "",
//                   utm_campaign: "",
//                   utm_content: "",
//                   utm_term: "",
//                   sendCrm: false,
//                   managerId:
//                     manager && manager !== ""
//                       ? manager
//                       : "Ошибка в выборе менеджера",
//                 },
//               });
//             }
//             return NextResponse.json(
//               { crmStatus: crmAnswer, contacts: newContact },
//               { status: 200 }
//             );
//           } else {
//             return NextResponse.json(
//               { answer: "Повторный дубль, отправленый подряд" },
//               { status: 200 }
//             );
//           }
//         } catch (error) {
//           return new Response(`Ошибка создания контакта ${phone}`, {
//             status: 400,
//           });
//         }
//       } else {
//         return new Response(`Тело запроса не получено или тестовый запрос `, {
//           status: 200,
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       return new Response("'Запрос не может быть выполнен'", { status: 500 });
//     }
//   } else {
//     return NextResponse.json("Only POST requests allowed", { status: 405 });
//   }
// }
