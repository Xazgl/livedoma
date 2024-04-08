import { ObjectIntrum } from "@prisma/client";
import { number } from "zod";

export type FilterUserOptions = {
  category?: string[];
  operationType?: string[];
  state?: string[];
  city?: string[];
  street?: string[];
  minPrice?: number;
  maxPrice?: number;
  companyName?: string[];
  passengerElevator?: string[];
  freightElevator?: string[];
  ceilingHeight?: string[];
  renovation?: string[];
  rooms?: string[];
  square?: string[];
  floors?: string[];
  floor?: string[];
  wallsType?: string[];
};

export type allObjects = ObjectIntrum[];

export type FilteblackProps = {
  categories: string[];
  operationTypes: string[];
  states: string[];
  cities: string[];
  streets: string[];
  companyNames: string[];
  passengerElevators: string[];
  freightElevators: string[];
  ceilingHeight: string[];
  renovationTypes: string[];
  rooms: string[];
  square: string[];
  floors: string[];
  floor: string[];
  wallsTypes: string[];
};

export type Marquiz = {
  raw: { q: string; a: string | string[] }[];
  answers: {
    q: string;
    t: string;
    a: string | string[];
  }[];
  quiz: {
    id: string;
    name: string;
  };
  created: string;
  extra: {
    href: string;
    userAgent: string;
    utm: {
      campaign: string;
      content: string;
      medium: string;
      source: string;
      term: string;
      name: string;
    };
    cookies: {
      _ym_uid: string;
      _ga: string;
    };
    lng: string;
    currency: string;
    notify: string;
    timezone: number;
    lang: string;
    referrer: string;
    ip: string;
    city: string;
    country: string;
  };
  form: {
    id: string;
  };
  contacts: {
    name: string;
    phone: string;
  };
  result: {};
};


// {
//     raw: [
//       { q: 'UudhPun5j1', a: 'ua5F6VMqm8' },
//       { q: 'hh6YgSve7m', a: [Array] },
//       { q: 'DvcOMdL7Tw', a: 'IH5OPpeGtt' },
//       { q: '05T862MUD2', a: 'F021VaS16Y' },
//       { q: 'e8J2cPN13D', a: 'N5YUQ3Cep6' },
//       { q: '2k8Qhb5XSq', a: 'sk1NVBU0vC' },
//       { q: '3YD46Xc6Xw', a: 'Mx3FrPU2SW' }
//     ],
//     answers: [
//       {
//         q: 'Какую площадь дома вы хотите?',
//         t: 'variants',
//         a: 'до 70 кв.м'
//       },
//       {
//         q: 'Из какого материала планируете строить дом?',
//         t: 'variants',
//         a: [Array]
//       },
//       {
//         q: 'Сколько этажей в доме вы хотите?',
//         t: 'variants',
//         a: '1 этаж'
//       },
//       {
//         q: 'Когда планируете строить?',
//         t: 'variants',
//         a: 'Готовы сейчас'
//       },
//       {
//         q: 'Есть ли у вас участок?',
//         t: 'variants',
//         a: 'Да, в Волгограде/области'
//       },
//       {
//         q: 'Выберите подарок к вашему дому',
//         t: 'images',
//         a: 'Фото+видеосъемка с квадрокоптера в новом доме'
//       },
//       {
//         q: 'Как планируете оплачивать строительство дома?',
//         t: 'variants',
//         a: 'Наличными'
//       }
//     ],
//     quiz: { id: '63da635a100aac00416ccb14', name: 'Дома' },
//     created: '2024-04-02T10:20:00.805Z',
//     extra: {
//       href: 'https://xn--34-dlciytlcw.xn--p1ai/',
//       userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML,
//   like Gecko) Chrome/123.0.0.0 Safari/537.36',
//       utm: {
//         campaign: '{tol_ko_SIP}',
//         content: '{ad_id}',
//         medium: 'cpc',
//         source: 'yandex',
//         term: '{keyword}',
//         name: '{tol_ko_SIP}'
//       },
//       cookies: {
//         _ym_uid: '1711723397707291555',
//         _ga: 'GA1.2.338230412.1712052830'
//       },
//       lng: 'ru',
//       currency: 'RUB',
//       notify: 'now',
//       timezone: 3,
//       lang: 'ru',
//       referrer: 'https://xn--34-dlciytlcw.xn--p1ai/',
//       ip: '31.180.140.151',
//       city: 'Volgograd',
//       country: 'RU'
//     },
//     form: { id: '4QwF0eHi8g' },
//     contacts: { name: 'ТЕст', phone: '+79000000000' },
//     result: {}
//   }

export type Tilda = {
  Phone: string;
  name: string;
  tranid: string;
  formid: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
};

export type Message = {
  messageId: string;
  dateTime: string;
  channelId: string;
  chatType: string;
  chatId: string;
  type: string;
  isEcho: boolean;
  contact: {
    name: string;
  };
  text: string;
  status: string;
  authorName: string;
};

export type MessagesResponse = {
  messages: Message[];
};

export type crmAnswer = {
  status: string;
  data: [];
};

export type FavoriteObj = {
  object:ObjectIntrum,
  objectId: string,
  sessionId: string
}



//   {
//     "status": "success",
//     "data": [
//         278272
//     ]
// }

//   {
//     "crmStatus": {
//         "status": "success",
//         "data": [
//             278272
//         ]
//     },
//     "contacts": [
//         null
//     ]
// }
//   const data: MessagesResponse =
// {
//     messages: [
//       {
//         messageId: "f797a91e-a4cf-4a8c-bf8a-23e32e50e5d4",
//         dateTime: "2024-03-11T15:09:00.001Z",
//         channelId: "2911a01c-5b6d-44b1-83c6-141f9c418906",
//         chatType: "whatsapp",
//         chatId: "79690522865",
//         type: "text",
//         isEcho: false,
//         contact: {
//           /* объект контакта */
//         },
//         text: "Тест для Юры",
//         status: "inbound",
//         authorName: "79690522865",
//       },
//     ],
//   }
