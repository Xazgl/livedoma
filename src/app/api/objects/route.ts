import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        // await new Promise(resolve => setTimeout(resolve, 5000));
        const allObjects = await db.objectIntrum.findMany({
            where: {
                active: true,
            },
        });
        
         if (allObjects.length > 0) {
            return NextResponse.json(allObjects);
            
        } else {
            return new Response(
                "'В базе нету объектов'",
                { status: 404 }
            )
        }
    } catch (error) {
        console.error(error);
        return new Response(
            "'Запрос не может быть выполнен'",
            { status: 500 }
        )
    }
}