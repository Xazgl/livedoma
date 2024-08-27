import "server-only";
import checkSession from "@/lib/checkCookie";
import { getCookie, getCookies } from "cookies-next";
import { cookies } from "next/headers";
import { AuthForm } from "@/app/component/admin/auth/Auth";
import { Parser } from "@/app/component/admin/parser/Parser";
// import { ParserFind } from "@/app/component/admin/parser/ParserFind";

export const dynamic = "force-dynamic";

async function getObjects() {
  try {
    // Получаем текущую дату
    const currentDate = new Date();
    // Отнимаем один день от текущей даты
    const yesterday = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    // Форматируем дату в нужный формат (YYYY-MM-DD)
    const formattedYesterday = yesterday.toISOString().split("T")[0];



  


    // const sid = req.cookies['sid']

    const sid = getCookie("sid", { cookies });
    // console.log(sid)
    const admin = await checkSession(sid ? sid : "");
    console.log(admin);
    if (admin) {
      const { login } = admin.admin;
      return {
        formattedYesterday: formattedYesterday,
        login: login,
        admin: admin,
      };
    }

    return {
      formattedYesterday: formattedYesterday,
    };
  } catch (error) {
    console.error(error);
    return { formattedYesterday: "" };
  }
}

export default async function Home() {
  const {login, admin } =
    await getObjects();
  console.log(admin);

  return (
    <>
      {login ? (
            <>
              <Parser />
              {/* <ParserFind /> */}
            </>
      ) : (
        <div className="flex w-full h-[100vh] items-center justify-center">
          <AuthForm />
        </div>
      )}
    </>
  );
}
