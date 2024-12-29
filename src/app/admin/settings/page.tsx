import "server-only";
import db from "../../../../prisma";
import { CircularProgress } from "@mui/material";
import checkSession from "@/lib/checkCookie";
import { getCookie } from "cookies-next";

import { cookies } from "next/headers";
import { AuthForm } from "@/app/component/admin/auth/Auth";
import TableManager from "@/app/component/managers/TableManager";


export const dynamic = "force-dynamic";

async function getManagers() {
  try {
    const managers = await db.activeManagers.findMany({
      orderBy: [
        {
          name: "asc",
        },
      ],
    });

    const sid = getCookie("sid", { cookies });
    const admin = await checkSession(sid ? sid : "");

    if (admin) {
      const { login } = admin.admin;

      return {
        managers: managers,
        login: login,
        admin: admin,
      };
    }

    return {
      managersJdd: [],
    };
  } catch (error) {
    console.error(error);
    return { managersJdd: [] };
  }
}

export default async function Home() {
  const { managers, login } = await getManagers();
  const validateManagers = managers && managers.length > 0;

  return (
    <>
      {login ? (
        <>
          {validateManagers ? (
            <TableManager managersAll={managers} />
          ) : (
            <div className="flex w-full h-[100vh] items-center justify-center">
              <CircularProgress />
            </div>
          )}
        </>
      ) : (
        <div className="flex w-full h-[100vh] items-center justify-center">
          <AuthForm />
        </div>
      )}
    </>
  );
}
