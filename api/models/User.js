const mongoose = require('mongoose')
const { type } = require('os')
const {Schema, model} = mongoose

const UserSchema = new Schema({
    username: {type: String, requied: true, min: 4, unique: true},
    password: {type: String, required: true}
})

const UserModel = model('User', UserSchema)

module.exports = UserModel;