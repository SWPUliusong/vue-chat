const db = require("../models")

module.exports = (socket, io) => ({ from, friendId, groupId, data }) => {

    if (!data.content || !from) {
        socket.emit('pushMsg', { status: 400, msg: '消息字段不全' })
        return
    }

    if (groupId) {
        createMsg({
            toGroup: groupId,
            from: from,
            content: data.content
        }).then(message => {
            io.sockets.emit(groupId, {
                from,
                data: message
            })
        })
    } else if (friendId) {
        createMsg({
            toUser: friendId,
            from: from,
            content: data.content
        }).then(message => {
            io.sockets.emit(friendId, {
                from,
                data: message
            })
        })
    } else {
        socket.emit('pushMsg', { status: 400, msg: '消息字段不全' })
    }
}


function createMsg(data) {
    return db.Message
        .create(data)
        .then(msg => {
            msg = msg.toObject();
            return db.User
                .findById(msg.from)
                .select('_id name avatar')
                .exec()
                .then(user => {
                    msg.from = user
                    return msg
                })
        })
}