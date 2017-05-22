export default {
    setUser(state, { user }) {
        state.user = user
    },
    removeUser(state) {
        _.assign(state, {
            user: '',
            list: '',
            activeList: 'friends',
            currentOne: '',
            isChange: true,
            messages: [],
            count: '',
        })
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
    },
    toggleFaces(state) {
        state.facesShow = !state.facesShow
    },
    hiddenFaces(state) {
        state.facesShow = false
    }
}