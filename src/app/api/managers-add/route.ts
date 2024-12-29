import { NextRequest, NextResponse } from "next/server";
import db from "../../../../prisma";

export async function POST(request: NextRequest) {
  try {
    const { manager_id, name, company_JDD_active } = await request.json();

    const newManager = await db.activeManagers.create({
      data: {
        manager_id,
        name,
        company_JDD_active: company_JDD_active ?? true,
        company_Sansara_active:false,
        sansara_priority:0
      },
    });

    return NextResponse.json({
      success: true,
      message: "Manager added successfully",
      newManager,
    });
  } catch (error) {
    console.error("Error adding manager:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to add manager",
    });
  }
}
