import { Router, type IRouter } from "express";
import healthRouter from "./health";
import destinationsRouter from "./destinations";
import ecoRouter from "./eco";
import reviewsRouter from "./reviews";
import handicraftsRouter from "./handicrafts";
import itineraryRouter from "./itinerary";
import budgetRouter from "./budget";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(destinationsRouter);
router.use(ecoRouter);
router.use(reviewsRouter);
router.use(handicraftsRouter);
router.use(itineraryRouter);
router.use(budgetRouter);
router.use(statsRouter);

export default router;
