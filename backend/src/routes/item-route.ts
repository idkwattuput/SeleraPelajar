import express from "express";
import multer from "multer";
import path from "path";
import itemController from "../controllers/item-controller";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "public/items");
  },
  filename: (_, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname),
    );
  },
});
const upload = multer({ storage: storage });

router.route("/").post(upload.single("itemImage"), itemController.createItem);
router.route("/:id").put(itemController.updateAvailableItem);

export default router;
