// 连接webSocket
const socket = io.connect("/")

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

// 移除用户自身和所有群组的监听器
function removeGroupAndUserListeners(user) {
    socket.removeAllListeners(user._id)
    _.forEach(user.groups, item => {
        socket.removeAllListeners(item)
    })
}

// 为单个群组添加监听
function addSingleGroupListener(groupId, state) {
    socket.on(groupId, ({ from, data }) => {
        if (data.type) return
        if (from !== state.user._id) {
            let notice = document.getElementById('notice')
            notice.play()
        }
        if (groupId === state.currentOne._id) {
            state.messages.push(data)
        } else {
            if (_.isString(state.count)) {
                state.count = { [groupId]: 1 }
            } else {
                let count = state.count[groupId]
                state.count = _.assign(state.count, {
                    [groupId]: count ? ++count : 1
                })
            }
        }
    })
}

// 删除单个群组的监听
function removeSingleGroupListener(groupId) {
    socket.removeAllListeners(groupId)
}

export { 
    socket, 
    addGroupsListener, 
    addUserListener, 
    removeGroupAndUserListeners, 
    addSingleGroupListener,
    removeSingleGroupListener
}