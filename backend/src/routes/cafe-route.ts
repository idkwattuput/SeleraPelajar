import express from "express";
import multer from "multer";
import path from "path";
import { verifyJWT } from "../middlewares/jwt";
import cafeController from "../controllers/cafe-controller";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "public/cafes");
  },
  filename: (_, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname),
    );
  },
});
const upload = multer({ storage: storage });

router
  .route("/")
  .get(cafeController.getCafes)
  .post(upload.single("cafeImage"), verifyJWT, cafeController.createCafe)
  .put(verifyJWT, cafeController.updateCafe);
router
  .route("/image")
  .put(upload.single("cafeImage"), verifyJWT, cafeController.updateCafeImage);
router.route("/items").get(verifyJWT, cafeController.getItemsByCafeId);
router.route("/seller").get(verifyJWT, cafeController.getCafeBySellerId);
router
  .route("/:id")
  .get(cafeController.getCafe)
  .put(cafeController.updateCafeOpen);

export default router;
