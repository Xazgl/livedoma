import { ObjectIntrum } from "@prisma/client"
import { number } from "zod"

export type FilterUserOptions = {
    category?: string[]
    operationType?: string[]
    state?: string[]
    city?: string[]
    street?: string[]
    minPrice?: number
    maxPrice?: number
    companyName?: string[]
    passengerElevator?: string[]
    freightElevator?: string[]
    ceilingHeight?: string[]
    renovation?: string[]
    rooms?: string[]
    square?: string[]
    floors?: string[]
    floor?: string[]
    wallsType?: string[]
}




export type allObjects = ObjectIntrum[];


export type FilteblackProps = {
    categories: string[]
    operationTypes: string[]
    states: string[]
    cities: string[]
    streets: string[]
    companyNames: string[]
    passengerElevators: string[]
    freightElevators: string[]
    ceilingHeight: string[]
    renovationTypes: string[]
    rooms: string[]
    square: string[]
    floors: string[]
    floor: string[]
    wallsTypes: string[]
}





export type  Message = {
    messageId: string;
    dateTime: string;
    channelId: string;
    chatType: string;
    chatId: string;
    type: string;
    isEcho: boolean;
    contact: {
        name:string
    };
    text: string;
    status: string;
    authorName: string;
  }
  
  export type MessagesResponse = {
    messages: Message[];
  }
  
 

  export type crmAnswer = {
      status: string,
      data: []
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