const fs = require("fs")
const path = require("path")
const User = require("../models").User
const crypto = require("crypto")

function createNameByBuffer(buffer) {
    return crypto.createHash('md5').update(buffer).digest('hex')
}

// 判断temp文件夹是否存在，不存在则创建
if (!fs.existsSync('./static/temp')) {
    fs.mkdirSync('./static/temp')
}

module.exports = socket => ({ from, data }) => {
    if (!from) {
        socket.emit('modifyAvatar', { status: 400, msg: '参数from缺失' })
    }

    let filename = `temp/${createNameByBuffer(data.file)}.${data.type}`

    let url = path.resolve(process.cwd(), `./static/${filename}`)
    fs.writeFile(url, data.file, err => {
        if (err) console.error(err)
    })

    User
        .findByIdAndUpdate(from, {
            avatar: `/img/${filename}`
        })
        .exec()
        .then(user => {
            let body = _.assign(user.toObject(), {
                avatar: `/img/${filename}`
            })

            socket.emit('modifyAvatar', body)
        })
        .catch(err => {
            socket.emit('modifyAvatar', err)
        })
}