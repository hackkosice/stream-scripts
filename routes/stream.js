const router = require('express').Router();
const path = require('path');

router.get('/stream-alert', (req, res) => {
    res.sendFile(path.resolve('express/stream-alert.html'));
});

router.post('/slack-command/stream-alert', (req, res) => {
    console.log(`Command from ${req.body.user_name}: /stream-alert ${req.body.text}`)

    router.socketClients.forEach(socket => {
        socket.emit('alert', req.body.text);
    })

    res.sendStatus(200);
});

module.exports = router;
