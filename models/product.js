var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: String,
    imageId: String,
    category: {type: String, required: true},
    price: {type: Number, required: true},
    instock: {type: Number, required: true},
    description: String,
    size: String,
    color: String,
    weight: String,
    dicountprice: Number,
    visible: {type: String, default: 'متوفر'}
});

module.exports = mongoose.model("Product", productSchema);