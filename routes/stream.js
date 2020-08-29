const router = require('express').Router();
const path = require('path');
let EmojiConvertor = require('emoji-js');
let emoji = new EmojiConvertor();
emoji.replace_mode = 'unified';
emoji.allow_native = true;

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
    let message = {
        text: emoji.replace_colons(text),
        seconds: seconds,
    }
    router.socketClients.forEach(socket => {
        socket.emit('alert', message);
    })

    res.sendStatus(200);
});

module.exports = router;
