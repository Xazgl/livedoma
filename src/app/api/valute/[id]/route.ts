// R01235
import { NextRequest, NextResponse } from "next/server";
import db from "../../../../../prisma";
import { NextApiRequest } from "next";
import { parse } from "url";

// export async function GET(req: NextApiRequest) {
//     try {
//         const { id } = req.query
//         if (typeof id === 'string') {
//             const valute = await db.exchangeRate.findUnique({
//                 where: {
//                     id: id,
//                 },
//             })
//             return NextResponse.json({ valute })
//         }
//     }catch (error) {
//         error
//         return NextResponse.json({ error: 'Не получилось найти подходящие валюту' }, { status: 500 })
//     }
// }

export  async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        console.log(req.url);
        
        const id = params.id; // http://localhost:3000/api/valute/:id?id=213
        
        if (typeof id === 'string') {
            const valute = await db.exchangeRate.findUnique({
                where: {
                    id: id,
                },
            });
            if (valute) {
                return NextResponse.json({ valute })
            } else {
                return new Response(
                    "'Валюта не найдена'",
                    { status: 404 }
                )
            }
        }
        return NextResponse.json({ message: 'Error' }, {status: 404})
    } catch (error) {
        console.error(error);
        return new Response(
            "'Не получилось найти подходящую валюту'",
            { status: 500 }
        )
    }
}