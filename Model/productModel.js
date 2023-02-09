const mongoose = require("mongoose");

const productModel = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true
    },
    category: {
        type: String
    },
    star: {
        type: Number,
        default: 0
    },
    image: {
        data: {
            type: String
        },
        contentType: {
            type: String
        }
    },
    definition: {
        type: String,
        default: ""
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "seller",
        default: null
    },
    tag: {
        type: String,
        require: true,
    }
});

module.exports = mongoose.model("products", productModel);