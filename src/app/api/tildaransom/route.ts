import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";
import { Tilda, crmAnswer } from "../../../../@types/dto";
import { doubleFind } from "@/lib/doubleFind";
import { normalizePhoneNumber } from "@/lib/phoneMask";
import { managerFindRansom, sendIntrumCrmTildaRansom } from "@/lib/intrumRansomCrm";

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method == "POST") {
    try {
      let crmAnswer: crmAnswer = {
        status: "no",
        data: {
          customer: "",
          request: "",
        },
      };

      const answer: Tilda = await req.json();
      console.log(answer);

      //@ts-ignore
      if (answer.test == null) {
        const manager = await managerFindRansom();
        const name = answer.Name
          ? answer.Name
          : answer.name
          ? answer.name
          : "Нету";
        const phone = answer.Phone? await normalizePhoneNumber(answer.Phone) : answer.phone? await normalizePhoneNumber(answer.phone) : '';
        const formid = answer.formid ? answer.formid : "Нету";
        const utm_medium = answer.utm_medium ? answer.utm_medium : "";
        const utm_campaign = answer.utm_campaign ? answer.utm_campaign : "";
        const utm_content = answer.utm_content ? answer.utm_content : "";
        const utm_term = answer.utm_term ? answer.utm_term : "";

        try {
          let double = await doubleFind(phone);

          const newContact = await db.tilda.create({
            data: {
              name: name,
              phone: phone,
              formid: formid,
              typeSend: "Tilda Срочный Выкуп",
              utm_medium: utm_medium,
              utm_campaign: utm_campaign,
              utm_content: utm_content,
              utm_term: utm_term,
              sendCrm: false,
              managerId:
                manager && manager !== ""
                  ? manager
                  : "Ошибка в выборе менеджера",
            },
          });

          if (double.within24Hours == false) {
            crmAnswer = await sendIntrumCrmTildaRansom(
              newContact,
              double.isDuplicate
            );
            console.log(crmAnswer);

            if (crmAnswer.status == "success") {
              await db.tilda.update({
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
                await db.managerRansomQueue.create({
                  data: {
                    managerId:
                      manager && manager !== ""
                        ? manager
                        : "Ошибка в выборе менеджера",
                    url: `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${crmAnswer.data.request.toString()}#request`,
                    type: "Tilda Срочный Выкуп",
                  },
                });
              }
            }
            return NextResponse.json(
              { crmStatus: crmAnswer, contacts: newContact },
              { status: 200 }
            );
          } else {
            return NextResponse.json(
              { answer: "Повторный дубль, отправленый подряд" },
              { status: 200 }
            );
          }
        } catch (error) {
          return new Response(`Ошибка создания контакта ${phone}`, {
            status: 400,
          });
        }
      } else {
        return new Response(`Тело запроса не получено или тестовый запрос `, {
          status: 200,
        });
      }
    } catch (error) {
      console.error(error);
      return new Response("'Запрос не может быть выполнен'", { status: 500 });
    }
  } else {
    return NextResponse.json("Only POST requests allowed", { status: 405 });
  }
}
