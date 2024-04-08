import { getCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";
import db from "../../../../../../prisma";

export async function POST(req: NextRequest,{ params }: { params: { id: string }  }) {
  const id = params.id;
  const clientToken = getCookie("clientToken", { req });
  console.log( id, clientToken )

  if (clientToken) {
    try {
      if (typeof id === "string" && typeof clientToken === "string") {
        const user = await db.sessionClient.findUnique({
          where: {
            sessionToken: clientToken,
          },
        });


        const currentObj = await db.favoriteObjectsToObj.findFirst({
          where: {
            objectId: id,
            sessionId: user ? user.id : "",
          },
        });

        console.log( {user , currentObj } )

        if (!currentObj) {
          const objFavorite = await db.favoriteObjectsToObj.create({
            data: {
              object: {
                connect: {
                  id,
                },
              },
              session: {
                connect: {
                  sessionToken: clientToken,
                },
              },
            },
          });

          return NextResponse.json({ objFavorite }, { status: 200 });
        } else {
          return new Response("Объект уже в избранном", { status: 200 });
        }
      } else {
        return new Response(`Не корректный id ${id}`, { status: 404 });
      }
    } catch (error) {
      return new Response(`${error}`, { status: 500 });
    }
  } else {
    return new Response(`Пользователь не найден`, { status: 404 });
  }
}
