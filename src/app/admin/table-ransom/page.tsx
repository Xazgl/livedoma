import "server-only";
import db from "../../../../prisma";
import { CircularProgress } from "@mui/material";
import checkSession from "@/lib/checkCookie";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { AuthForm } from "@/app/component/admin/auth/Auth";
import { TableFive } from "@/app/component/table/TableFive";

export const dynamic = "force-dynamic";

async function getObjects() {
  try {
    const applications = await db.constructionApplications.findMany({
      where: {
        typeApplicationCrm:'Срочный выкуп'
      },
    });

    const sid = getCookie("sid", { cookies });
    const admin = await checkSession(sid ? sid : "");
    console.log(admin);
    if (admin) {
      const { login } = admin.admin;
      return {
        applications: applications,
        login: login,
        admin: admin,
      };
    }

    return {
      applications: [],

    };
  } catch (error) {
    console.error(error);
    return { applications: [],  formattedYesterday: "" };
  }
}

export default async function Home() {
  const { applications, login, admin } = await getObjects();
  console.log(admin);

  return (
    <section className="flex flex-col w-full h-full">
      {login ? (
        <>
          {applications.length > 0 ? (
              <TableFive applications={applications} />
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
    </section>
  );
}
