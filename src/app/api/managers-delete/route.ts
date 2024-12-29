import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";

export async function DELETE (request: NextRequest) {
  try {
    const { managerId } = await request.json();

    const deleteManager = await db.activeManagers.delete({
      where: { id: managerId },
    });

    return NextResponse.json({
      success: true,
      message: "Manager delete successfully",
      deleteManager,
    });
  } catch (error) {
    console.error("Error delete manager:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to delete manager ",
    });
  }
}
