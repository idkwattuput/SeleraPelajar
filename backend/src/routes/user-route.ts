import express from "express";
import userController from "../controllers/user-controller";

const router = express.Router();

router.route("/").get(userController.getUser).put(userController.updateUser);
router.route("/change-password").put(userController.updatePassword);

export default router;
