import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";
import { Tilda, crmAnswer } from "../../../../@types/dto";
import { sendIntrumCrmTilda } from "@/lib/intrumCrm";

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method == "POST") {
    try {
      let crmAnswer: crmAnswer = {
        status: "no",
        data: [],
      };
    
      const answer: Tilda  = await req.json();
      console.log(answer)

      //@ts-ignore
      if (answer.test == null) {
        const name = answer.name ? answer.name : "Нету";
        const phone = answer.Phone;
        const formid = answer.formid ? answer.formid : "Нету";
        const utm_medium = answer.utm_medium ? answer.utm_medium : "";
        const utm_campaign = answer.utm_campaign ? answer.utm_campaign : "";
        const utm_content = answer.utm_content ? answer.utm_content : "";
        const utm_term = answer.utm_term ? answer.utm_term : "";

        try {
          const newContact = await db.tilda.create({
            data: {
              name: name,
              phone: phone,
              formid: formid,
              typeSend:'Tilda',
              utm_medium: utm_medium,
              utm_campaign: utm_campaign,
              utm_content: utm_content,
              utm_term: utm_term,
              sendCrm: false,
            },
          });

          crmAnswer = await sendIntrumCrmTilda(newContact);

          if (crmAnswer.status == "success") {
            const updateStatus = await db.tilda.update({
              where: {
                id: newContact.id,
              },
              data: {
                sendCrm: true,
              },
            });
          }

          return NextResponse.json(
            { crmStatus: crmAnswer, contacts: newContact },
            { status: 200 }
          );

        } catch (error) {
          return new Response(`Ошибка создания контакта ${phone}`, {
            status: 400,
          });
        }
      } else {
        return new Response(`Тело запроса не получено или тестовый запрос `, {status: 200,});
      }

    } catch (error) {
      console.error(error);
      return new Response("'Запрос не может быть выполнен'", { status: 500 });
    }

  } else {
    return NextResponse.json("Only POST requests allowed", { status: 405 });
  }

}
