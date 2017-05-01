const db = require("../models")

module.exports = socket => ({ groupId }) => {

    if (!groupId) {
        socket.emit('getGroupMember', { status: 400, msg: 'groupId缺失' })
        return
    }

    db.Group
        .findById(groupId)
        .select('member')
        .exec()
        .then(doc => {
            if (!doc) return []
            return db.User
                .find({ _id: { $in: doc.member } })
                .select('_id name avatar')
                .exec()
        })
        .then(data => {
            socket.emit('getGroupMember', { groupId, data })
        })
}