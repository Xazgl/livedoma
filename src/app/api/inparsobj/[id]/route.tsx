import { NextRequest, NextResponse } from "next/server";
import db from "../../../../../prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const id = params.id;
  
      const object = await db.inparseObjects.findUnique({
        where: { id: id},
      });
  
      if (!object) {
        return NextResponse.json(
          { message: "Объект не найден" },
          { status: 404 }
        );
      }
  
      // Меняем состояние поля active на противоположное
      const updatedObject = await db.inparseObjects.update({
        where: { id: id },
        data: {
          active: !object.active,
        },
      });
  
      return NextResponse.json(updatedObject, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Ошибка при обновлении объекта" },
        { status: 500 }
      );
    }
  }
