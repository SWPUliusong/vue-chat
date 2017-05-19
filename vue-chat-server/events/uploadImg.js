const fs = require("fs")
const path = require("path")
const User = require("../models").User
const crypto = require("crypto")

function createNameByBuffer(buffer) {
    return crypto.createHash('md5').update(buffer).digest('hex')
}

module.exports = socket => ({ from, data }) => {
    if (!from) {
        socket.emit('uploadImg', { status: 400, msg: '参数from缺失' })
    }

    let filename = `temp/${createNameByBuffer(data.file)}.${data.type}`

    let url = path.resolve(process.cwd(), `./static/${filename}`)
    fs.writeFile(url, data.file, err => {
        if (err) {
            return socket.emit('uploadImg', err)
        }

        return socket.emit('uploadImg', { img: `/img/${filename}` })
    })
}