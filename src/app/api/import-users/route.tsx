import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma";
import { BodyImport } from "../../../../@types/dto";
import { buildPhonePairs } from "./utils";

const twoWeeksFromNow = () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

export async function POST(req: NextRequest) {
  const body = (await req.json()) as BodyImport | null;

  if (!body?.phones?.length) {
    return NextResponse.json({ message: "phones[] required" }, { status: 400 });
  }

  const names = Array.isArray(body.names) ? body.names : [];

  const pairs = buildPhonePairs(body.phones, names);

  if (!pairs.length) {
    return NextResponse.json(
      { message: "нет номеров формата +7 " },
      { status: 400 }
    );
  }

  // Убирает дубли внутри файла
  const seen = new Set<string>();
  const unique = pairs.filter(({ phoneNumber }) =>
    seen.has(phoneNumber) ? false : (seen.add(phoneNumber), true)
  );

  const deleteAt = twoWeeksFromNow();
  const phoneNumbers = unique.map((x) => x.phoneNumber);

  // Находит, какие номера уже есть в базе
  const existing = await prisma.usersForMailing.findMany({
    where: { phoneNumber: { in: phoneNumbers } },
    select: { phoneNumber: true },
  });

  const existingSet = new Set(existing.map((e) => e.phoneNumber));

  const toUpdate = unique.filter((p) => existingSet.has(p.phoneNumber));
  const toCreate = unique.filter((p) => !existingSet.has(p.phoneNumber));

  // Создаёт новые
  let inserted = 0;
  if (toCreate.length) {
    const createRes = await prisma.usersForMailing.createMany({
      data: toCreate.map(({ phoneNumber, name, type }) => ({
        phoneNumber,
        name,
        type,
        deleteAt,
      })),
      skipDuplicates: true,
    });
    inserted = createRes.count ?? 0;
  }

  // Обновляем deleteAt (и, если нужно, name и type)
  let updated = 0;
  if (toUpdate.length) {
    await Promise.all(
      toUpdate.map(({ phoneNumber, name, type }) =>
        prisma.usersForMailing.update({
          where: { phoneNumber },
          data: {
            deleteAt,
            ...(name ? { name } : {}),
            ...(type ? { type } : {}),
          },
        })
      )
    );
    updated = toUpdate.length;
  }

  // Дубликаты
  const duplicates = unique.length - inserted - updated;

  //  все записи по этим номерам (и новые, и обновлённые)
  const saved = await prisma.usersForMailing.findMany({
    where: { phoneNumber: { in: phoneNumbers } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    {
      inserted, // сколько реально новых создано
      updated, // сколько существующих обновлено (продлили deleteAt)
      duplicates, // сколько "потеряли" из-за дублей внутри файла
      totalReceived: body.phones.length,
      valid: pairs.length,
      unique: unique.length,
      saved,
    },
    { status: 200 }
  );
}
