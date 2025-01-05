import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";

export async function PUT(request: NextRequest) {
  try {
    const { managerId, company_JDD_active } = await request.json()

    const updatedManager = await db.activeManagers.update({
      where: { id: managerId },
      data: {
        company_JDD_active:company_JDD_active,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Статус пользователя обновлен",
      updatedManager,
    });
  } catch (error) {
    console.error("Error updating manager status:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to update manager status",
    });
  }
}
