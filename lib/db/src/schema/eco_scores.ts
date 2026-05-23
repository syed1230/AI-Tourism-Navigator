import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ecoScoresTable = pgTable("eco_scores", {
  id: serial("id").primaryKey(),
  userName: text("user_name").notNull(),
  action: text("action").notNull(),
  points: integer("points").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertEcoScoreSchema = createInsertSchema(ecoScoresTable).omit({ id: true, createdAt: true });
export type InsertEcoScore = z.infer<typeof insertEcoScoreSchema>;
export type EcoScore = typeof ecoScoresTable.$inferSelect;
