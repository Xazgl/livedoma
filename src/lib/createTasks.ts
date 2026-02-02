import axios from "axios";
import { Wazzup } from "@prisma/client";
import { ProjectType } from "./wazzup";
import { findContactInIntrum } from "./findContactInIntrum";

export default async function createIntrumTask(
  message: Wazzup,
  projectType?: ProjectType
) {
  const coperformerIds = ["309", "1584", "2588", "2916", "2536", "2535"];

  const params = new URLSearchParams();
  params.append("apikey", "7917e0838a4d494b471ceb36d7e3a67b");
  params.append(
    "params[title]",
    `Заявка с рассылки ${projectType} от ${message.phone}`
  );
  params.append(
    "params[description]",
    `Заявка от клиента: ${message.name}, телефон: ${message.phone}. Получена после рассылки отдела маркетинга.`
  );
  params.append("params[director]", "1997"); // постановщик
  params.append("params[performer]", "1693"); // исполнитель
  if (coperformerIds.length) {
    params.append("params[coperformer]", coperformerIds.join(",")); // соисполнители
  }
  params.append("params[priority]", "5");

  const checklist = [
    { name: "Созвониться с клиентом", done: false },
    { name: "Узнать по какой организации было обращение", done: false },
    { name: "Создать заявку в црм", done: false },
  ];

  params.append("params[checklist]", JSON.stringify(checklist));
  const customer = await findContactInIntrum(message.phone);
  if (customer) {
    params.append("params[attaches]", `customer#${customer.id}`);
  }

  try {
    const postResponse = await axios.post(
      "http://jivemdoma.intrumnet.com:81/sharedapi/tasks/create",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (postResponse.data?.status === "success" && postResponse.data?.data?.id) {
      console.log("Задача создана, ID:", postResponse.data.data.id);
      return postResponse.data;
    }
  } catch (error) {
    console.error("Ошибка создания задачи:", error);
    return null;
  }
}

// import axios from "axios";
// import { Wazzup } from "@prisma/client";
// import { ProjectType } from "./wazzup";

// export default async function createIntrumTask(message: Wazzup, projectType?: ProjectType) {
//   const coperformerIds = ["309", "1584", "2588", "2146"];

//   const params = new URLSearchParams();
//   params.append("apikey", "7917e0838a4d494b471ceb36d7e3a67b");
//   params.append("title", `Заявка с рассылки ${projectType} от ${message.phone}`);
//   params.append(
//     "description",
//     `Заявка от клиента: ${message.name}, телефон: ${message.phone}. Получена после рассылки отдела маркетинга.`
//   );
//   params.append("director", "1693"); // постановщик
//   params.append("performer", "1693"); // исполнитель
//   if (coperformerIds.length) {
//     params.append("coperformer", coperformerIds.join(",")); // соисполнители
//   }
//   params.append("priority", "5");

//   const checklist = [
//     { name: "Созвониться с клиентом", done: false },
//     { name: "Узнать по какой организации было обращение", done: false },
//     { name: "Создать заявку в црм", done: false },
//   ];

//   params.append("checklist", JSON.stringify(checklist));

//   try {
//     const response = await axios.post(
//       "http://jivemdoma.intrumnet.com:81/sharedapi/tasks/create",
//       params,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );
//     console.log("Задача создана, ID:", response.data.id);
//     return response.data.id  ;
//   } catch (error) {
//     console.error("Ошибка создания задачи:", error);
//     return null;
//   }
// }
