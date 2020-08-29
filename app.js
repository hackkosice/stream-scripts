var http = require('http');
var express = require('express');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
var app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);

const { createEventAdapter } = require('@slack/events-api');
//const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

server.listen(3001, "0.0.0.0");

// ===== Socket.io =====
let allClients = [];
io.on('connection', (socket) => {
    allClients.push(socket);
    socket.on('disconnect', function() {
        let i = allClients.indexOf(socket);
        allClients.splice(i, 1);
    });
});

// ===== SLACK =====
// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
/*slackEvents.on('message', (event) => {
    console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
});
slackEvents.on('error', console.error);*/


app.use(bodyParser.urlencoded({ extended: true }));
app.use(sassMiddleware({
    src: __dirname+'/assets',
    dest: __dirname+'/assets',
    outputStyle: 'compressed',
    indentedSyntax: false,
    prefix: '/',  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));


app.get('/', (req, res) => {
    res.send("<div>Hello world!</div>")
});
let streamRouter = require("./routes/stream");
streamRouter.socketClients = allClients;
app.use('/', streamRouter);
//app.use('/slack/events', slackEvents.expressMiddleware());
app.use(express.static('static'))
app.use(express.static('assets'))
