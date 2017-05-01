import socket from '../socket'

export default {
    setUser(state, { user }) {
        let old = state.user
        socket.removeAllListeners(old._id)
        socket.on(user._id, ({ from, data }) => {
            if (from !== state.currentOne._id) return
            state.messages.push(data)
        })
        state.user = user
    },
    removeUser(state) {
        socket.removeAllListeners(state.user._id)
        state.user = ''
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
        let oldId = state.currentOne._id
        if(oldId) socket.removeAllListeners(oldId)
        if (state.activeList === 'groups') {
            socket.on(item._id, ({ groupId, data }) => {
                state.messages.push(data)
            })
        }
        state.currentOne = item
    },
    removeCurrentOne(state) {
        socket.removeAllListeners(state.currentOne._id)
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