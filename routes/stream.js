const router = require('express').Router();
const path = require('path');
let emoji = new (require('emoji-js'))();
emoji.replace_mode = 'unified';
emoji.allow_native = true;
let { escapeForSlackWithMarkdown } = require('slack-hawk-down');

router.get('/stream-alert', (req, res) => {
    res.sendFile(path.resolve('express/stream-alert.html'));
});

router.post('/slack-command/stream-alert', (req, res) => {
    console.log(`Command from ${req.body.user_name}: /stream-alert ${req.body.text}`)

    let parts = req.body.text.split(" ", 2);
    let index = req.body.text.indexOf(" ");  // Gets the first index where a space occours
    let text = req.body.text.substr(index + 1);  // Gets the text part
    const seconds = parseInt(req.body.text.substr(0, index));
    if (parts.length < 2 || isNaN(seconds)) {
        res.send("Incorrect format");
        return;
    }
    if (seconds > 5*60) {
        res.send("Duration is too long");
        return;
    }
    // turn slack emojis to utf8
    text = emoji.replace_colons(text);
    // turn markdown syntax to html
    text = escapeForSlackWithMarkdown(text);
    let message = {
        text: text,
        seconds: seconds,
    }
    router.socketClients.forEach(socket => {
        socket.emit('alert', message);
    })

    res.sendStatus(200);
});

router.post('/slack-command/text-overlay', (req, res) => {
    console.log(`Command from ${req.body.user_name}: /text-overlay ${req.body.text}`)

    let parts = req.body.text.split(" ", 2);
    let index = req.body.text.indexOf(" ");  // Gets the first index where a space occours
    let text = req.body.text.substr(index + 1);  // Gets the text part

    const seconds = parseInt(req.body.text.substr(0, index));
    if (parts.length < 2 || isNaN(seconds)) {
        res.send("Incorrect format");
        return;
    }
    if (seconds > 5*60) {
        res.send("Duration is too long");
        return;
    }
    // turn slack emojis to utf8
    text = emoji.replace_colons(text);
    // turn markdown syntax to html
    text = escapeForSlackWithMarkdown(text);
    let title = text.split(';')[0]
    let subtitle = text.split(';')[1]
    let message = {
        title: title,
        subtitle: subtitle,
        seconds: seconds,
    }
    console.log('emitting')
    router.socketClients.forEach(socket => {
        socket.emit('text-overlay', message);
    })

    res.sendStatus(200);
});

module.exports = router;
