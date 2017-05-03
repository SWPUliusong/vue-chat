import socket from '../socket'

function getUser(from) {
    return new Promise((res, rej) => {
        socket.emit('getUser', { from })
        socket.once('getUser', data => {
            if (data.msg || data.message) return rej(data)
            return res(data)
        })
    })
}

// 移除所有群组的监听器
function removeAllListeners(id) {
    return getUser(id)
        .then(user => {
            _.forEach(user.groups, item => {
                socket.removeAllListeners(item)
            })
        })
}

// 登陆后为所有群组添加监听器
function addGroupsListener(user, state) {
    _.forEach(user.groups, item => {
        socket.on(item, ({ from, data }) => {
            if (data.type) return
            if (from !== user._id) {
                let notice = document.getElementById('notice')
                notice.play()
            }
            if (item === state.currentOne._id) {
                state.messages.push(data)
            } else {
                if (_.isString(state.count)) {
                    state.count = { [item]: 1 }
                } else {
                    let count = state.count[item]
                    state.count = _.assign(state.count, {
                        [item]: count ? ++count : 1
                    })
                }
            }
        })
    })
}

// 登陆后移除前一个用户的消息监听器,并为新用户添加消息监听器
function addUserListener(user, state) {
    let old = state.user
    socket.removeAllListeners(old._id)
    socket.on(user._id, ({ from, data }) => {
        let notice = document.getElementById('notice')
        notice.play()
        if (from === state.currentOne._id) {
            state.messages.push(data)
        } else {
            if (_.isString(state.count)) {
                state.count = { [from]: 1 }
            } else {
                let count = state.count[from]
                state.count = _.assign(state.count, {
                    [from]: count ? ++count : 1
                })
            }
        }
    })
}


export default {
    setUser(state, { user }) {
        // 初始化用户监听器
        addUserListener(user, state)
        state.user = user
        // 初始化群组监听器
        addGroupsListener(user, state)
    },
    removeUser(state) {
        socket.removeAllListeners(state.user._id)
        removeAllListeners(state.user._id)
        state.user = ''
        state.count = ''
        state.list = ''
        state.activeList = 'friends'
        state.currentOne = ''
        state.isChange = true
        state.messages = []
    },
    setActiveList(state, { type }) {
        state.isChange = true
        state.activeList = type
    },
    setList(state, list) {
        state.list = list
    },
    setResult(state, { result }) {
        state.result = result
    },
    removeResult(state) {
        state.result = ''
    },
    changeCurrentOne(state, { item }) {
        state.isChange = true
        if (state.count[item._id]) {
            state.count = _.assign(state.count, {
                [item._id]: 0
            })
        }
        state.currentOne = item
    },
    removeCurrentOne(state) {
        state.currentOne = ''
        state.messages = []
    },
    notChange(state) {
        state.isChange = false
    },
    pullMsg(state, messages) {
        if (state.isChange) {
            state.messages = messages
        } else {
            state.messages = messages.concat(state.messages)
        }
    },
    pushMsg(state, msg) {
        state.messages.push(msg)
    }
}