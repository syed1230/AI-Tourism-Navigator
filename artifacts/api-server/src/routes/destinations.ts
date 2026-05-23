import { Router, type IRouter } from "express";
import { eq, like, and, desc, sql } from "drizzle-orm";
import { db, destinationsTable } from "@workspace/db";
import {
  ListDestinationsQueryParams,
  CreateDestinationBody,
  GetDestinationParams,
  ListDestinationsResponse,
  GetDestinationResponse,
  GetDestinationStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/destinations/stats/summary", async (_req, res): Promise<void> => {
  const all = await db.select().from(destinationsTable);

  const categoryMap: Record<string, number> = {};
  for (const d of all) {
    categoryMap[d.category] = (categoryMap[d.category] || 0) + 1;
  }
  const categoryBreakdown = Object.entries(categoryMap).map(([category, count]) => ({ category, count }));

  const topRated = [...all].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const hiddenGemsCount = all.filter((d) => d.isHiddenGem).length;

  res.json(
    GetDestinationStatsResponse.parse({
      categoryBreakdown,
      topRated,
      totalCount: all.length,
      hiddenGemsCount,
    })
  );
});

router.get("/destinations", async (req, res): Promise<void> => {
  const query = ListDestinationsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { category, search, featured } = query.data;

  const conditions = [];
  if (category) conditions.push(eq(destinationsTable.category, category));
  if (search) conditions.push(like(destinationsTable.name, `%${search}%`));
  if (featured !== undefined) conditions.push(eq(destinationsTable.isHiddenGem, featured));

  const destinations =
    conditions.length > 0
      ? await db.select().from(destinationsTable).where(and(...conditions))
      : await db.select().from(destinationsTable);

  res.json(ListDestinationsResponse.parse(destinations));
});

router.post("/destinations", async (req, res): Promise<void> => {
  const parsed = CreateDestinationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [dest] = await db.insert(destinationsTable).values(parsed.data).returning();
  res.status(201).json(GetDestinationResponse.parse(dest));
});

router.get("/destinations/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetDestinationParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [dest] = await db.select().from(destinationsTable).where(eq(destinationsTable.id, params.data.id));
  if (!dest) {
    res.status(404).json({ error: "Destination not found" });
    return;
  }

  res.json(GetDestinationResponse.parse(dest));
});

export default router;
