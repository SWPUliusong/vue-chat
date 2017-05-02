const User = require("../models").User

module.exports = socket => ({ from, keyword }) => {
    User
        .find({
            name: {$regex: new RegExp(keyword)}
        })
        .limit(5)
        .select('_id name avatar')
        .exec()
        .then(users => {
            if (!users) return []
            return users.filter(item => item._id.toString() !== from)
        })
        .then(list => {
            socket.emit('searchUsers', list)
        })
        .catch(err => {
            socket.emit('searchUsers', err)
        })
}