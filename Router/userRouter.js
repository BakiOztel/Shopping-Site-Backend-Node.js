const router = require("express").Router();
const refreshTokenController = require("../Controller/refreshTokenController.js");
const userController = require("../Controller/userController.js");
router.post("/userLogin", userController.userLogin);
router.post("/userRegister", userController.userRegister);
router.post("/refresh", refreshTokenController.refreshTokenHandler);
router.post("/logOut", userController.userLogOut);
module.exports = router;    