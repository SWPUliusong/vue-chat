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
    signOut({ commit }) {
        commit('removeUser')
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
    searchUsers({ commit }, keyword) {
        return ws.searchUsers(keyword).then(result => {
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
        let params = {
            from: state.user._id,
            friendId: state.currentOne._id
        }

        return ws.removeFriend(params).then(() => {
            commit('removeCurrentOne')
            dispatch('getList')
        })
    },
    removeGroup({ commit, state, dispatch }) {
        let params = {
            from: state.user._id,
            groupId: state.currentOne._id
        }

        return ws.removeGroup(params).then(() => {
            commit('removeCurrentOne')
            dispatch('getList')
        })
    },
    getGroupMember({ state }) {
        let groupId = state.currentOne._id
        return ws.getGroupMember({ groupId }).then(({ data }) => data)
    }
}