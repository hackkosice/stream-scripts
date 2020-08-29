const router = require('express').Router();
const path = require('path');

router.get('/stream-alert', (req, res) => {
    res.sendFile(path.resolve('express/stream-alert.html'));
});

router.get('/slack-webhook')

module.exports = router;
