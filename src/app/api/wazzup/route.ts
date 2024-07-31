import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";
import { Message, MessagesResponse, crmAnswer } from "../../../../@types/dto";
import sendIntrumCrm, { managerFind } from "@/lib/intrumCrm";
import { doubleFind } from "@/lib/doubleFind";
import { normalizeWazzupNumber } from "@/lib/phoneMask";

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
      const answer: MessagesResponse = await req.json();
      console.log(answer);
      if (answer.messages) {
        const messages: Message[] = answer.messages;
        const allContacts = await Promise.all(
          messages.map(async (message) => {
            if (message.chatId) {
              const manager = await managerFind()
              console.log({managerid:manager} )
              const name = message.contact.name ? message.contact.name : "Нету";
              // const phone = message.authorName;
              const phone = await normalizeWazzupNumber(message.chatId);
              const chatType = message.chatType ? message.chatType : "Нету";
              const text = message.text ? message.text : "Нету";
              if (phone !== "Admin") {
                try {
                  
                  let double = await doubleFind(phone)

                  const newContact = await db.wazzup.create({
                    data: {
                      name: name,
                      phone: phone,
                      text: text,
                      typeSend: chatType,
                      sendCrm: false,
                      managerId: manager && manager !==''? manager : "Ошибка в выборе менеджера"
                    },
                  });

                  crmAnswer = await sendIntrumCrm(newContact, double);
                  console.log(crmAnswer)

                  if (crmAnswer.status == "success") {
                    console.log(crmAnswer)
                    const updateStatus = await db.wazzup.update({
                      where: {
                        id: newContact.id,
                      },
                      data: {
                        sendCrm: true,
                        intrumId: crmAnswer.data.request.toString(),
                        intrumUrl: `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${crmAnswer.data.request.toString()}#request`,
                      },
                    });

                    await db.managerQueue.create({
                      data: {
                        managerId:
                          manager && manager !== ""
                            ? manager
                            : "Ошибка в выборе менеджера",
                          url:  `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${crmAnswer.data.request.toString()}#request`,
                          type  : 'Wazzup'
                      }
                    });


                    const queue = await db.tilda.create({
                      data: {
                        name: '',
                        phone:'',
                        formid: '',
                        typeSend:'Очередь',
                        utm_medium: '',
                        utm_campaign: '',
                        utm_content:'',
                        utm_term: '',
                        sendCrm: false,
                        managerId: manager && manager !==''? manager : "Ошибка в выборе менеджера"
                      }
                    })
                  }

                } catch (error) {
                  return new Response(`Ошибка создания контакта ${phone}`, {
                    status: 400,
                  });
                }
              } else {
                return new Response(
                  `Это  ${phone}. Значит автоматический ответ и не сохраняем его`,
                  {
                    status: 400,
                  }
                );
              }
            }
          })
        );

        return NextResponse.json(
          { crmStatus: crmAnswer, contacts: allContacts },
          { status: 200 }
        );
      } else {
        return NextResponse.json("Это был тестовый запрос", { status: 200 });
      }
    } catch (error) {
      console.error(error);
      return new Response("'Запрос не может быть выполнен'", { status: 500 });
    }
  } else {
    return NextResponse.json("Only POST requests allowed", { status: 405 });
  }
}



