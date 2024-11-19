import express from "express";
import cafeController from "../controllers/cafe-controller";

const router = express.Router();

router.route("/").get(cafeController.getCafes);
router.route("/:id").get(cafeController.getCafe);

export default router;
