var http = require('http');
var express = require('express');
var app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(3000);

app.get('/', (req, res) => {
    res.send("<div>Hello world!</div>")
});
app.use('/', require("./routes/stream"));

// Socket.io connection
let allClients = [];
io.on('connection', (socket) => {
    allClients.push(socket);
    socket.on('disconnect', function() {
        let i = allClients.indexOf(socket);
        allClients.splice(i, 1);
    });

    socket.emit('alert', "Alert");
});
