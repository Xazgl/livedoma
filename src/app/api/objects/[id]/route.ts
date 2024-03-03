import { NextRequest, NextResponse } from "next/server";
import db from "../../../../../prisma";


export  async function GET( request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // return NextResponse.json({ id: params.id }, { status: 200 });
        const page = parseInt(params.id); // http://localhost:3000/api/objects/:id?id=213

        const pageSize = 20; // Устанавливаем размер страницы

        const skip = (page - 1) * pageSize;

        const allObjects = await db.objectIntrum.findMany({
            where: {
                active: true,
            },
            take: pageSize,
            skip,
        });

        if (allObjects.length > 0) {
            return NextResponse.json(allObjects);
        } else {
            return new Response(
                "'В базе нету объектов'",
                { status: 404 }
            );
        }
    } catch (error) {
        console.error(error);
        return new Response(
            "'Запрос не может быть выполнен'",
            { status: 500 }
        );
    }
}