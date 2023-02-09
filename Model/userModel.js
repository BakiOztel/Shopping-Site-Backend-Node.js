const mongoose = require("mongoose");
const orderModel = require("./ordersModel.js");

const userModel = mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true
    },
    refreshToken: [String]
    ,
    basket: {
        items: [{
            productId: {
                type: mongoose.Types.ObjectId,
                ref: 'products',
                required: true
            },
            qty: {
                type: Number,
                required: true
            }
        }],
        totalPrice: Number
    },
    orders: [{
        ordersId: {
            default: null,
            type: mongoose.Schema.Types.ObjectId,
            ref: "orders"
        }
    }]
});
userModel.methods.AddToOrders = async function (data) {
    const basket = this.basket;
    const orders = this.orders;
    const newOrder = await new orderModel({
        items: basket.items,
        OrderAdress: {
            OpenAdress: data.adress,
            phoneNumber: data.phoneNumber
        },
        totalPrice: basket.totalPrice
    });
    await newOrder.save();
    this.basket.items = [];
    this.basket.totalPrice = 0;
    orders.push({ ordersId: newOrder._id });
    return this.save();

}
userModel.methods.AddToBasket = function (product) {
    if (product) {
        const basket = this.basket;
        const isThere = basket.items.findIndex(objInItems => new String(objInItems.productId).trim() === new String(product._id).trim());
        if (isThere >= 0) {
            basket.items[isThere].qty += 1;
        } else {
            basket.items.push({ productId: product._id, qty: 1 });
        }
        if (!basket.totalPrice) {
            basket.totalPrice = 0;
        }
        basket.totalPrice += product.price;
        return this.save();
    }
}
userModel.methods.DeleteProductFromBasket = function (index, cost) {
    const basket = this.basket;
    basket.totalPrice -= cost;
    basket.items.splice(index, 1)
    return this.save();
}


module.exports = mongoose.model("users", userModel);