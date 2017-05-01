const User = require("../models").User
const Group = require("../models").Group

module.exports = socket => ({ from }) => {
    User
        .findOne({_id: from})
        .select('groups')
        .exec()
        .then(doc => {
            if (doc.groups.length < 1) return []
            return Group.find({_id: {$in: doc.groups}}).select('_id name avatar').exec()
        })
        .then(list => {
            socket.emit('getGroups', list)
        })
}