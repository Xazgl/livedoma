import { NextRequest, NextResponse } from "next/server";
import db from "../../../../../../prisma";

export async function GET(req: NextRequest, { params }: { params: { identifier: string } }) {
  try {
    const identifier = params.identifier;

    const reviewLink = await db.reviewLink.findUnique({
      where: { identifier },
    });

    if (!reviewLink) {
      return NextResponse.json(
        { message: `Объект с идентификатором ${identifier} не найден` },
        { status: 404 }
      );
    }

    const objectIds = reviewLink.objectIds;
    const objects = await db.inparseObjects.findMany({
      where: {
        id: { in: objectIds },
        active: true,
      },
    });

    return NextResponse.json({ objects }, { status: 200 });
  } catch (error) {
    console.error("Ошибка при получении объектов:", error);
    return NextResponse.json(
      { message: "Ошибка на сервере" },
      { status: 500 }
    );
  }
}
