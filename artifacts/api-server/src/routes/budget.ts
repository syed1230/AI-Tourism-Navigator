import { Router, type IRouter } from "express";
import { CalculateBudgetBody, CalculateBudgetResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const TRANSPORT_COSTS: Record<string, number> = {
  public: 300,
  shared: 600,
  private: 1500,
  eco: 400,
};

const ACCOMMODATION_COSTS: Record<string, number> = {
  budget: 600,
  homestay: 900,
  "mid-range": 1800,
  luxury: 4000,
};

const FOOD_COSTS: Record<string, number> = {
  solo: 400,
  couple: 700,
  family: 1200,
  group: 500,
};

router.post("/budget/calculate", async (req, res): Promise<void> => {
  const parsed = CalculateBudgetBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { days, travelType, accommodationType, transportType, includeLocalShopping } = parsed.data;

  const transportPerDay = TRANSPORT_COSTS[transportType] ?? 600;
  const accomPerDay = ACCOMMODATION_COSTS[accommodationType] ?? 900;
  const foodPerDay = FOOD_COSTS[travelType] ?? 400;

  const transport = transportPerDay * days;
  const accommodation = accomPerDay * days;
  const food = foodPerDay * days;
  const activities = 200 * days;
  const localShopping = includeLocalShopping ? 500 * days : 0;
  const total = transport + accommodation + food + activities + localShopping;

  const people = travelType === "couple" ? 2 : travelType === "family" ? 4 : travelType === "group" ? 6 : 1;
  const perPersonCost = Math.round(total / people);

  const breakdown = [
    { category: "Transport", amount: transport, percentage: Math.round((transport / total) * 100) },
    { category: "Accommodation", amount: accommodation, percentage: Math.round((accommodation / total) * 100) },
    { category: "Food", amount: food, percentage: Math.round((food / total) * 100) },
    { category: "Activities", amount: activities, percentage: Math.round((activities / total) * 100) },
    ...(localShopping > 0
      ? [{ category: "Local Shopping", amount: localShopping, percentage: Math.round((localShopping / total) * 100) }]
      : []),
  ];

  res.json(
    CalculateBudgetResponse.parse({
      transport,
      accommodation,
      food,
      activities,
      localShopping,
      total,
      perPersonCost,
      breakdown,
    })
  );
});

export default router;
