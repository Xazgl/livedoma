import { NextRequest, NextResponse } from "next/server";
import db, { ObjectIntrum } from "../../../../prisma";
import { Worker } from "worker_threads";
import os from "os";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sPage = searchParams.get("page");
    const workerData = {
      category: searchParams.get("category"),
      operationType: searchParams.get("operationType"),
      city: searchParams.get("city"),
      rooms: searchParams.get("rooms"),
      district: searchParams.get("district"),
      street: searchParams.get("street"),
      companyName: searchParams.get("companyName"),
      minPrice: searchParams.get("minPrice"),
      maxPrice: searchParams.get("maxPrice"),
      renovation: searchParams.get("renovation"),
      floor: searchParams.get("floor"),
      floors: searchParams.get("floors"),
      page: sPage ? +sPage : 1,
      sortOrder: searchParams.get("sortOrder") === "asc" ? "asc" : "desc",
      sortPrice: searchParams.get("sortPrice") === "asc" ? "asc" : "desc",
    };

    const result = await new Promise((resolve, reject) => {
      const worker = new Worker(
        path.join(process.cwd(), "./worker/workerObjects.js"),
        {
          workerData,
        }
      );

      worker.on("message", (data) => {
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data);
        }
      });

      worker.on("error", reject);

      worker.on("exit", (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });

    // Возвращаем результат в ожидаемом формате
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("'Запрос не может быть выполнен'", { status: 500 });
  }
}
