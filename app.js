var http = require('http');
var express = require('express');
var app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);

const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

server.listen(3000);

// ===== Socket.io =====
let allClients = [];
io.on('connection', (socket) => {
    allClients.push(socket);
    socket.on('disconnect', function() {
        let i = allClients.indexOf(socket);
        allClients.splice(i, 1);
    });

    socket.emit('alert', "Alert");
});

// ===== SLACK =====
// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on('message', (event) => {
    console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
});
slackEvents.on('error', console.error);



app.get('/', (req, res) => {
    res.send("<div>Hello world!</div>")
});
app.use('/', require("./routes/stream"));
app.use('/slack/events', slackEvents.expressMiddleware());
