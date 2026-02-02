import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";
import { Message, MessagesResponse, crmAnswer } from "../../../../@types/dto";
import sendIntrumCrm from "@/lib/intrumCrm";
import { doubleFind } from "@/lib/doubleFind";
import { normalizeWazzupNumber } from "@/lib/phoneMask";
import { determineProjectType, ProjectType } from "@/lib/wazzup";
import sendIntrumCrmWazzupJD from "@/lib/intrumCrmWazzupJd";
import sendIntrumCrmWazzupSansara from "@/lib/intrumCrmWazzupSansara";
import createIntrumTask from "@/lib/createTasks";
// import { managerFindNew } from "@/lib/jdd_queue";

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
      const answer: MessagesResponse = await req.json();
      console.log(answer);
      if (answer.messages) {
        const messages: Message[] = answer.messages;
        const allContacts = await Promise.all(
          messages.map(async (message) => {
            const chanelId = message.channelId;
            const isMailingChannel =
              chanelId === "c61e632e-b93a-4101-a9b9-31b72291db0a";

            if (message.chatId && message.status === "inbound") {
              //  const manager = await managerFindNew();
              const manager = "44";
              const name = message.contact.name ? message.contact.name : "Нету";
              // const phone = message.authorName;
              const phone = await normalizeWazzupNumber(message.chatId);
              const phoneInUsersMailing = await db.usersForMailing.findFirst({
                where: {
                  phoneNumber: phone,
                },
                select: { id: true, type: true },
              });

              if (!phoneInUsersMailing?.id && isMailingChannel) {
                return new Response(
                  "'Запрос не может быть выполнен номер с канала рассылки без списка'",
                  { status: 400 }
                );
              }

              const chatType = message.chatType ? message.chatType : "Нету";
              const text = message.text ? message.text : "Нету";

              const type = phoneInUsersMailing?.type as ProjectType;

              const projectType: ProjectType = isMailingChannel
                ? type
                : await determineProjectType(text);

              if (phone !== "Admin") {
                try {
                  let double = await doubleFind(phone);

                  const newContact = await db.wazzup.create({
                    data: {
                      name: name,
                      phone: phone,
                      text: text,
                      typeSend: chatType,
                      sendCrm: false,
                      managerId: manager
                        ? manager
                        : "Ошибка в выборе менеджера",
                    },
                  });

                  if (double.within24Hours == false) {
                    if (
                      (projectType == "ЖДД" ||
                        projectType == "Не определено") &&
                      !isMailingChannel
                    ) {
                      crmAnswer = await sendIntrumCrm(
                        newContact,
                        double.isDuplicate,
                        isMailingChannel
                      );
                      console.log(crmAnswer);
                    }

                    if (projectType == "ЖД" && !isMailingChannel) {
                      crmAnswer = await sendIntrumCrmWazzupJD(
                        newContact,
                        double.isDuplicate,
                        isMailingChannel
                      );
                      console.log(crmAnswer);
                    }

                    if (projectType == "Сансара" && !isMailingChannel) {
                      crmAnswer = await sendIntrumCrmWazzupSansara(
                        newContact,
                        double.isDuplicate,
                        isMailingChannel
                      );
                      console.log(crmAnswer);
                    }

                    if (isMailingChannel) {
                      crmAnswer = await createIntrumTask(newContact, projectType);
                    }
                    const url = isMailingChannel
                      ? `https://jivemdoma.intrumnet.com/crm/tools/#task_${crmAnswer.data.request.toString()}`
                      : `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${crmAnswer.data.request.toString()}#request`;

                    if (crmAnswer.status == "success") {
                      console.log(crmAnswer);
                      const updateStatus = await db.wazzup.update({
                        where: {
                          id: newContact.id,
                        },
                        data: {
                          sendCrm: true,
                          intrumId: crmAnswer.data.request.toString(),
                          intrumUrl: url,
                        },
                      });

                      if (double.isDuplicate == false && !isMailingChannel) {
                        await db.managerQueue.create({
                          data: {
                            managerId: manager
                              ? manager
                              : "Ошибка в выборе менеджера",
                            url: `https://jivemdoma.intrumnet.com/crm/tools/exec/request/${crmAnswer.data.request.toString()}#request`,
                            type: "Wazzup",
                          },
                        });
                      }

                      const queue = await db.tilda.create({
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
                          managerId: manager
                            ? manager
                            : "Ошибка в выборе менеджера",
                        },
                      });
                    }
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
                return new Response(
                  `Это  ${phone}. Значит автоматический ответ и не сохраняем его`,
                  {
                    status: 400,
                  }
                );
              }
            } else {
              console.log(
                "Исходящие сообщение или входящие c рассылки",
                JSON.stringify(message)
              );
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
