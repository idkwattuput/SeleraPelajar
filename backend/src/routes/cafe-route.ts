import express, { Router } from "express";
import type { CafeController } from "../controllers/cafe-controller";

export class CafeRoute {
  cafeController: CafeController;
  router: Router;

  constructor(cafeController: CafeController) {
    this.cafeController = cafeController;
    this.router = express.Router();
    this.setRoute();
  }

  private setRoute() {
    this.router
      .route("/")
      .get(this.cafeController.getCafes.bind(this.cafeController));
    this.router
      .route("/:id")
      .get(this.cafeController.getCafe.bind(this.cafeController));
  }
}
