const User = require("../models").User

module.exports = (socket, io) => ({ from, friendId }) => {

	Promise.all([
		User.update({_id: from}, {$addToSet: {friends: friendId}}),
		User.update({_id: friendId}, {$addToSet: {friends: from}})
	])
	.then(() => {
		io.sockets.emit('addFriend', { friendId })
	})
	.catch(err => {
	    socket.emit('addFriend', err)
	})
        
}