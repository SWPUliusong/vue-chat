const Group = require("../models").Group

module.exports = socket => ({ keyword }) => {
    Group
        .find({
            name: {$regex: new RegExp(keyword)}
        })
        .limit(5)
        .select('_id name avatar')
        .exec()
        .then(groups => {
            if (!groups) return []
            return groups
        })
        .then(list => {
            socket.emit('searchGroups', list)
        })
        .catch(err => {
            socket.emit('searchGroups', err)
        })
}