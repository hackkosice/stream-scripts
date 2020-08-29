const router = require('express').Router();
const path = require('path');

router.get('/stream-alert', (req, res) => {
    res.sendFile(path.resolve('express/stream-alert.html'));
});

router.post('/slack-command/stream-alert', (req, res) => {
    console.log(`Command from ${req.body.user_name}: /stream-alert ${req.body.text}`)

    let parts = req.body.text.split(" ", 2);
    const seconds = parseInt(parts[0]);
    if (parts.length < 2 || isNaN(seconds)) {
        res.send("Incorrect format");
        res.sendStatus(422);
        return;
    }
    let message = {
        text: parts[1],
        seconds: seconds,
    }
    router.socketClients.forEach(socket => {
        socket.emit('alert', message);
    })

    res.sendStatus(200);
});

module.exports = router;
