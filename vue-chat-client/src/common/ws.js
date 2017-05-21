import { socket } from './socket'

export default {
    getUser(from) {
        return new Promise((res, rej) => {
            socket.emit('getUser', { from })
            socket.once('getUser', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    signIn(payload) {
        return new Promise((res, rej) => {
            socket.emit('signIn', payload)
            socket.once('signIn', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    signUp(payload) {
        return new Promise((res, rej) => {
            socket.emit('signUp', payload)
            socket.once('signUp', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    getFriends(from) {
        return new Promise((res, rej) => {
            socket.emit('getFriends', { from })
            socket.once('getFriends', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    getGroups(from) {
        return new Promise((res, rej) => {
            socket.emit('getGroups', { from })
            socket.once('getGroups', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    searchUsers({ keyword, from }) {
        return new Promise((res, rej) => {
            socket.emit('searchUsers', { keyword, from })
            socket.once('searchUsers', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    searchGroups(keyword) {
        return new Promise((res, rej) => {
            socket.emit('searchGroups', { keyword })
            socket.once('searchGroups', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    createGroup(params) {
        return new Promise((res, rej) => {
            socket.emit('createGroup', params)
            socket.once('createGroup', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    addGroup(params, listener) {
        return new Promise((res, rej) => {
            socket.emit('addGroup', params)
            socket.once('addGroup', data => {
                if (data.msg || data.message) return rej(data)

                socket.on(params.groupId, listener)
                return res(data)
            })
        })
    },
    addFriend(params) {
        return new Promise((res, rej) => {
            socket.emit('addFriend', params)
            socket.once('addFriend', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    pullMsg(params) {
        return new Promise((res, rej) => {
            socket.emit('pullMsg', params)
            socket.once('pullMsg', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    pushMsg(params) {
        socket.emit('pushMsg', params)
    },
    removeFriend(params) {
        return new Promise((res, rej) => {
            socket.emit('removeFriend', params)
            socket.once('removeFriend', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    removeGroup(params) {
        return new Promise((res, rej) => {
            socket.removeAllListeners(params.groupId)
            socket.emit('removeGroup', params)
            socket.once('removeGroup', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    getGroupMember(params) {
        return new Promise((res, rej) => {
            socket.emit('getGroupMember', params)
            socket.once('getGroupMember', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    updateUser(params) {
        return new Promise((res, rej) => {
            socket.emit('updateUser', params)
            socket.once('updateUser', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    modifyAvatar(params) {
        return new Promise((res, rej) => {
            socket.emit('modifyAvatar', params)
            socket.once('modifyAvatar', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    uploadImg(params) {
        return new Promise((res, rej) => {
            socket.emit('uploadImg', params)
            socket.once('uploadImg', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    }

}