import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const streetQuery = searchParams.get("street");

  if (!streetQuery) {
    return new Response("Параметр 'street' обязателен", { status: 400 });
  }

  try {
    const foundObjects = await db.objectIntrum.findMany({
      where: {
        street: {
          contains: streetQuery,
          mode: "insensitive", // Не учитывать регистр адреса
        },
      },
      select: {
        id: true,
        street: true,
        city: true,
      },
    });

    return NextResponse.json({ objects: foundObjects });
  } catch (error) {
    console.error("Ошибка при поиске объектов:", error);
    return new Response("Ошибка на сервере", { status: 500 });
  }
}
