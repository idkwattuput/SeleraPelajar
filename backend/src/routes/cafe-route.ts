import express from "express";
import multer from "multer";
import path from "path";
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
  .post(upload.single("cafeImage"), cafeController.createCafe);
router.route("/:id").get(cafeController.getCafe);

export default router;
