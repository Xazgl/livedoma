import { nanoid } from "nanoid";
import { getCookie, setCookie } from "cookies-next";
//  import helmet from 'helmet';
import db from "../../../../prisma";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

//@ts-ignore
// const withHelmetSessionClient = (POST) => (req, res) => {
//     helmet()(req, res, () => {
//         POST(req, res);
//     });
// };

// const handler = async function POST (req: NextRequest, res: NextResponse) => {
  export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const currentCookie = getCookie("clientToken", { req, res });
    const currentSession = currentCookie
      ? await db.sessionClient.findUnique({
          where: {
            sessionToken: currentCookie,
          },
        })
      : null;
    if (!currentSession) {
      // sessions
      const sessionToken = nanoid(36);
      const expires = new Date(Date.now() + 60 * 60 * 24 * 365 * 5 * 1000);
      setCookie("clientToken", sessionToken, { cookies });
      const session = await db.sessionClient.create({
        data: {
          sessionToken,
          expires,
        },
      });
      return NextResponse.json({ sessionToken }, { status: 200 });
    }
    return NextResponse.json(
      { sessionToken: currentSession.sessionToken },
      { status: 200 }
    );
  } catch (error) {
    return new Response("Ошибка в базе данных", { status: 500 });
  }
}

//   export default withHelmetSessionClient(POST);
