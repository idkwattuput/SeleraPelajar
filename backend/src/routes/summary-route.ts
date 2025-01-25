import express from "express";
import summaryController from "../controllers/summary-controller";

const router = express.Router();

router.route("/").get(summaryController.getSummary);
router.route("/week-revenue").get(summaryController.getWeekRevenue);

export default router;
