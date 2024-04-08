import { getCookie} from "cookies-next";
import { NextRequest, NextResponse } from "next/server";
import db from "../../../../../prisma";

export async function GET(req: NextRequest,res: NextResponse,
  // { params }: { params: { id: string } }
) {
  if (req.method === "GET") {
    // const id = params.id;
    const clientToken = getCookie("clientToken", { req, res });

    if (clientToken) {
      try {
        if (typeof clientToken === "string") {
          const user = await db.sessionClient.findUnique({
            where: {
              sessionToken: clientToken,
            },
          });

          if (user) {
            // Найти все записи в FavoriteObjectsToObj
            const favoriteObjects = await db.favoriteObjectsToObj.findMany({
              where: {
                sessionId: user ? user.id : "",
              },
              include: {
                object: true,
              },
            });
            return NextResponse.json({ favoriteObjects  }, { status: 200 });
          } else {
            return new Response("Объект уже удален", { status: 200 });
          }
        } else {
          return new Response(`Не корректный токен ${clientToken}`, {
            status: 404,
          });
        }
      } catch (error) {
        return new Response(`${error}`, { status: 500 });
      }
    } else {
      return new Response(`Пользователь не авторизирован`, { status: 400 });
    }
  }
}
