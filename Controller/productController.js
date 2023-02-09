const productModel = require("../Model/productModel.js");
const sellerModel = require("../Model/sellerModel.js");
const userModel = require("../Model/userModel.js");
const jwt = require("jsonwebtoken");
exports.getProducts = async (req, res, next) => {
    //pull products
    try {
        const data = await productModel.find({ name: { $regex: req.query.q, $options: "i" }, star: { $gte: req.query.star || 0 }, tag: { $regex: req.query.tag || "", $options: "i" } }
            , "name star price _id").limit(10).exec();
        res.status(200).json(data);

    } catch (err) {
        console.log(err);
        res.status(400).json([]);
    }

}
exports.productDetails = async (req, res, next) => {
    try {
        const data = await productModel.findOne({ _id: req.params.id }).populate({ path: "sellerId" });
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "product not found" });
    }
}


exports.AddBasket = async (req, res, next) => {
    const accesToken = req.body.accesToken;
    if (!accesToken) return res.status(403);
    const product = await productModel.findOne({ _id: req.body.postId }).exec();
    if (!product) return res.status(400);

    jwt.verify(accesToken, process.env.JWT_KEY,
        async (err, decoded) => {
            if (err) return res.status(403);
            const foundUser = await userModel.findById({ _id: decoded.userInfo._id });
            await foundUser.AddToBasket(product).then(() => {
                res.status(200).json({ message: "succes" })
            }).catch(err => {
                res.status(400).json({ message: "unexpected error" })
            })
        }
    )
}

exports.getBasket = (req, res, next) => {

    // we pull the user's cart
    const accesToken = req.body.accesToken;
    // reject if no accessToken
    if (!accesToken) return res.status(403);
    jwt.verify(accesToken, process.env.JWT_KEY, async (err, decoded) => {
        // reject if key could not be verified with accessToken
        if (err) return res.status(403);
        const foundUser = await userModel.findOne({ _id: decoded.userInfo._id }).populate({
            path: "basket.items.productId",
            populate: {
                path: "sellerId",
                select: "name _id"
            }
        });
        res.status(200).json(foundUser.basket)
    });

}
exports.deleteProductBasket = (req, res, next) => {
    const index = req.body.index;
    const cost = req.body.cost;
    const accesToken = req.headers.authorization;
    jwt.verify(accesToken, process.env.JWT_KEY, async (err, decoded) => {

        // reject if key could not be verified with accessToken
        if (err) return res.status(403);
        const foundUser = await userModel.findById({ _id: decoded.userInfo._id });

        //reject if there is no such user
        if (!foundUser) return res.status(403);
        await foundUser.DeleteProductFromBasket(index, cost);
        res.status(200).json({ message: "succes" });
    });
}