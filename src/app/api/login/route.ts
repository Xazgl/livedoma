import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { nanoid } from "nanoid";
import { setCookie } from "cookies-next";
import { sign } from "@/lib/signature";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === "POST") {
    try {
      // const loginSchema = z.object({
      //   login: z.string().min(2).max(20),
      //   pass: z.string().min(2).max(20),
      // });
      // const { login, pass } = loginSchema.parse(req.body);
       const  { login, pass }  = await req.json()
      const adminByLogin = await db.admin.findUnique({ where: { login } });
      if (adminByLogin) {
        if (await bcryptjs.compare(pass, adminByLogin.passwordHash)) {
          // sessions
          const sessionToken = nanoid();
          const token = sign(sessionToken, process.env.SECRET!);
          console.log({ adminByLogin: adminByLogin, sessionToken:sessionToken, token:token})
           setCookie("sid", sessionToken, { cookies });
          // const maxAgeInSeconds = 60 * 60 * 24; // 1 день
          const session = await db.session.create({
            data: {
              sessionToken: token ,
              expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
              adminId: adminByLogin.id,
            },
          });
          return NextResponse.json({ status: 200 });
          // res.send({ redirectUrl: '/admin' });
        } else {
          return NextResponse.json("Incorrect credentials", { status: 401 });
        }
      } else {
        return NextResponse.json("Incorrect credentials", { status: 401 });
      }
    } catch (error) {
      return NextResponse.json("Некорретный логин и пароль", { status: 400 });
    }
  } else {
    return NextResponse.json("Неверный адрес", { status: 404 });
  }
}
