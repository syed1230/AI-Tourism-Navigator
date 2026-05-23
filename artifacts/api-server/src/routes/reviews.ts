import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, reviewsTable, destinationsTable } from "@workspace/db";
import {
  ListReviewsQueryParams,
  CreateReviewBody,
  ListReviewsResponse,
  GetSentimentSummaryResponse,
} from "@workspace/api-zod";

function analyzeSentiment(text: string, rating: number): string {
  const positive = ["amazing", "beautiful", "wonderful", "excellent", "great", "fantastic", "loved", "awesome", "stunning", "breathtaking", "perfect", "superb"];
  const negative = ["bad", "terrible", "awful", "worst", "horrible", "disappointing", "dirty", "poor", "waste", "crowded", "overrated", "dirty"];
  const lower = text.toLowerCase();
  const posCount = positive.filter((w) => lower.includes(w)).length;
  const negCount = negative.filter((w) => lower.includes(w)).length;

  if (rating >= 4 || posCount > negCount) return "positive";
  if (rating <= 2 || negCount > posCount) return "negative";
  return "neutral";
}

const router: IRouter = Router();

router.get("/reviews/sentiment/summary", async (_req, res): Promise<void> => {
  const reviews = await db.select().from(reviewsTable).orderBy(reviewsTable.createdAt);

  const positive = reviews.filter((r) => r.sentiment === "positive").length;
  const neutral = reviews.filter((r) => r.sentiment === "neutral").length;
  const negative = reviews.filter((r) => r.sentiment === "negative").length;
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const recentReviews = [...reviews]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5)
    .map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));

  res.json(
    GetSentimentSummaryResponse.parse({
      positive,
      neutral,
      negative,
      total: reviews.length,
      recentReviews,
      averageRating: Math.round(avgRating * 10) / 10,
    })
  );
});

router.get("/reviews", async (req, res): Promise<void> => {
  const query = ListReviewsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { destinationId, sentiment } = query.data;
  let all = await db.select().from(reviewsTable);

  if (destinationId) all = all.filter((r) => r.destinationId === destinationId);
  if (sentiment) all = all.filter((r) => r.sentiment === sentiment);

  const mapped = all.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
  res.json(ListReviewsResponse.parse(mapped));
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [dest] = await db
    .select({ name: destinationsTable.name })
    .from(destinationsTable)
    .where(eq(destinationsTable.id, parsed.data.destinationId));

  const destinationName = dest?.name ?? "Unknown";
  const sentiment = analyzeSentiment(parsed.data.text, parsed.data.rating);

  const [review] = await db
    .insert(reviewsTable)
    .values({ ...parsed.data, destinationName, sentiment })
    .returning();

  res.status(201).json({ ...review, createdAt: review.createdAt.toISOString() });
});

export default router;
