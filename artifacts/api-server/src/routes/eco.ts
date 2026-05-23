import { Router, type IRouter } from "express";
import { eq, sum, desc } from "drizzle-orm";
import { db, ecoScoresTable } from "@workspace/db";
import {
  AddEcoScoreBody,
  GetUserEcoScoreParams,
  GetEcoLeaderboardResponse,
  GetUserEcoScoreResponse,
} from "@workspace/api-zod";

const BADGE_THRESHOLDS = [
  { badge: "guardian", min: 500 },
  { badge: "forest", min: 200 },
  { badge: "tree", min: 100 },
  { badge: "sapling", min: 50 },
  { badge: "seed", min: 0 },
];

function getBadge(points: number): string {
  for (const t of BADGE_THRESHOLDS) {
    if (points >= t.min) return t.badge;
  }
  return "seed";
}

async function buildLeaderboard() {
  const rows = await db
    .select({
      userName: ecoScoresTable.userName,
      totalPoints: sum(ecoScoresTable.points),
    })
    .from(ecoScoresTable)
    .groupBy(ecoScoresTable.userName)
    .orderBy(desc(sum(ecoScoresTable.points)));

  return rows.map((r, i) => ({
    name: r.userName,
    totalPoints: Number(r.totalPoints ?? 0),
    badge: getBadge(Number(r.totalPoints ?? 0)),
    rank: i + 1,
    actions: [],
  }));
}

const router: IRouter = Router();

router.get("/eco/leaderboard", async (_req, res): Promise<void> => {
  const board = await buildLeaderboard();
  res.json(GetEcoLeaderboardResponse.parse(board));
});

router.post("/eco/scores", async (req, res): Promise<void> => {
  const parsed = AddEcoScoreBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [entry] = await db.insert(ecoScoresTable).values(parsed.data).returning();
  res.status(201).json({
    id: entry.id,
    userName: entry.userName,
    action: entry.action,
    points: entry.points,
    createdAt: entry.createdAt.toISOString(),
  });
});

router.get("/eco/user/:name", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.name) ? req.params.name[0] : req.params.name;
  const params = GetUserEcoScoreParams.safeParse({ name: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const actions = await db
    .select()
    .from(ecoScoresTable)
    .where(eq(ecoScoresTable.userName, params.data.name));

  const totalPoints = actions.reduce((s, a) => s + a.points, 0);
  const board = await buildLeaderboard();
  const rankEntry = board.find((u) => u.name === params.data.name);

  const user = {
    name: params.data.name,
    totalPoints,
    badge: getBadge(totalPoints),
    rank: rankEntry?.rank ?? board.length + 1,
    actions: actions.map((a) => ({
      id: a.id,
      userName: a.userName,
      action: a.action,
      points: a.points,
      createdAt: a.createdAt.toISOString(),
    })),
  };

  res.json(GetUserEcoScoreResponse.parse(user));
});

export default router;
