const mongoose = require("mongoose")
const Schema = mongoose.Schema

let ObjectId = Schema.Types.ObjectId

let avatar = require("./avatar")
let Group = new Schema({
    name: String,
    avatar: {
        type: String,
        default() {
            let num = Math.floor(Math.random() * 10)
            return avatar.group[num]
        }
    },
    member: [ObjectId],
    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('group', Group)