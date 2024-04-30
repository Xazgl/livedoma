"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function AuthForm() {
  const [login, setLogin] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(login);
    console.log(pass);
    const res = await fetch(`/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, pass }),
    });
    if (res.ok) {
    //   const result = await (await res).json();
    //   if (result.blackirectUrl) {
    //     router.push(result.redirectUrl as string);
    //   }
      console.log(res);
      router.refresh();
    }
  }

  return (
    <form  onSubmit={submit}>
      <div className="flex flex-col w-[300px] gap-6 mb-6">
        <label
        //   for="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Логин
        </label>
        <input
           value={login} onChange={(event) => setLogin(event.target.value)}
          type="text"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Ваш логин"
          required
        />
      </div>
      <div className="mb-6">
        <label
        //   for="password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Пароль
        </label>
        <input
          type="password"
          id="password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="•••••••••"
          required
          value={pass} onChange={(event) => setPass(event.target.value)}
        />
      </div>

      {/* <div className="flex items-start mb-6">
        <div className="flex items-center h-5">
          <input
            id="remember"
            type="checkbox"
            value=""
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
            required
          />
        </div>
        <label
        //   for="remember"
          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          I agree with the{" "}
          <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">
            terms and conditions
          </a>
          .
        </label>
      </div> */}
      <button
        type="submit"
        className="flex  text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Войти
      </button>
    </form>

    // <div className="background">
    //     <form className="form" onSubmit={submit}>
    //         <div className="mb-3">
    //             <h1 className="loginTitle">АРКОНТ ADMIN</h1>
    //         </div>
    //         <div className="mb-3">
    //             <label>
    //                 <input className="input" placeholder="Логин" value={login} onChange={(event) => setLogin(event.target.value)} type="text" />
    //             </label>
    //         </div>
    //         <div className="mb-3">
    //             <label>
    //                 <input className="input" placeholder="Пароль" value={pass} onChange={(event) => setPass(event.target.value)} type="password" />
    //             </label>
    //         </div>
    //         <div className="mb-3">
    //             <button className="btn" type="submit">ВОЙТИ</button>
    //         </div>
    //     </form>
    // </div>
  );
}
