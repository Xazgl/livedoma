import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";
import { Tilda, crmAnswer } from "../../../../@types/dto";

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
        const { tranid, formid, formname, ...surveyData } = answer;

        const name = JSON.stringify(surveyData) ?? 'нету';
        const utm_medium = answer.utm_medium ? answer.utm_medium : "";
        const utm_campaign = answer.utm_campaign ? answer.utm_campaign : "";
        const utm_content = answer.utm_content ? answer.utm_content : "";
        const utm_term = answer.utm_term ? answer.utm_term : "";
        const utm_source = answer.utm_source ? answer.utm_source : "";

        try {
          const newContact = await db.tilda.create({
            data: {
              name: name,
              phone: 'нету у формы',
              formid: formid,
              typeSend: "Tilda Опрос ОП",
              utm_source: utm_source,
              utm_medium: utm_medium,
              utm_campaign: utm_campaign,
              utm_content: utm_content,
              utm_term: utm_term,
              sendCrm: false,
              managerId: "У этих заявок нету",
            },
            
          });

          return NextResponse.json(
            { crmStatus: crmAnswer, contacts: newContact },
            { status: 200 }
          );
        } catch (error) {
          return new Response(`Ошибка создания контакта`, {
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
