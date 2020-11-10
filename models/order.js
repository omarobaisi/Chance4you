var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
    user   : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    cart   : {type: Object, required: true},
    city   : {type: String, required: true},
    address: {type: String, required: true},
    email  : String,
    phone  : {type: Number, required: true},
    name   : {type: String, required: true},
    delivered: {type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);