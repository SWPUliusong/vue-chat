const mongoose = require("mongoose")
mongoose.Promise = require("bluebird")
mongoose.connect('mongodb://localhost:27017/wechat')

module.exports = {
    User: require("./user"),
    Group: require("./group"),
    Message: require("./message")
}