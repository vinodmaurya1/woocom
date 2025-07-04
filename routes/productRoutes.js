const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const productController = require("../controllers/productController");

router.post("/", authMiddleware, upload.single("image"), productController.createProduct);
router.get("/",authMiddleware, productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", authMiddleware, upload.single("image"), productController.updateProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
