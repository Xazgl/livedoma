import { getCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";
import db from "../../../../../../prisma";

export async function DELETE(req: NextRequest,{ params }: { params: { id: string } }) {
  if (req.method === "DELETE") {
    const id = params.id;
    const clientToken = getCookie("clientToken", { req });

    if (clientToken) {
      try {
        if (typeof id === "string") {
          const user = await db.sessionClient.findUnique({
            where: {
              sessionToken: clientToken,
            },
          });

          const currentObjDelete = await db.favoriteObjectsToObj.deleteMany({
            where: {
              objectId: id,
              sessionId: user ? user.id : "",
            },
          });

          return NextResponse.json({ currentObjDelete }, { status: 200 });
        } else {
          return new Response(`Не корректный id ${id}`, { status: 404 });
        }
      } catch (error) {
        return new Response(`${error}`, { status: 500 });
      }
    }
  }
}
