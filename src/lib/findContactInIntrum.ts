// import axios from "axios";

// export interface Customer {
//   id: string;
//   name?: string;
//   surname?: string;
//   phone?: { phone: string; comment?: string }[];
//   email?: { mail: string; comment?: string }[];
// }

// /**
//  * Ищет контакт по телефону, сначала пробует +7XXXXXXXXXX, потом 7XXXXXXXXXX.
//  * Возвращает первый найденный контакт.
//  */
// export async function findContactInIntrum(phone: string): Promise<Customer | null> {
//   const digits = phone.replace(/\D/g, ""); // только цифры
//   const formats = [
//     "+7" + digits.slice(-10), // +7XXXXXXXXXX
//     "7" + digits.slice(-10),  // 7XXXXXXXXXX
//   ];

//   for (const phone of formats) {
//     try {
//       const params = new URLSearchParams();
//       params.append("apikey", "7917e0838a4d494b471ceb36d7e3a67b");
//       params.append("search", phone);
//       params.append("limit", "1");
//       params.append("publish", "1");

//       const res = await axios.post(
//         "http://jivemdoma.intrumnet.com:81/sharedapi/purchaser/filter",
//         params,
//         { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
//       );

//       if (res.data?.list && res.data.list.length > 0) {
//         return res.data.list[0];
//       }
//     } catch (err) {
//       console.error("Ошибка поиска контакта:", err);
//     }
//   }

//   return null;
// }

import axios from "axios";
import { IntrumCustomer } from "../../@types/dto";

/**
 * Ищет контакт существующего клиента по телефону
 * @param phone Телефон для поиска
 * @returns Объект контакта или null, если не найден
 */
export async function findContactInIntrum(
  phone: string
): Promise<IntrumCustomer | null> {
  const params = new URLSearchParams();
  params.append("apikey", "7917e0838a4d494b471ceb36d7e3a67b");
  params.append("params[search]", phone);
  params.append("params[limit]", "1");
  params.append("params[publish]", "1");

  try {
    const res = await axios.post(
      "http://jivemdoma.intrumnet.com:81/sharedapi/purchaser/filter",
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    console.log("поиска контакта,",  res.data );
    if ( res.data.data && res.data.data.list.length > 0) {
      return res.data.data.list[0] as IntrumCustomer;
    }
    return null;
  } catch (err) {
    console.error("Ошибка поиска контакта:", err);
    return null;
  }
}
