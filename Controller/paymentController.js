const userModel = require("../Model/userModel.js");
const jwt = require("jsonwebtoken");
const orderModel = require("../Model/ordersModel.js");

exports.postPayment = (req, res, next) => {
    if (!req.body.accesToken) return res.status(400);
    const accesToken = req.body.accesToken;
    const data = req.body.data;
    jwt.verify(accesToken, process.env.JWT_KEY, async (err, decoded) => {
        if (err) return res.status(400);
        const foundUser = await userModel.findById({ _id: decoded.userInfo._id });
        if (!foundUser) return res.status(401);
        await foundUser.AddToOrders(data).then((data) => {
            res.status(200).json({ message: "succes" })
        }).catch(err => {
            res.status(400).json({ message: "unexpected error" })
        })
    });
}

exports.getOrder = (req, res, next) => {
    const accesToken = req.headers.authorization;
    if (!accesToken) return res.status(400);
    jwt.verify(accesToken, process.env.JWT_KEY, async (err, decoded) => {
        if (err) return res.status(400);
        const UserOrders = await userModel.findById({ _id: decoded.userInfo._id }).populate({
            path: "orders.ordersId",
        }).select("orders");
        if (!UserOrders) return res.status(401);
        res.status(200).json({ orders: UserOrders });
    });
}