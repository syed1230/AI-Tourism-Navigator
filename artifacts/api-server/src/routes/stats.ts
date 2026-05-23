import { Router, type IRouter } from "express";
import { sum, desc } from "drizzle-orm";
import { db, destinationsTable, reviewsTable, ecoScoresTable, handicraftsTable } from "@workspace/db";
import { GetDashboardStatsResponse } from "@workspace/api-zod";

function getBadge(points: number): string {
  if (points >= 500) return "guardian";
  if (points >= 200) return "forest";
  if (points >= 100) return "tree";
  if (points >= 50) return "sapling";
  return "seed";
}

const router: IRouter = Router();

router.get("/stats/dashboard", async (_req, res): Promise<void> => {
  const [destinations, reviews, handicrafts, ecoRows] = await Promise.all([
    db.select().from(destinationsTable),
    db.select().from(reviewsTable).orderBy(desc(reviewsTable.createdAt)),
    db.select().from(handicraftsTable),
    db
      .select({ userName: ecoScoresTable.userName, totalPoints: sum(ecoScoresTable.points) })
      .from(ecoScoresTable)
      .groupBy(ecoScoresTable.userName)
      .orderBy(desc(sum(ecoScoresTable.points))),
  ]);

  const positive = reviews.filter((r) => r.sentiment === "positive").length;
  const neutral = reviews.filter((r) => r.sentiment === "neutral").length;
  const negative = reviews.filter((r) => r.sentiment === "negative").length;
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const categoryMap: Record<string, number> = {};
  for (const d of destinations) {
    categoryMap[d.category] = (categoryMap[d.category] || 0) + 1;
  }

  const topEcoUsers = ecoRows.slice(0, 5).map((r, i) => ({
    name: r.userName,
    totalPoints: Number(r.totalPoints ?? 0),
    badge: getBadge(Number(r.totalPoints ?? 0)),
    rank: i + 1,
    actions: [],
  }));

  const recentActivity = reviews.slice(0, 5).map((r) => ({
    type: "review",
    message: `${r.userName} reviewed ${r.destinationName} — ${r.sentiment}`,
    createdAt: r.createdAt.toISOString(),
  }));

  res.json(
    GetDashboardStatsResponse.parse({
      totalDestinations: destinations.length,
      totalReviews: reviews.length,
      totalEcoUsers: ecoRows.length,
      totalHandicrafts: handicrafts.length,
      sentimentBreakdown: {
        positive,
        neutral,
        negative,
        total: reviews.length,
        recentReviews: reviews.slice(0, 5).map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
        averageRating: Math.round(avgRating * 10) / 10,
      },
      categoryBreakdown: Object.entries(categoryMap).map(([category, count]) => ({ category, count })),
      topEcoUsers,
      recentActivity,
    })
  );
});

export default router;
