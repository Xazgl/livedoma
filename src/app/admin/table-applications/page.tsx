import "server-only";
import db from "../../../../prisma";
import { TableFirst } from "@/app/component/table/TableFirst";
import { CircularProgress } from "@mui/material";
import checkSession from "@/lib/checkCookie";
import { getCookie, getCookies } from "cookies-next";

import { cookies } from "next/headers";
import { AuthForm } from "@/app/component/admin/auth/Auth";
import { TableSecond } from "@/app/component/table/TableSecond";

export const dynamic = "force-dynamic";

async function getObjects() {
  try {
    // Получаем текущую дату
    // const currentDate = new Date();
    // // Отнимаем один день от текущей даты
    // const yesterday = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    // // Форматируем дату в нужный формат (YYYY-MM-DD)
    // const formattedYesterday = yesterday.toISOString().split("T")[0];

    const applications = await db.constructionApplications.findMany({
      where: {
        typeApplicationCrm:'ЖДД'
        // dateStage: formattedYesterday,
      },
    });

    const dataStageArr = await db.sales.findMany({
      where: {},
      select: {
        dateStage: true,
      },
    });

    // Извлекаем значения поля dateStage из каждого объекта результата запроса
    const dateStages = dataStageArr.map((obj) => obj.dateStage);

    // Создаем уникальный массив значений с помощью Set
    let uniqueDateStages = [...new Set(dateStages)];
    uniqueDateStages.length > 0 ? uniqueDateStages : ["Значений нет"];

    // const sid = req.cookies['sid']

    const sid = getCookie("sid", { cookies });
    // console.log(sid)
    const admin = await checkSession(sid ? sid : "");
    console.log(admin);
    if (admin) {
      const { login } = admin.admin;
      return {
        applications: applications,
        uniqueDateStages: uniqueDateStages,
        login: login,
        admin: admin,
      };
    }

    return {
      applications: [],
      uniqueDateStages: uniqueDateStages,
    };
  } catch (error) {
    console.error(error);
    return { applications: [], uniqueDateStages: [], formattedYesterday: "" };
  }
}

export default async function Home() {
  const { applications, uniqueDateStages, login, admin } = await getObjects();
  console.log(admin);

  return (
    <section className="flex flex-col w-full h-full">
      {login ? (
        <>
          {applications.length > 0 && uniqueDateStages.length > 0 ? (
              <TableSecond applications={applications} />
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
