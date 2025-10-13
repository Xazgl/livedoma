import "server-only";
import db from "../../../../prisma";
import { CircularProgress } from "@mui/material";
import checkSession from "@/lib/checkCookie";
import { getCookie } from "cookies-next";

import { cookies } from "next/headers";
import { AuthForm } from "@/app/component/admin/auth/Auth";
import { CentroTable } from "@/app/component/table/CentroTable";

export const dynamic = "force-dynamic";

async function getObjects() {
  try {
    const applications = await db.tilda.findMany({
      where: {
        typeSend: "Tilda Опрос ОП",
      },
    });

    const sid = getCookie("sid", { cookies });

    const admin = await checkSession(sid ? sid : "");

    if (admin) {
      const { login } = admin.admin;
      return {
        applications: applications ?? [],
        login: login,
        admin: admin,
      };
    }

    return {
      applications: [],
    };
  } catch (error) {
    console.error(error);
    return { applications: [], formattedYesterday: "" };
  }
}

export default async function Home() {
  const { applications, login } = await getObjects();

  return (
    <section className="flex flex-col w-full h-full">
      {login ? (
        <CentroTable applications={applications} />
      ) : (
        <div className="flex w-full h-[100vh] items-center justify-center">
          <AuthForm />
        </div>
      )}
    </section>
  );
}
