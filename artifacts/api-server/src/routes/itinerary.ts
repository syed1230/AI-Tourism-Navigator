import { Router, type IRouter } from "express";
import { db, destinationsTable } from "@workspace/db";
import { GenerateItineraryBody, GenerateItineraryResponse } from "@workspace/api-zod";

const INTEREST_CATEGORY_MAP: Record<string, string> = {
  nature: "eco",
  waterfalls: "waterfall",
  wildlife: "forest",
  temples: "temple",
  villages: "village",
  "tribal culture": "village",
  adventure: "forest",
};

const ACCOMMODATION_BY_TYPE = {
  solo: { type: "Budget Guesthouse", cost: 800 },
  couple: { type: "Eco Homestay", cost: 1500 },
  family: { type: "Forest Resort", cost: 2500 },
  group: { type: "Community Homestay", cost: 600 },
};

const ECO_TIPS = [
  "Use shared jeep safaris instead of private vehicles inside forests",
  "Stay at certified eco-homestays that support local families",
  "Buy handicrafts directly from tribal artisans at village markets",
  "Carry a reusable water bottle — plastic is banned in most forest areas",
  "Hire local tribal guides to support community livelihoods",
  "Avoid single-use plastics — bring cloth bags for local market shopping",
  "Respect tribal customs — ask permission before photographing people",
];

const router: IRouter = Router();

router.post("/itinerary/generate", async (req, res): Promise<void> => {
  const parsed = GenerateItineraryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { days, budget, interests, travelType } = parsed.data;

  const allDestinations = await db.select().from(destinationsTable);

  const preferredCategories = interests
    .map((i) => INTEREST_CATEGORY_MAP[i.toLowerCase()] ?? i)
    .filter(Boolean);

  const scored = allDestinations
    .map((d) => ({
      ...d,
      score: preferredCategories.includes(d.category) ? 2 : 1,
    }))
    .sort((a, b) => b.score - a.score || b.ecoScore - a.ecoScore);

  const perDayBudget = Math.floor(budget / days);
  const accommodation = ACCOMMODATION_BY_TYPE[travelType as keyof typeof ACCOMMODATION_BY_TYPE] ?? ACCOMMODATION_BY_TYPE.solo;

  const itineraryDays = [];
  let totalCost = 0;

  for (let day = 1; day <= days; day++) {
    const startIdx = ((day - 1) * 2) % scored.length;
    const dayDestinations = [
      scored[startIdx]?.name ?? "Ranchi City Tour",
      scored[(startIdx + 1) % scored.length]?.name ?? "Local Village Visit",
    ];

    const dayDest = scored[startIdx];
    const activities = dayDest
      ? [
          `Explore ${dayDest.name} — ${dayDest.category} experience`,
          `Learn about local ${dayDest.category === "village" ? "tribal traditions" : "ecology and nature"}`,
          "Evening interaction with local community",
        ]
      : ["Explore the local market", "Cultural walk", "Evening by the riverside"];

    const dayCost = Math.min(perDayBudget, accommodation.cost + 500 + (dayDest?.entryFee ?? 0) + 300);
    totalCost += dayCost;

    itineraryDays.push({
      day,
      destinations: dayDestinations,
      activities,
      accommodation: accommodation.type,
      estimatedCost: dayCost,
      ecoScore: dayDest?.ecoScore ?? 60,
    });
  }

  const selectedTips = ECO_TIPS.slice(0, 4);

  res.json(
    GenerateItineraryResponse.parse({
      days: itineraryDays,
      totalEstimatedCost: totalCost,
      ecoTips: selectedTips,
      summary: `A ${days}-day ${travelType} eco-journey through Jharkhand focusing on ${interests.join(", ")}, designed for a budget of ₹${budget.toLocaleString("en-IN")}.`,
    })
  );
});

export default router;
