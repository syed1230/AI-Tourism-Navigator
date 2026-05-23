import { Router, type IRouter } from "express";
import { like, and, eq } from "drizzle-orm";
import { db, handicraftsTable } from "@workspace/db";
import { ListHandicraftsQueryParams, ListHandicraftsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/handicrafts", async (req, res): Promise<void> => {
  const query = ListHandicraftsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { category, search } = query.data;
  const conditions = [];
  if (category) conditions.push(eq(handicraftsTable.category, category));
  if (search) conditions.push(like(handicraftsTable.name, `%${search}%`));

  const items =
    conditions.length > 0
      ? await db.select().from(handicraftsTable).where(and(...conditions))
      : await db.select().from(handicraftsTable);

  res.json(ListHandicraftsResponse.parse(items));
});

export default router;
