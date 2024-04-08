import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";
import { Message, MessagesResponse, crmAnswer } from "../../../../@types/dto";
import sendIntrumCrm from "@/lib/intrumCrm";

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method == "POST") {
    try {
      let crmAnswer: crmAnswer = {
        status: "no",
        data: [],
      };
      const answer: MessagesResponse = await req.json();
      console.log(answer);
      if (answer.messages) {
        const messages: Message[] = answer.messages;
        const allContacts = await Promise.all(
          messages.map(async (message) => {
            if (message.authorName) {
              const name = message.contact.name ? message.contact.name : "Нету";
              const phone = message.authorName;
              const chatType = message.chatType ? message.chatType : "Нету";
              const text = message.text ? message.text : "Нету";
              if (phone !== "Admin") {
                try {
                  const newContact = await db.wazzup.create({
                    data: {
                      name: name,
                      phone: phone,
                      text: text,
                      typeSend: chatType,
                      sendCrm: false,
                    },
                  });

                  crmAnswer = await sendIntrumCrm(newContact);

                  if (crmAnswer.status == "success") {
                    const updateStatus = await db.wazzup.update({
                      where: {
                        id: newContact.id,
                      },
                      data: {
                        sendCrm: true,
                      },
                    });
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
