const mongoose = require("mongoose");

const sellerModel = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    products: [{
        default: null,
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    }]
});

module.exports = mongoose.model("seller", sellerModel);