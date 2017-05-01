const User = require("../models").User

module.exports = socket => ({ data }) => {
    User
        .findOne({email: data.email})
        .exec()
        .then(user => {
            if(user) {
                return Promise.reject({status: 403, msg: '邮箱已被注册'})
            }
            return false
        })
        .then(() => {
            return User.create(_.pick(data, ['name', 'password', 'email']))
        })
        .then(user => {
            socket.emit('signUp', user.toObject())
        })
        .catch(err => {
            socket.emit('signUp', err)
        })
}