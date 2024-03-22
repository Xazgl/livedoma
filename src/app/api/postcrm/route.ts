import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";
import axios from "axios";

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method == "POST") {
    try {
      const allContacts = await db.wazzup.findMany({
        where: {
          sendCrm: false,
        }
      });

      const promises = allContacts.map(async (contact) => {
        const obj = {
          apikey: "7917e0838a4d494b471ceb36d7e3a67b",
          params: [
            {
              manager_id: 0,
              name: contact.name,
              surname: "",
              email: [""],
              phone: [contact.phone],
              fields: [],
            },
          ],
        };

        // Выполняем POST-запрос с использованием axios
        const postResponse = await axios.post(
          "http://jivemdoma.intrumnet.com:81/sharedapi/purchaser/insert",
          obj
        );
        console.log(postResponse.data); // Печатаем ответ от сервера

        return postResponse.data;
      });

      const results = await Promise.all(promises);

      return NextResponse.json(results, { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response(
        "'Запрос не может быть выполнен'",
        { status: 500 }
    )
    }
  } else {
    return NextResponse.json("Only POST requests allowed", { status: 405 });
  }
}
