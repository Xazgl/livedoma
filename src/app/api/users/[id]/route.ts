// import { NextRequest, NextResponse } from "next/server";

// export async function PATCH(req: NextRequest) {
//     try {
//         const session = await getAuthSession()
    
//         if (!session?.user) {
//           // return new Response("Unauthorized", { status: 401 })
//           return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//         }
    
//         const body = await req.json()
//         const { name } = UsernameValidator.parse(body)
    
//         // check if username is taken
//         const username = await db.user.findFirst({
//           where: {
//             name: name,
//           },
//         })
    
//         if (username) {
//         //   return new Response(JSON.stringify({ error: 'Имя пользователя занято' }), { status: 409 })
//           return NextResponse.json({ error: 'Имя пользователя занято' }, { status: 409 })
//         }
    
//         // update username
//         await db.user.update({
//           where: {
//             id: session.user.id,
//           },
//           data: {
//             name: name,
//           },
//         })
    
//         // return new Response('OK')
//         return NextResponse.json({ name })
//       } catch (error) {
//         error
    
//         if (error instanceof z.ZodError) {
//           // return new Response(error.message, { status: 400 })
//           return NextResponse.json({ error: error.message }, { status: 400 })
//         }
    
//         // return new Response(
//         //   "Не получилось обновить имя пользователя. Пожалуйста, попробуйте позднее",
//         //   { status: 500 }
//         // )
//         return NextResponse.json({ error: 'Не получилось обновить имя пользователя. Пожалуйста, попробуйте позднее' }, { status: 500 })
//       }
// }