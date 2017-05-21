import Vue from 'vue'

function fileValid(file, size = 100) {
    let types = ['image/jpeg', 'image/gif', 'image/png']
    let res = {
        flag: true
    }
    if (types.indexOf(file.type) < 0) {
        res.flag = false
        res.msg = '文件类型只能是gif，png，jpg'
    } else if (file.size > size * 1024) {
        res.flag = false
        res.msg = `图片大小不得超过${size}KB`
    }

    return res
}

fileValid.types = {
    'image/jpeg': 'jpg',
    'image/gif': 'gif',
    'image/png': 'png'
}

Object.defineProperty(Vue.prototype, 'fileValid', {
    value: fileValid
})