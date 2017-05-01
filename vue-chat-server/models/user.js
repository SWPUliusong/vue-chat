const mongoose = require("mongoose")
const Schema = mongoose.Schema

let ObjectId = Schema.Types.ObjectId

let avatar = require("./avatar")
let User = new Schema({
    name: String,
    email: String,
    password: String,
    friends: [ObjectId],
    groups: [ObjectId],
    createAt: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        default() {
            let num = Math.floor(Math.random() * 10)
            return avatar.user[num]
        }
    }
})

module.exports = mongoose.model('user', User)