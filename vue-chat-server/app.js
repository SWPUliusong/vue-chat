global._ = require("lodash")
global.Promise = require("bluebird")

let server = require('http').createServer()
let io = require('socket.io')(server);
let eventsMap = require("./eventsMap")('./events')

server.listen(3002, () => {
    console.log(`server listening on ${server.address().port}`)
});

io.on('connection', function (socket) {
    eventsMap(socket, io)
});
