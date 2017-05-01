const User = require("../models").User

module.exports = (socket, io) => ({ from, friendId }) => {

	Promise.all([
		User.update({_id: from}, {$pull: {friends: friendId}}),
		User.update({_id: friendId}, {$pull: {friends: from}})
	])
	.then(() => {
		io.sockets.emit('removeFriend', { from, friendId })
	})
	.catch(err => {
	    socket.emit('removeFriend', err)
	})
        
}