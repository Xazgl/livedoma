import nodemailer from "nodemailer";
import { VKLeadFormEvent } from "../../@types/dto";

const transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: "e-16757995@yandex.ru",
    pass: "afwrhpankjlerydv",
  },
});

export async function sendVKLeadNotification(
  leadData: VKLeadFormEvent,
  type: "VK ЖДД" | "VK Сансара",
  managerEmail: string,
  additionalEmails?: string[]
): Promise<void> {
  try {
    // Формируем текст письма
    const formattedAnswers = leadData.object.answers
      .map((answer) => {
        const answerText = Array.isArray(answer.answer)
          ? answer.answer.join(", ")
          : answer.answer;
        return `• ${answer.question}: ${answerText}`;
      })
      .join("\n");

    const emailText = `
  Новая заявка из (${type}):
  
  📌 Форма: ${leadData.object.form_name}
  🆔 ID заявки: ${leadData.object.lead_id}
  👤 Пользователь: https://vk.com/id${leadData.object.user_id}
  📅 Дата: ${new Date().toLocaleString("ru-RU")}
  
  📋 Детали заявки:
  ${formattedAnswers}
  
  Система автоматически обработала заявку.
  `;

    // Отправляем письмо
    const recipients = [managerEmail, ...(additionalEmails || [])].filter(
      Boolean
    );

    const mailOptions = {
      from: "e-16757995@yandex.ru",
      to: recipients,
      subject: `Новая заявка ${type}: ${leadData.object.form_name}`,
      text: emailText,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Уведомление о заявке ${leadData.object.lead_id} отправлено`);
  } catch (error) {
    console.error("Ошибка отправки уведомления:", error);
  }
}
