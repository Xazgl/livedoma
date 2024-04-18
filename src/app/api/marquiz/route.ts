import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";
import { Marquiz, crmAnswer } from "../../../../@types/dto";
import { managerFind, sendIntrumCrmTilda } from "@/lib/intrumCrm";

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method == "POST") {
    try {
      let crmAnswer: crmAnswer = {
        status: "no",
        data: {
           customer:'',
           request:''
        }
      };

      const answer: Marquiz = await req.json();
      // console.log(answer);

      //@ts-ignore
      if (answer) {
        const name = answer.contacts.name;
        const phone = answer.contacts.phone;
        const formid = answer.form.id ? answer.form.id : "Нету";
        let utm_medium = "";
        let utm_campaign = "";
        let utm_content = "";
        let utm_term = "";

        if (answer.extra.utm) {
          utm_medium = answer.extra.utm.medium ? answer.extra.utm.medium : "";
          utm_campaign = answer.extra.utm.campaign? answer.extra.utm.campaign: "";
          utm_content = answer.extra.utm.content? answer.extra.utm.content: "";
          utm_term = answer.extra.utm.term ? answer.extra.utm.term : "";
        }
        
        // Функция для формирования строки
        function formatQuestionsAndAnswers(answer: Marquiz) {
          let resultString = "";
          answer.answers.forEach((answer) => {
            // Добавление вопроса и ответа к результату
            resultString += `${answer.q} '${answer.a}'`;
            // Добавление пробела после каждой связки вопроса и ответа
            resultString += ", ";
          });
          // Удаление лишнего пробела в конце строки
          resultString = resultString.trim();
          return resultString;
        }
        const textAnswers = formatQuestionsAndAnswers(answer);

        try {

          const manager = await managerFind()
          const newContact = await db.tilda.create({
            data: {
              name: name,
              phone: phone,
              formid: formid,
              typeSend: "Marquiz",
              utm_medium: utm_medium,
              utm_campaign: utm_campaign,
              utm_content: utm_content,
              utm_term: utm_term,
              sendCrm: false,
              answers: textAnswers,
              managerId: manager && manager !==''? manager : "Ошибка в выборе менеджера"
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
                intrumId: crmAnswer.data.request.toString(),
                intrumUrl: `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${crmAnswer.data.request.toString()}#request`,
              },
            });

            const queue = await db.wazzup.create({
              data: {
                name: '',
                phone: '',
                text: '',
                typeSend: 'Очередь',
                sendCrm: false,
                managerId: manager && manager !==''? manager : "Ошибка в выборе менеджера"
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
