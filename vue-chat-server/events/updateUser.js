const User = require("../models").User

module.exports = socket => ({ from, data }) => {
    if (!from) {
        socket.emit('updateUser', { status: 400, msg: '参数from缺失' })
    }

    User
        .update({ _id: from }, _.pick(data, ['name', 'avatar', 'password']))
        .then(() => {
            socket.emit('updateUser', {})
        })
        .catch(err => {
            socket.emit('updateUser', err)
        })
}