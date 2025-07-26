import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    try {
      const managers = await db.activeManagers.findMany({
        orderBy: [
          {
            name: "asc",
          },
        ],
      });

      return NextResponse.json({
        success: true,
        message: "Manager status get successfully",
        managers,
      });
    } catch (error) {
      console.error("Error updating manager status:", error);
      return NextResponse.json({
        success: false,
        message: "Failed to update manager status",
        error,
      });
    }
  }
}
