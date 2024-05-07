import "server-only";
import db from "../../../../prisma";
import { CircularProgress } from "@mui/material";
import checkSession from "@/lib/checkCookie";
import { getCookie } from "cookies-next";

import { cookies } from "next/headers";
import { AuthForm } from "@/app/component/admin/auth/Auth";
import { TableThird } from "@/app/component/table/TableThird";

export const dynamic = "force-dynamic";

async function getObjects() {
  try {
    // Получаем текущую дату
    const currentDate = new Date();
    // Отнимаем один день от текущей даты
    const yesterday = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    // Форматируем дату в нужный формат (YYYY-MM-DD)
    const formattedYesterday = yesterday.toISOString().split("T")[0];

    const sales = await db.sales.findMany({
      where: {
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
    console.log( admin)
    if (admin) {
      const { login } = admin.admin;
      return {
        sales: sales,
        uniqueDateStages: uniqueDateStages,
        formattedYesterday: formattedYesterday,
        login: login,
        admin : admin 
      };
    }

    return {
      sales: [],
      uniqueDateStages: uniqueDateStages,
      formattedYesterday: formattedYesterday,
    };
  } catch (error) {
    console.error(error);
    return { sales: [], uniqueDateStages: [], formattedYesterday: "" };
  }
}

export default async function Home() {
  const { sales, uniqueDateStages, formattedYesterday, login,  admin  } =
    await getObjects();
    console.log( admin )

  return (
    <>
      {login ? (
        <>
          {sales.length > 0 && uniqueDateStages.length > 0 ? (
            <TableThird
              sales={sales}
              uniqueDateStages={uniqueDateStages}
              formattedYesterday={formattedYesterday}
            />
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
