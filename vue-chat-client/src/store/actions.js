import ws from './ws'

export default {
    getUser({ commit, state }) {
        return ws.getUser(state.user._id).then(user => {
            commit('setUser', { user })
        })
    },
    signIn({ commit }, payload) {
        return ws.signIn(payload).then(user => {
            commit('setUser', { user })
        })
    },
    signUp({ commit }, payload) {
        return ws.signUp(payload).then(user => {
            commit('setUser', { user })
        })
    },
    signOut({ commit, dispatch }) {
        commit('removeUser')
        dispatch('setActiveList', 'friends')
    },
    setActiveList({ commit }, type) {
        commit('setActiveList', { type })
        commit('removeCurrentOne')
    },
    getList({ commit, state }) {
        if (state.activeList === 'friends') {
            return ws.getFriends(state.user._id)
                .then(list => commit('setList', list))
        } else {
            return ws.getGroups(state.user._id)
                .then(list => commit('setList', list))
        }
    },
    createGroup({ state, dispatch }, keyword) {
        return ws.createGroup({
            from: state.user._id,
            data: { name: keyword }
        }).then(() => {
            return dispatch('getList')
        })
    },
    searchUsers({ state, commit }, keyword) {
        return ws.searchUsers({
            keyword,
            from: state.user._id
        }).then(result => {
            commit('setResult', { result })
        })
    },
    searchGroups({ commit }, keyword) {
        return ws.searchGroups(keyword).then(result => {
            commit('setResult', { result })
        })
    },
    addGroup({ state, dispatch }, groupId) {
        return ws.addGroup({
            from: state.user._id,
            groupId
        }, ({ from, data }) => {
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
        }).then(() => {
            return dispatch('getList')
        })
    },
    addFriend({ state, dispatch }, friendId) {
        return ws.addFriend({
            from: state.user._id,
            friendId
        }).then(() => {
            return dispatch('getList')
        })
    },
    removeResult({ commit }) {
        commit('removeResult')
    },
    changeCurrentOne({ commit }, item) {
        commit('changeCurrentOne', { item })
    },
    pullMsg({ commit, state }, page) {
        let params = {
            from: state.user._id,
            data: { page }
        }
        if (state.activeList === 'friends') {
            params.friendId = state.currentOne._id
        } else {
            params.groupId = state.currentOne._id
        }

        return ws.pullMsg(params).then(({ data }) => {
            commit('pullMsg', data)
            if (data.length < 1) return false
        })
    },
    pushMsg({ commit, state }, content) {
        let params = {
            from: state.user._id,
            data: { content }
        }

        if (state.activeList === 'friends') {
            params.friendId = state.currentOne._id
        } else {
            params.groupId = state.currentOne._id
        }

        ws.pushMsg(params)
        if (state.activeList === 'friends') {
            commit('pushMsg', {
                from: _.pick(state.user, ['_id', 'name', 'avatar']),
                content
            })
        }
    },
    removeFriend({ commit, state, dispatch }) {
        let id = state.currentOne._id
        let params = {
            from: state.user._id,
            friendId: id
        }

        if (state.count[id]) {
            state.count = _.assign(state.count, {
                [id]: 0
            })
        }

        return ws.removeFriend(params).then(() => {
            commit('removeCurrentOne')
            dispatch('getList')
        })
    },
    removeGroup({ commit, state, dispatch }) {
        let id = state.currentOne._id
        let params = {
            from: state.user._id,
            groupId: id
        }

        if (state.count[id]) {
            state.count = _.assign(state.count, {
                [id]: 0
            })
        }

        return ws.removeGroup(params).then(() => {
            commit('removeCurrentOne')
            dispatch('getList')
        })
    },
    getGroupMember({ state }) {
        let groupId = state.currentOne._id
        return ws.getGroupMember({ groupId }).then(({ data }) => data)
    },
    updateUser({ state, commit }, data) {
        let params = {
            from: state.user._id,
            data
        }

        return ws.updateUser(params).then(user => {
            commit('setUser', { user })
            return user
        })
    },
    modifyAvatar({ state, commit }, data) {
        let params = {
            from: state.user._id,
            data
        }

        return ws.modifyAvatar(params).then(user => commit('setUser', { user }))
    },
    uploadImg({ state, commit }, data) {
        let params = {
            from: state.user._id,
            data
        }

        return ws.uploadImg(params)
    }
}