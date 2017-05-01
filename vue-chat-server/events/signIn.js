const User = require("../models").User

module.exports = socket => ({ data }) => {
    User
        .findOne({email: data.email})
        .exec()
        .then(user => {
            if(!user) {
                return Promise.reject({status: 401, msg: '该用户不存在'})
            } else if (user.password !== data.password) {
            	return Promise.reject({status: 403, msg: '密码错误'})
            } else {
	            socket.emit('signIn', user.toObject())
            }
        })
        .catch(err => {
            socket.emit('signIn', err)
        })
}