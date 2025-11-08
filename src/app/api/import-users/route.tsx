import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma";
import { BodyImport } from "../../../../@types/dto";

const twoWeeksFromNow = () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

/** Приводит номер к формату +7XXXXXXXXXX (если возможно), иначе возвращает пустую строку */
function normalizeToRuE164(input: unknown): string {
  const digits = String(input ?? "").replace(/\D/g, "");

  if (/^7\d{10}$/.test(digits)) return `+${digits}`;
  if (/^8\d{10}$/.test(digits)) return `+7${digits.slice(1)}`;
  if (/^\d{10}$/.test(digits) && digits.startsWith("9")) return `+7${digits}`;
  if (/^\+7\d{10}$/.test(String(input))) return String(input);

  return "";
}

/** Проверяет формат строго как +7XXXXXXXXXX */
function isRuE164(phone: string): boolean {
  return /^\+7\d{10}$/.test(phone);
}


export async function POST(req: NextRequest) {
  const body = (await req.json()) as BodyImport | null;

  if (!body?.phones?.length) {
    return NextResponse.json({ message: "phones[] required" }, { status: 400 });
  }

  const names = Array.isArray(body.names) ? body.names : [];

  const pairs = body.phones
    .map((p, i) => ({
      phoneNumber: normalizeToRuE164(p),
      name: names[i] ?? null,
    }))
    .filter((x) => isRuE164(x.phoneNumber));

  if (!pairs.length) {
    return NextResponse.json(
      { message: "no valid +7 phones" },
      { status: 400 }
    );
  }

  const seen = new Set<string>();
  const unique = pairs.filter(({ phoneNumber }) =>
    seen.has(phoneNumber) ? false : (seen.add(phoneNumber), true)
  );

  const createRes = await prisma.usersForMailing.createMany({
    data: unique.map(({ phoneNumber, name }) => ({
      phoneNumber,
      name,
      deleteAt: twoWeeksFromNow(),
    })),
    skipDuplicates: true,
  });

  const inserted = createRes.count ?? 0;
  const duplicates = unique.length - inserted;
  const updated = 0; 

  const saved = await prisma.usersForMailing.findMany({
    where: { phoneNumber: { in: unique.map((x) => x.phoneNumber) } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    {
      inserted,
      updated,
      duplicates,
      totalReceived: body.phones.length,
      valid: pairs.length,
      unique: unique.length,
      saved,
    },
    { status: 200 }
  );
}



