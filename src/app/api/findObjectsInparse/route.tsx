import { NextRequest, NextResponse } from "next/server";
import db, { InparseObjects } from "../../../../prisma";
import { InparseAnswer } from "../../../../@types/dto";
// import { createArchive } from "@/lib/inparseExcel";
import { pipeline } from 'stream';
import { promisify } from 'util';
const pump = promisify(pipeline);

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method == "POST") {
    const normalizeAddress = (address: string) => {
      return address.toLowerCase().replace(/[.,]/g, "").trim();
    };

    try {
      const answer = await req.json();
      const objects = answer.objects;

      let results: InparseAnswer[] = [];
      //  let results: { address: string, objects: InparseObjects[] }[] = [];

      for (const obj of objects) {
        const address = obj.address; // Преобразуем в строку, если адрес существует
        const normalizedAddress = normalizeAddress(
          address.replace(/\d+/g, "").trim()
        ); // Удаление чисел из адреса

        if (address) {
          const foundObjects = await db.inparseObjects.findMany({
            where: {
              OR: [
                {
                  address: {
                    contains: normalizedAddress,
                    mode: "insensitive", // Регистронезависимый поиск
                  },
                },
                {
                  address: {
                    contains: normalizedAddress.split(",")[0], // поиск по улице
                    mode: "insensitive",
                  },
                },
              ],
            },
          });
          // results.push({ address, objects: foundObjects });
          const currentObjects: { address: string, objects: InparseObjects[] }= {
            address: obj.address,
            objects: foundObjects,
          };
          results.push(currentObjects);

          // foundObjects.map((el) => results.push(el));
        }
      }

      // console.log(results)

            // Предполагается, что ответ содержит массив объектов
      // const archiveName = await createArchive(results)
      return NextResponse.json({ results }, { status: 200 });
      
      
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
