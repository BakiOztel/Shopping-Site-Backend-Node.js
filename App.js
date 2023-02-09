const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const productRouter = require("./Router/productsRouter.js");
const userRouter = require("./Router/userRouter.js");
const paymentRouter = require("./Router/paymentRouter.js");
require("dotenv").config();
const App = express();


//Middleware 

App.use(cors({ credentials: true, origin: true }));
App.use(cookieParser());
App.use(express.urlencoded({ extended: true }));
App.use(express.json());
App.use(productRouter);
App.use(paymentRouter);
App.use(userRouter);


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.DATA_BS).then(() => {
    App.listen(PORT, () => console.log(`Start ${PORT}`));
}).catch(err => {
    console.log(err);
});