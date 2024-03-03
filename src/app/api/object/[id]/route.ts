import { NextRequest, NextResponse } from "next/server";
import db from "../../../../../prisma";

export  async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        console.log(req.url);
        
        const id = params.id; 
        
        if (typeof id === 'string') {
            const currentObject = await db.objectIntrum.findUnique({
                where: {
                    id: id,
                },
            });
            if (currentObject) {
                return NextResponse.json({ currentObject})
            } else {
                return new Response(
                    "'Объект не найден'",
                    { status: 404 }
                )
            }
        }
        return NextResponse.json({ message: 'Error' }, {status: 404})
    } catch (error) {
        console.error(error);
        return new Response(
            "'Не получилось найти подходящий объект'",
            { status: 500 }
        )
    }
}