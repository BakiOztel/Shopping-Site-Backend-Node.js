const router = require("express").Router();
const paymentController = require("../Controller/paymentController.js");

router.post("/postPayment", paymentController.postPayment);
router.get("/getOrder", paymentController.getOrder);
module.exports = router;