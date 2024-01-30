const mongoose = require("mongoose")

const plm = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

userSchema.plugin(plm)

module.exports = mongoose.model("user", userSchema)