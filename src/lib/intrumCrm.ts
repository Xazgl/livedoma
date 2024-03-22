import { Wazzup } from "@prisma/client";
import axios from "axios";

export default async function sendIntrumCrm(message: Wazzup) {
  const obj = {
    apikey: "7917e0838a4d494b471ceb36d7e3a67b",
    params: [
      {
        manager_id: 0,
        name: message.name,
        surname: "dfdfdfd",
        email: [""],
        phone: [message.phone],
        fields: [],
      }
    ]
  };

  // Создаем объект с параметрами
  const params = new URLSearchParams();
  params.append("apikey", '7917e0838a4d494b471ceb36d7e3a67b');
  params.append("params[0][manager_id]", '0');
  params.append("params[0][name]", message.name? message.name : '');
  params.append(`params[0][phone][]`, message.phone);
  // obj.params[0].phone.forEach((phone, index) => {
  //   params.append(`params[0][phone][${index}]`, phone);
  // });
  try {
  const postResponse = await axios.post(
    "http://jivemdoma.intrumnet.com:81/sharedapi/purchaser/insert",
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return postResponse.data;

  } catch (error) {
      console.error(error);
      return new Response(`Запрос в Intrum не выполнен ошибка ${error}`, { status: 404 });
  } 
}


