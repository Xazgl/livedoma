import "server-only";
import db from "../../../../prisma";
import checkSession from "@/lib/checkCookie";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { AuthForm } from "@/app/component/admin/auth/Auth";
import CentroPage from "@/app/component/table/centro-page/CentroPage";

export const dynamic = "force-dynamic";

async function getObjects() {
  try {
    const applications = await db.tilda.findMany({
      where: {
        typeSend: {
          in: ["Tilda Опрос ОП часть 1", "Tilda Опрос ОП часть 2"],
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const sid = getCookie("sid", { cookies });

    const admin = await checkSession(sid ? sid : "");

    if (admin) {
      const { login } = admin.admin;
      const appArr = applications ?? [];
      const applicationsBoody = {
        applicationsExcel: appArr,
        allFilteredSales: appArr,
      };
      return {
        applications: applicationsBoody,
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
        // <CentroTable applications={applications} />
        <CentroPage applications={applications} />
      ) : (
        <div className="flex w-full h-[100vh] items-center justify-center">
          <AuthForm />
        </div>
      )}
    </section>
  );
}
