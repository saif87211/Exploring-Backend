const express = require('express');
const route = require('./movies');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'My Movie App',
        meassage: 'Movies List...'
    });
});

module.exports = router;