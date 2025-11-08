import "server-only";
import checkSession from "@/lib/checkCookie";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { AuthForm } from "@/app/component/admin/auth/Auth";
import UsersForMailingUploader from "@/app/component/admin/mailing/UsersForMailingUploader";

export const dynamic = "force-dynamic";

async function getObjects() {
  try {
    const sid = getCookie("sid", { cookies });
    const admin = await checkSession(sid ? sid : "");
    if (admin) {
      const { login } = admin.admin;
      return {
        login: login,
        admin: admin,
      };
    } else {
      return {
        login: null,
        admin: null,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      login: null,
      admin: null,
    };
  }
}

export default async function Home() {
  const { login, admin } = await getObjects();

  return (
    <>
      {login ? (
        // <WazzupMessages />
        <UsersForMailingUploader />
      ) : (
        <div className="flex w-full h-[100vh] items-center justify-center">
          <AuthForm />
        </div>
      )}
    </>
  );
}
