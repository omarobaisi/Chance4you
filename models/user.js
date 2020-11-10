var mongoose              = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    phone: Number,
    city: String,
    address: String,
    isAdmin: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose, {usernameField : "email"});

module.exports = mongoose.model('User', userSchema);