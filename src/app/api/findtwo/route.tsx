import { NextRequest, NextResponse } from "next/server";
import db, {SmartAgentObjects } from "../../../../prisma";
import { Worker } from 'worker_threads'
import consola from 'consola'
import os from 'os'
import path from 'path'

function splitArrayIntoChunks(array: SmartAgentObjects[], parts: number) {
  let result = [];
  for (let i = parts; i > 0; i--) {
      result.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return result;
}
const cpuCount = os.cpus().length;
export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    try {
      // Загружаем все объекты из баз данных параллельно
      const [allSmartAgentObj, allIntumAddresses] = await Promise.all([
        db.smartAgentObjects.findMany(),
        db.objectIntrum.findMany({ select: { street: true },}).then((objects) => objects.map((obj) => obj.street)),
      ]);
      const chunks = splitArrayIntoChunks(allSmartAgentObj, cpuCount);
      const promises = chunks.map((chunk, index) => {
          return new Promise((resolve, reject) => {
              consola.info(path.join(process.cwd(), './worker/workertwo.js'));
              const worker = new Worker(path.join(process.cwd(), './worker/workertwo.js'), { workerData: { chunk, allIntumAddresses  } });
              worker.on('message', resolve);
              worker.on('error', reject);
              worker.on('exit', (code) => {
                  if (code !== 0) {
                    reject(new Error(`Worker stopped with exit code ${code}`))
                    consola.fail(code)
                  };
              });
          });
      });

      const results = (await Promise.all(promises)).flat();
     
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
