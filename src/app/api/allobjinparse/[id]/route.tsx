import { NextRequest, NextResponse } from "next/server";
import db from "../../../../../prisma"; // Убедись, что путь к Prisma корректен

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const identifier = params.id;

    console.log(identifier)

    // Ищем ReviewLink по идентификатору
    const reviewLink = await db.reviewLink.findUnique({
      where: { identifier },
    });

    if (!reviewLink) {
      // Если ReviewLink не найден
      return NextResponse.json(
        { message: `Объект с идентификатором ${identifier} не найден` },
        { status: 404 }
      );
    }

    // Получаем список объектов по objectIds
    const objectIds = reviewLink.objectIds;
    const objects = await db.inparseObjects.findMany({
      where: {
        idInparse: { in: objectIds },
      },
    });

    // Возвращаем найденные объекты
    return NextResponse.json({ objects }, { status: 200 });
  } catch (error) {
    console.error("Ошибка при получении объектов:", error);
    return NextResponse.json(
      { message: "Ошибка на сервере" },
      { status: 500 }
    );
  }
}
