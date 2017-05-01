const mongoose = require("mongoose")
const Schema = mongoose.Schema

let ObjectId = Schema.Types.ObjectId

let Message = new Schema({
    toGroup: ObjectId,
    from: ObjectId,
    toUser: ObjectId,
    content: String,
    createAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('message', Message)