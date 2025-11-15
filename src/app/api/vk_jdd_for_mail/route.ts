import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";
import { VKLeadFormEvent, crmAnswer } from "../../../../@types/dto";
import { doubleFindVK } from "@/lib/doubleFind";
import {
  formatVkQuestionsAndAnswers,
  sendIntrumCrVkJdd,
} from "@/lib/intrumCrmVk";
import { managerFindNew } from "@/lib/jdd_queue";

const SECRET = "afe7eea1a58eb43414b91121fcab86d4312a42b4887172";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json("Only POST requests allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const items: VKLeadFormEvent[] = Array.isArray(body) ? body : [body];
    console.log("items с почты", items);

    const results: Array<{ ok: boolean; id?: string; reason?: string }> = [];

    for (const answer of items) {
      try {
        // @ts-ignore
        if (answer?.type === "confirmation" && answer?.group_id === 227531577) {
          results.push({ ok: true, reason: "confirmation" });
          continue;
        }
        if (!answer?.object || answer?.secret !== SECRET) {
          results.push({ ok: false, reason: "bad secret or no object" });
          continue;
        }

        const res = await handleSingleSequential(answer as any);
        results.push(res);
      } catch (e: any) {
        console.error("handleSingleSequential error:", e);
        results.push({ ok: false, reason: e?.message || "handle error" });
      }
    }

    if (!Array.isArray(body) && results.length === 1) {
      return NextResponse.json(results[0], { status: 200 });
    }
    return NextResponse.json(
      { count: results.length, results },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    // Возвращаем ok, чтобы отправитель не ретраил бесконечно
    return new Response("ok", { status: 200 });
  }
}

async function handleSingleSequential(
  answer: any
): Promise<{ ok: boolean; id?: string; reason?: string }> {
  const manager = await managerFindNew();

  //  приходящий id письма с почты
  const vkMailId: string = String(answer?.vk_mail_id || "").trim();

  // Если передали vkMailId — проверим дубль в БД
  if (vkMailId) {
    const exists = await db.vkApplication.findFirst({
      where: { vkMailId },
    });
    if (exists) {
      console.log(
        `[VK MAIL] duplicate vkMailId=${vkMailId} → existing id=${exists.id}`
      );
      return { ok: true, id: exists.id, reason: "duplicate vkMailId" };
    }
  }

  const userVkID = String(answer.object.user_id ?? "");
  const name = userVkID ? `https://vk.com/id${userVkID}` : "Нету";
  const phone = "Нету заявка с VK";
  const formid = Number(answer.object.form_id ?? 0);
  const formName = (answer?.object?.form_name || "").trim();
  const typeSend = "VK ЖДД";

  const utm_source = "";
  const utm_medium = "";
  const utm_campaign = "";
  const utm_content = "";
  const utm_term = "";

  const answersStr = formatVkQuestionsAndAnswers(answer);

  const newContact = await db.vkApplication.create({
    data: {
      name,
      phone,
      formid,
      typeSend,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      sendCrm: false,
      answers: answersStr ?? null,
      managerId:
        manager && manager !== "" ? manager : "Ошибка в выборе менеджера",
      vkMailId: vkMailId || null,
    },
  });

  console.log("создалась заявка в бд:", { newContact });

  // Intrum (если не «повторка за 24ч»)
  let crmRes: crmAnswer | null = null;
  try {
    crmRes = await sendIntrumCrVkJdd(newContact, false, formName);
    console.log({ crmRes });
  } catch (e) {
    console.error("sendIntrumCrVkJdd failed:", e);
  }

  // обновления в БД и очереди
  if (crmRes && crmRes.status === "success") {
    const intrumId = String(crmRes.data.request);
    const intrumUrl = `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${intrumId}#request`;

    await db.vkApplication.update({
      where: { id: newContact.id },
      data: {
        sendCrm: true,
        intrumId,
        intrumUrl,
      },
    });

      await db.managerQueue.create({
        data: {
          managerId:
            manager && manager !== "" ? manager : "Ошибка в выборе менеджера",
          url: intrumUrl,
          type: typeSend,
        },
      });

    await db.wazzup.create({
      data: {
        name: "",
        phone: "",
        text: "",
        typeSend: "Очередь",
        sendCrm: false,
        managerId:
          manager && manager !== "" ? manager : "Ошибка в выборе менеджера",
      },
    });

    await db.tilda.create({
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
          manager && manager !== "" ? manager : "Ошибка в выборе менеджера",
      },
    });
  }

  return { ok: true, id: newContact.id };
}

// import { NextRequest, NextResponse } from "next/server";
// import db from "../../../../prisma";
// import { VKLeadFormEvent, crmAnswer } from "../../../../@types/dto";
// import { doubleFindVK } from "@/lib/doubleFind";
// import {
//   formatVkQuestionsAndAnswers,
//   sendIntrumCrVkJdd,
// } from "@/lib/intrumCrmVk";
// import { managerFindNew } from "@/lib/jdd_queue";

// const SECRET = "afe7eea1a58eb43414b91121fcab86d4312a42b4887172";

// export async function POST(req: NextRequest) {
//   if (req.method !== "POST") {
//     return NextResponse.json("Only POST requests allowed", { status: 405 });
//   }

//   try {
//     const body = await req.json();
//     const items: VKLeadFormEvent[] = Array.isArray(body) ? body : [body];

//     const results: Array<{ ok: boolean; id?: string; reason?: string }> = [];

//     for (const answer of items) {
//       try {
//         // VK confirmation (на всякий)
//         // @ts-ignore
//         if (answer?.type === "confirmation" && answer?.group_id === 227531577) {
//           results.push({ ok: true, reason: "confirmation" });
//           continue;
//         }
//         if (!answer?.object || answer?.secret !== SECRET) {
//           results.push({ ok: false, reason: "bad secret or no object" });
//           continue;
//         }

//         const res = await handleSingleSequential(answer);
//         results.push(res);
//       } catch (e: any) {
//         console.error("handleSingleSequential error:", e);
//         results.push({ ok: false, reason: e?.message || "handle error" });
//       }
//     }

//     if (!Array.isArray(body) && results.length === 1) {
//       return NextResponse.json(results[0], { status: 200 });
//     }
//     return NextResponse.json({ count: results.length, results }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     // Возвращаем ok, чтобы отправитель не ретраил бесконечно
//     return new Response("ok", { status: 200 });
//   }
// }

// /**
//  * Последовательная обработка одной заявки:
//  * 1) проверка дубля
//  * 2) создание vkApplication
//  * 3) отправка в Intrum (если не «повторка за 24ч»)
//  * 4) обновление vkApplication и постановка в очереди
//  */
// async function handleSingleSequential(
//   answer: VKLeadFormEvent
// ): Promise<{ ok: boolean; id?: string; reason?: string }> {
//   const manager = await managerFindNew();

//   const userVkID = String(answer.object.user_id ?? "");
//   const name = userVkID ? `https://vk.com/id${userVkID}` : "Нету";
//   const phone = "Нету заявка с VK";
//   const formid = Number(answer.object.form_id ?? 0);
//   const formName = (answer?.object?.form_name || "").trim();
//   const typeSend = "VK ЖДД";

//   // UTM пустые — как в твоей логике
//   const utm_source = "";
//   const utm_medium = "";
//   const utm_campaign = "";
//   const utm_content = "";
//   const utm_term = "";

//   const answersStr = formatVkQuestionsAndAnswers(answer);

//   // 1) дубль
//   const double = await doubleFindVK(name, typeSend);

//   // 2) создаём заявку
//   const newContact = await db.vkApplication.create({
//     data: {
//       name,
//       phone,
//       formid,
//       typeSend,
//       utm_source,
//       utm_medium,
//       utm_campaign,
//       utm_content,
//       utm_term,
//       sendCrm: false,
//       answers: answersStr ?? null,
//       managerId:
//         manager && manager !== "" ? manager : "Ошибка в выборе менеджера",
//     },
//   });

//   // 3) Intrum (если не «повторка за 24ч»)
//   let crmRes: crmAnswer | null = null;
//   if (!double.within24Hours) {
//     try {
//       crmRes = await sendIntrumCrVkJdd(newContact, double.isDuplicate, formName);
//     } catch (e) {
//       console.error("sendIntrumCrVkJdd failed:", e);
//     }
//   }

//   // 4) обновления в БД и очереди — последовательно
//   if (crmRes && crmRes.status === "success") {
//     const intrumId = String(crmRes.data.request);
//     const intrumUrl = `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${intrumId}#request`;

//     await db.vkApplication.update({
//       where: { id: newContact.id },
//       data: {
//         sendCrm: true,
//         intrumId,
//         intrumUrl,
//       },
//     });

//     if (!double.isDuplicate) {
//       await db.managerQueue.create({
//         data: {
//           managerId:
//             manager && manager !== "" ? manager : "Ошибка в выборе менеджера",
//           url: intrumUrl,
//           type: typeSend,
//         },
//       });
//     }

//     // очереди как в исходнике
//     await db.wazzup.create({
//       data: {
//         name: "",
//         phone: "",
//         text: "",
//         typeSend: "Очередь",
//         sendCrm: false,
//         managerId:
//           manager && manager !== "" ? manager : "Ошибка в выборе менеджера",
//       },
//     });

//     await db.tilda.create({
//       data: {
//         name: "",
//         phone: "",
//         formid: "",
//         typeSend: "Очередь",
//         utm_medium: "",
//         utm_campaign: "",
//         utm_content: "",
//         utm_term: "",
//         sendCrm: false,
//         managerId:
//           manager && manager !== "" ? manager : "Ошибка в выборе менеджера",
//       },
//     });
//   }

//   return { ok: true, id: newContact.id };
// }
