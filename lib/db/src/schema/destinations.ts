import { pgTable, text, serial, timestamp, integer, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const destinationsTable = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  ecoScore: integer("eco_score").notNull().default(50),
  tribalStory: text("tribal_story").notNull(),
  culturalInfo: text("cultural_info").notNull(),
  traditions: text("traditions").notNull(),
  imageUrl: text("image_url").notNull(),
  isHiddenGem: boolean("is_hidden_gem").notNull().default(false),
  rating: real("rating").notNull().default(4.0),
  visitCount: integer("visit_count").notNull().default(0),
  bestSeason: text("best_season"),
  entryFee: integer("entry_fee"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDestinationSchema = createInsertSchema(destinationsTable).omit({ id: true, createdAt: true });
export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinationsTable.$inferSelect;
