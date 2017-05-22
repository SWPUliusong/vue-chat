const User = require("../models").User
const Group = require("../models").Group

module.exports = socket => ({ from, data }) => {
    Group
        .create({
            name: data.name,
            member: [from]
        })
        .then(group => {
            return User
                    .update({ _id: from }, { $addToSet: { groups: group._id } })
                    .then(() => group._id)
        })
        .then(groupId => {
            socket.emit('createGroup', { groupId })
        })
        .catch(err => {
            socket.emit('createGroup', err)
        })
}