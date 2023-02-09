const router = require("express").Router();
const productController = require("../Controller/productController.js");

router.get("/products/search", productController.getProducts);
router.get("/product/:id", productController.productDetails);
router.post("/AddBasket", productController.AddBasket);
router.post("/getBasket", productController.getBasket);
router.post("/deleteProductBasket", productController.deleteProductBasket);


module.exports = router;