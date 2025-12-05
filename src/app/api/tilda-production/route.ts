import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";
import { Tilda, crmAnswer } from "../../../../@types/dto";
import { doubleFind } from "@/lib/doubleFind";
import { normalizePhoneNumber } from "@/lib/phoneMask";
import { sendIntrumCrmProduction } from "@/lib/intrumCrmProduction";

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
      console.log('production', answer);

      //@ts-ignore
      if (answer.test == null) {
        const name = answer.Name
          ? answer.Name
          : answer.name
          ? answer.name
          : "Нету";
        const phone = await normalizePhoneNumber(answer.Phone);
        const formid = answer.formid ? answer.formid : "Нету";
        const utm_medium = answer.utm_medium ? answer.utm_medium : "";
        const utm_campaign = answer.utm_campaign ? answer.utm_campaign : "";
        const utm_content = answer.utm_content ? answer.utm_content : "";
        const utm_term = answer.utm_term ? answer.utm_term : "";
        const utm_source = answer.utm_source ? answer.utm_source : "";
        const formName = answer?.formname ? answer?.formname.trim() : "";

        const manager = "391";
        try {
          let double = await doubleFind(phone);

          const newContact = await db.tilda.create({
            data: {
              name: name,
              phone: phone,
              formid: formid,
              typeSend: "Tilda",
              utm_source: utm_source,
              utm_medium: utm_medium,
              utm_campaign: utm_campaign,
              utm_content: utm_content,
              utm_term: utm_term,
              sendCrm: false,
              managerId: manager,
            },
          });

          console.log('production newContact', newContact);

          if (double.within24Hours == false) {
            crmAnswer = await sendIntrumCrmProduction(
              newContact,
              double.isDuplicate,
              formName
            );

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
