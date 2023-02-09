const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    items: [{
        productId: {
            type: mongoose.Types.ObjectId,
            ref: "products",
            required: true
        },
        qty: {
            type: Number,
            required: true
        }
    }],
    OrderAdress: {
        OpenAdress: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        }
    },
    totalPrice: {
        type: Number
    }
});

module.exports = mongoose.model("orders", orderSchema);