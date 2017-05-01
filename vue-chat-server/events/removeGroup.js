const User = require("../models").User
const Group = require("../models").Group

module.exports = socket => ({ from, groupId }) => {

	Promise.all([
		User.findByIdAndUpdate(from, {$pull: {groups: groupId}}).exec(),
		Group.update({_id: groupId}, {$pull: {member: from}})
	])
	.then((cols) => {
        socket.broadcast.emit(groupId, {
            groupId,
            data: {
            	type: 'system',
	            name: '系统消息',
	            content: `${cols[0].name} 已经退出聊天群组了`
            }
        })
		socket.emit('removeGroup', {})
	})
	.catch(err => {
	    socket.emit('removeGroup', err)
	})
        
}