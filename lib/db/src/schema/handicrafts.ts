import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const handicraftsTable = pgTable("handicrafts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  artisan: text("artisan").notNull(),
  village: text("village").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertHandicraftSchema = createInsertSchema(handicraftsTable).omit({ id: true, createdAt: true });
export type InsertHandicraft = z.infer<typeof insertHandicraftSchema>;
export type Handicraft = typeof handicraftsTable.$inferSelect;
