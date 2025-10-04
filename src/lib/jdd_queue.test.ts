import { describe, it, expect, beforeEach, vi, beforeAll } from "vitest";

const oldManagerFindMock = vi.fn(async () => "FALLBACK");
vi.mock("./intrumCrm", () => ({
  oldManagerFind: oldManagerFindMock,
}));

type Row = { managerId: string | number; createdAt: Date; type: string };
const EXCLUDED = ["VK ЖДД", "Wazzup", "Marquiz Сансара", "whatsapp"];
const state = { active: [] as (string | number)[], queue: [] as Row[] };

vi.mock("../../prisma", () => {
  return {
    default: {
      activeManagers: {
        findMany: async () => state.active.map((id) => ({ manager_id: id })),
      },
      managerQueue: {
        findFirst: async () => {
          const filtered = state.queue
            .filter((r) => !EXCLUDED.includes(r.type))
            .sort((a, b) => {
              const t = b.createdAt.getTime() - a.createdAt.getTime();
              if (t !== 0) {
                return t;
              }
              return b.id.localeCompare(a.id);
            });
          const row = filtered[0];
          return row ? { managerId: row.managerId } : null;
        },
        groupBy: async ({ where, _count, _max }: any) => {
          let rows = state.queue.slice();
          if (where?.createdAt?.gte) {
            rows = rows.filter((r) => r.createdAt >= where.createdAt.gte);
          }
          if (where?.type?.notIn) {
            rows = rows.filter((r) => !where.type.notIn.includes(r.type));
          }
          if (where?.managerId?.in) {
            const allowed = where.managerId.in.map(String);
            rows = rows.filter((r) => allowed.includes(String(r.managerId)));
          }
          const map = new Map<string, Row[]>();
          for (const r of rows) {
            const k = String(r.managerId);
            if (!map.has(k)) map.set(k, []);
            map.get(k)!.push(r);
          }
          const result: any[] = [];
          for (const [k, arr] of map.entries()) {
            const row: any = { managerId: k };
            if (_count?.managerId) row._count = { managerId: arr.length };
            if (_max?.createdAt)
              row._max = {
                createdAt: arr.reduce(
                  (m, x) => (m > x.createdAt ? m : x.createdAt),
                  new Date(0)
                ),
              };
            result.push(row);
          }
          return result;
        },
      },
    },
    __setActive: (ids: (string | number)[]) => {
      state.active = ids.slice();
    },
    __setQueue: (rows: Row[]) => {
      state.queue = rows.slice();
    },
  };
});

let managerFindNew: () => Promise<string>;
let prismaHelpers: any;
beforeAll(async () => {
  ({ managerFindNew } = await import("./jdd_queue"));
  prismaHelpers = await import("../../prisma");
});

const mkDate = (iso: string) => new Date(iso);

describe("managerFindNew", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-09-13T10:00:00.000Z"));
    oldManagerFindMock.mockClear();

    prismaHelpers.__setActive(["2753", "44", "1140", "1944", "332"]);
    prismaHelpers.__setQueue([]);
  });

  it("fallback, если нет активных", async () => {
    prismaHelpers.__setActive([]);
    const res = await managerFindNew();
    expect(res).toBe("FALLBACK");
    expect(oldManagerFindMock).toHaveBeenCalledOnce();
  });

  it("игнорирует исключаемые типы", async () => {
    prismaHelpers.__setQueue([
      {
        managerId: "332",
        createdAt: mkDate("2025-09-12T12:00:00Z"),
        type: "Marquiz",
      },
      {
        managerId: "1140",
        createdAt: mkDate("2025-09-12T11:00:00Z"),
        type: "Marquiz Сансара",
      },
    ]);
    const res = await managerFindNew();
    expect(["2753", "44", "1140", "1944", "332"]).toContain(res);
  });

  it("запрет 'две подряд' при наличии альтернатив", async () => {
    prismaHelpers.__setQueue([
      {
        managerId: "332",
        createdAt: mkDate("2025-09-12T23:59:59Z"),
        type: "Marquiz",
      },
    ]);
    const res = await managerFindNew();
    expect(res).not.toBe("332");
  });

  it("первая выдача тянется к весам: побеждает 2753", async () => {
    prismaHelpers.__setQueue([]);
    const res = await managerFindNew();
    expect(res).toBe("2753");
  });

  it("если 2753 слишком много, выбирается другой (например 44)", async () => {
    const rows: Row[] = [];
    for (let i = 0; i < 10; i++) {
      rows.push({
        managerId: "2753",
        createdAt: mkDate(`2025-09-12T10:${String(i).padStart(2, "0")}:00Z`),
        type: "Marquiz",
      });
    }
    prismaHelpers.__setQueue(rows);
    const res = await managerFindNew();
    expect(res).not.toBe("2753");
  });

  it("если один активный менеджер в бд и он же последний — разрешаем повтор", async () => {
    prismaHelpers.__setActive(["1140"]);
    prismaHelpers.__setQueue([
      {
        managerId: "1140",
        createdAt: mkDate("2025-09-12T23:59:59Z"),
        type: "Marquiz",
      },
    ]);
    const res = await managerFindNew();
    expect(res).toBe("1140");
  });
});

it("массовая симуляция 200 заявок: квоты 3:2:1 соблюдаются, x1 ~равны, подряд не повторяются", async () => {
  prismaHelpers.__setActive(["2753", "44", "1140", "1944", "332"]);
  prismaHelpers.__setQueue([]);

  const start = mkDate("2025-09-06T10:00:00Z"); // <-- фикс
  const addMinutes = (d: Date, m: number) => new Date(d.getTime() + m * 60_000);

  const counts: Record<string, number> = {
    "2753": 0,
    "44": 0,
    "1140": 0,
    "1944": 0,
    "332": 0,
  };
  let prev: string | null = null;
  let hadConsecutive = false;

  for (let i = 0; i < 200; i++) {
    const id = await managerFindNew();
    state.queue.push({
      managerId: id,
      createdAt: addMinutes(start, i),
      type: "Marquiz",
    });
    counts[id] = (counts[id] ?? 0) + 1;

    if (prev === id) hadConsecutive = true;
    prev = id;
  }

  console.log("=== Итоговое распределение (200 заявок) ===");
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  for (const [id, cnt] of Object.entries(counts)) {
    const pct = ((cnt / total) * 100).toFixed(1);
    console.log(`Менеджер ${id}: ${cnt} (${pct}%)`);
  }

  const expected = { "2753": 75, "44": 50, "1140": 25, "1944": 25, "332": 25 };
  const TOL = 5;

  for (const k of Object.keys(expected)) {
    expect(Math.abs(counts[k] - (expected as any)[k])).toBeLessThanOrEqual(TOL);
  }

  const x1 = [counts["1140"], counts["1944"], counts["332"]];
  expect(Math.max(...x1) - Math.min(...x1)).toBeLessThanOrEqual(TOL);

  expect(hadConsecutive).toBe(false);
});
